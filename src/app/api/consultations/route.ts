import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { moderateInput } from "@/lib/moderation";
import { detectCrisis, getCrisisResponse } from "@/lib/safety";
import { buildRagContext } from "@/lib/rag";
import { generateConsultation, getMockConsultationResponse } from "@/lib/llm";
import type { ApiResponse } from "@/types";

const consultationRequestSchema = z.object({
  query: z.string().min(1).max(5000),
  sessionId: z.string().optional(),
  preferences: z
    .object({
      tone: z
        .enum(["casual", "devotional", "philosophical", "practical"])
        .optional(),
      tradition: z
        .enum(["hindu", "buddhist", "greek", "universal"])
        .optional(),
    })
    .optional(),
});

type ConsultationRequest = z.infer<typeof consultationRequestSchema>;

async function checkQuota(userId: string): Promise<{ allowed: boolean; reason?: string }> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription) {
    return {
      allowed: false,
      reason: "No active subscription found",
    };
  }

  if (subscription.status !== "active") {
    return {
      allowed: false,
      reason: "Your subscription is not active",
    };
  }

  // Check monthly quota for free plan
  if (subscription.planType === "free") {
    // Calculate reset date (first day of month)
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const usage = await prisma.usageLog.count({
      where: {
        userId,
        createdAt: {
          gte: monthStart,
        },
      },
    });

    if (usage >= 5) {
      return {
        allowed: false,
        reason: "Free plan limit (5 consultations/month) reached",
      };
    }
  }

  return { allowed: true };
}

async function getOrCreateSession(
  userId: string,
  sessionId?: string
) {
  if (sessionId) {
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
    });
    if (session && session.userId === userId) {
      return session;
    }
  }

  // Create new session
  return prisma.chatSession.create({
    data: {
      userId,
      title: null,
      startedAt: new Date(),
    },
  });
}

export async function POST(request: Request) {
  try {
    // 1. Authenticate user
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json(
        {
          success: false,
          error: "Unauthorized",
        } as ApiResponse<never>,
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 2. Parse and validate input
    const body = await request.json();
    const parsed = consultationRequestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          error: "Invalid request format",
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    const data: ConsultationRequest = parsed.data;
    const { query, sessionId, preferences } = data;

    // 3. Run content moderation
    const moderationResult = moderateInput(query);
    if (!moderationResult.allowed) {
      return Response.json(
        {
          success: false,
          error: moderationResult.reason || "Query rejected by content moderation",
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    // 4. Check quota
    const quotaCheck = await checkQuota(userId);
    if (!quotaCheck.allowed) {
      return Response.json(
        {
          success: false,
          error: quotaCheck.reason,
        } as ApiResponse<never>,
        { status: 429 }
      );
    }

    // 5. Check for crisis (will save SafetyFlag after creating consultation)
    const crisisDetection = detectCrisis(query);
    if (crisisDetection.detected) {

      const crisisResponse = getCrisisResponse(crisisDetection.type!);

      return new Response(
        `data: ${JSON.stringify({
          type: "crisis",
          content: crisisResponse,
        })}\n\n`,
        {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        }
      );
    }

    // 6. Get or create session
    const chatSession = await getOrCreateSession(userId, sessionId);

    // 7. Query RAG for relevant verses
    const ragContext = await buildRagContext(
      query,
      preferences?.tradition,
      5
    );

    // 8. Generate consultation with streaming
    const stream = await generateConsultation({
      query,
      userId,
      sessionId: chatSession.id,
      ragContext: ragContext.verses,
      tone: preferences?.tone,
      tradition: preferences?.tradition,
    });

    // 9. Save consultation to database (we'll log it after streaming starts)
    let fullResponse = "";
    let consultation: any = null;

    // Create streaming response
    const responseStream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          const reader = stream.getReader();

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            fullResponse += value;

            // Stream the content to client
            const chunk = `data: ${JSON.stringify({
              type: "stream",
              content: value,
            })}\n\n`;

            controller.enqueue(new TextEncoder().encode(chunk));
          }

          // Parse final response and save to DB
          try {
            const jsonMatch = fullResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              consultation = await prisma.consultation.create({
                data: {
                  sessionId: chatSession.id,
                  userId,
                  userQuery: query,
                  responseJson: parsed,
                  aiResponse: fullResponse,
                  isClarifying:
                    !parsed.mythologicalParallel?.story ||
                    !parsed.practicalGuidance?.length,
                },
              });

              // Save crisis flag if detected
              if (crisisDetection.detected) {
                await prisma.safetyFlag.create({
                  data: {
                    consultationId: consultation.id,
                    flagType: crisisDetection.type!,
                    detectedText: query.substring(0, 500),
                    confidence: crisisDetection.confidence,
                    actionTaken: "escalated",
                  },
                });
              }
            }
          } catch (e) {
            console.warn("Failed to parse consultation response:", e);
          }

          // Log usage
          await prisma.usageLog.create({
            data: {
              userId,
              action: "consultation",
              metadata: {
                consultationId: consultation?.id,
              },
            },
          });

          // Send completion marker
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ type: "done", consultationId: consultation?.id })}\n\n`
            )
          );

          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Consultation error:", error);

    return Response.json(
      {
        success: false,
        error: "Internal server error",
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}
