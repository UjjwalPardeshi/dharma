import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { ApiResponse, Session } from "@/types";

export async function GET() {
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

    const sessions = await prisma.chatSession.findMany({
      where: { userId },
      orderBy: { startedAt: "desc" },
    });

    const formattedSessions: Session[] = sessions.map((s) => ({
      id: s.id,
      userId: s.userId,
      title: s.title,
      topicCategory: s.topicCategory,
      startedAt: s.startedAt.toISOString(),
      lastMessageAt: s.lastMessageAt?.toISOString() || s.startedAt.toISOString(),
      endedAt: s.endedAt?.toISOString() || null,
    }));

    return Response.json({
      success: true,
      data: formattedSessions,
      meta: {
        total: formattedSessions.length,
        page: 1,
        limit: formattedSessions.length,
      },
    } as ApiResponse<Session[]>);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to fetch sessions",
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}

export async function POST() {
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

    const newSession = await prisma.chatSession.create({
      data: {
        userId,
        title: null,
        startedAt: new Date(),
      },
    });

    const formattedSession: Session = {
      id: newSession.id,
      userId: newSession.userId,
      title: newSession.title,
      topicCategory: newSession.topicCategory,
      startedAt: newSession.startedAt.toISOString(),
      lastMessageAt: newSession.lastMessageAt?.toISOString() || newSession.startedAt.toISOString(),
      endedAt: newSession.endedAt?.toISOString() || null,
    };

    return Response.json(
      {
        success: true,
        data: formattedSession,
      } as ApiResponse<Session>,
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating session:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to create session",
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}
