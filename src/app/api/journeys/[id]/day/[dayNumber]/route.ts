import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { generateConsultation } from "@/lib/llm";
import type { ApiResponse, ResponseFramework } from "@/types";

const reflectionSubmitSchema = z.object({
  reflection: z.string().min(1).max(5000),
});

type ReflectionSubmit = z.infer<typeof reflectionSubmitSchema>;

export interface DayContent {
  dayNumber: number;
  verseText: string;
  verseNumber: string;
  reflectionPrompt: string;
  guidanceNotes: string;
}

export interface GuidanceResponse {
  guidance: ResponseFramework;
  fullResponse: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; dayNumber: string }> }
) {
  try {
    const { id: journeyId, dayNumber } = await params;
    const dayNum = parseInt(dayNumber, 10);

    if (isNaN(dayNum) || dayNum < 1) {
      return Response.json(
        {
          success: false,
          error: "Invalid day number",
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    // Get journey day with verse
    const journeyDay = await prisma.journeyDay.findUnique({
      where: {
        journeyId_dayNumber: {
          journeyId,
          dayNumber: dayNum,
        },
      },
      include: {
        verse: {
          include: {
            scripture: true,
          },
        },
      },
    });

    if (!journeyDay) {
      return Response.json(
        {
          success: false,
          error: "Journey day not found",
        } as ApiResponse<never>,
        { status: 404 }
      );
    }

    const dayContent: DayContent = {
      dayNumber: journeyDay.dayNumber,
      verseText: journeyDay.verse.text,
      verseNumber: journeyDay.verse.verseNumber,
      reflectionPrompt: journeyDay.reflectionPrompt,
      guidanceNotes: journeyDay.guidanceNotes,
    };

    return Response.json(
      {
        success: true,
        data: dayContent,
      } as ApiResponse<DayContent>,
      { status: 200 }
    );
  } catch (error) {
    console.error("Get day content error:", error);

    return Response.json(
      {
        success: false,
        error: "Internal server error",
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; dayNumber: string }> }
) {
  try {
    // Authenticate user
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
    const { id: journeyId, dayNumber } = await params;
    const dayNum = parseInt(dayNumber, 10);

    if (isNaN(dayNum) || dayNum < 1) {
      return Response.json(
        {
          success: false,
          error: "Invalid day number",
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    // Parse and validate input
    const body = await request.json();
    const parsed = reflectionSubmitSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          error: "Invalid request format",
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    const { reflection } = parsed.data;

    // Verify user has this journey
    const userJourney = await prisma.userJourney.findUnique({
      where: {
        userId_journeyId: {
          userId,
          journeyId,
        },
      },
      include: {
        journey: true,
      },
    });

    if (!userJourney) {
      return Response.json(
        {
          success: false,
          error: "Journey not found",
        } as ApiResponse<never>,
        { status: 404 }
      );
    }

    // Get journey day for context
    const journeyDay = await prisma.journeyDay.findUnique({
      where: {
        journeyId_dayNumber: {
          journeyId,
          dayNumber: dayNum,
        },
      },
      include: {
        verse: {
          include: {
            scripture: true,
          },
        },
      },
    });

    if (!journeyDay) {
      return Response.json(
        {
          success: false,
          error: "Journey day not found",
        } as ApiResponse<never>,
        { status: 404 }
      );
    }

    // Generate AI guidance for the reflection
    const prompt = `The user is on Day ${dayNum} of the "${userJourney.journey.title}" journey.
They are reflecting on this verse: "${journeyDay.verse.text}" (${journeyDay.verse.scripture.title})

Their reflection: "${reflection}"

Reflection prompt they were answering: "${journeyDay.reflectionPrompt}"

Provide thoughtful guidance on their reflection using the 4-layer response framework:
1. Empathetic acknowledgment of their reflection
2. A relevant mythological or spiritual parallel
3. Practical guidance building on their reflection
4. A life lesson they can apply

Format your response as a JSON object with the structure: { empatheticAcknowledgment, mythologicalParallel: { story, lesson }, practicalGuidance: [], lifeLesson }`;

    const stream = await generateConsultation({
      query: prompt,
      userId,
      sessionId: journeyId,
      ragContext: [],
    });

    let fullResponse = "";

    const responseStream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          const reader = stream.getReader();

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            fullResponse += value;

            const chunk = `data: ${JSON.stringify({
              type: "stream",
              content: value,
            })}\n\n`;

            controller.enqueue(new TextEncoder().encode(chunk));
          }

          // Parse guidance response
          try {
            const jsonMatch = fullResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const guidance = JSON.parse(jsonMatch[0]) as ResponseFramework;

              // Check if we should move to next day
              if (dayNum >= userJourney.journey.durationDays) {
                // Journey complete
                await prisma.userJourney.update({
                  where: { id: userJourney.id },
                  data: {
                    status: "completed",
                    completedAt: new Date(),
                  },
                });
              } else {
                // Move to next day
                await prisma.userJourney.update({
                  where: { id: userJourney.id },
                  data: {
                    currentDay: dayNum + 1,
                  },
                });
              }

              controller.enqueue(
                new TextEncoder().encode(
                  `data: ${JSON.stringify({ type: "done" })}\n\n`
                )
              );
            }
          } catch (e) {
            console.warn("Failed to parse guidance response:", e);
          }

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
    console.error("Submit reflection error:", error);

    return Response.json(
      {
        success: false,
        error: "Internal server error",
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}
