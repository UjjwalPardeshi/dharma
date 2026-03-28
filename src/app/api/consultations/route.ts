import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { moderateInput } from "@/lib/moderation";
import { detectCrisis, getCrisisResponse } from "@/lib/safety";
import { buildRagContext } from "@/lib/rag";
import { generateConsultationSync } from "@/lib/llm";
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

async function checkQuota(_userId: string): Promise<{ allowed: boolean; reason?: string }> {
  // Quota disabled for development
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

    // 8. Generate consultation (non-streaming for clean formatted response)
    const { response, fullText, isClarifying } = await generateConsultationSync({
      query,
      userId,
      sessionId: chatSession.id,
      ragContext: ragContext.verses,
      tone: preferences?.tone,
      tradition: preferences?.tradition,
    });

    // 9. Save consultation to database
    const consultation = await prisma.consultation.create({
      data: {
        sessionId: chatSession.id,
        userId,
        userQuery: query,
        responseJson: response as any,
        aiResponse: fullText,
        isClarifying,
      },
    });

    // 10. Log usage
    await prisma.usageLog.create({
      data: {
        userId,
        action: "consultation",
        metadata: { consultationId: consultation.id },
      },
    });

    return Response.json({
      success: true,
      data: {
        consultationId: consultation.id,
        sessionId: chatSession.id,
        response,
        isClarifying,
      },
    } as ApiResponse<any>);
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
