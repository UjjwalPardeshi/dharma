import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { ApiResponse, Session, Message } from "@/types";

interface SessionWithMessages extends Session {
  messages: Message[];
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
    const { id: sessionId } = await params;

    const chatSession = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        consultations: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!chatSession) {
      return Response.json(
        {
          success: false,
          error: "Session not found",
        } as ApiResponse<never>,
        { status: 404 }
      );
    }

    if (chatSession.userId !== userId) {
      return Response.json(
        {
          success: false,
          error: "Unauthorized",
        } as ApiResponse<never>,
        { status: 403 }
      );
    }

    // Format consultations as messages
    const messages: Message[] = [];

    for (const consultation of chatSession.consultations) {
      // Add user message
      messages.push({
        id: `user_${consultation.id}`,
        role: "user",
        content: consultation.userQuery,
        responseJson: null,
        citations: null,
        createdAt: consultation.createdAt.toISOString(),
      });

      // Add assistant message
      messages.push({
        id: `assistant_${consultation.id}`,
        role: "assistant",
        content: consultation.aiResponse,
        responseJson: (consultation.responseJson as any) || null,
        citations: (consultation.citations as any[]) || null,
        createdAt: consultation.createdAt.toISOString(),
      });
    }

    const formattedSession: SessionWithMessages = {
      id: chatSession.id,
      userId: chatSession.userId,
      title: chatSession.title,
      topicCategory: chatSession.topicCategory,
      startedAt: chatSession.startedAt.toISOString(),
      lastMessageAt: chatSession.lastMessageAt?.toISOString() || chatSession.startedAt.toISOString(),
      endedAt: chatSession.endedAt?.toISOString() || null,
      messages,
    };

    return Response.json({
      success: true,
      data: formattedSession,
    } as ApiResponse<SessionWithMessages>);
  } catch (error) {
    console.error("Error fetching session:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to fetch session",
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}
