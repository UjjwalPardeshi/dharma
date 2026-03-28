import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { ApiResponse, UserJourney } from "@/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
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
    const { id: journeyId } = await params;

    // Verify journey exists
    const journey = await prisma.journey.findUnique({
      where: { id: journeyId },
    });

    if (!journey) {
      return Response.json(
        {
          success: false,
          error: "Journey not found",
        } as ApiResponse<never>,
        { status: 404 }
      );
    }

    // Check if user already has an active journey
    const existingUserJourney = await prisma.userJourney.findUnique({
      where: {
        userId_journeyId: {
          userId,
          journeyId,
        },
      },
    });

    if (existingUserJourney) {
      return Response.json(
        {
          success: false,
          error: "You have already started this journey",
        } as ApiResponse<never>,
        { status: 409 }
      );
    }

    // Create user journey
    const userJourney = await prisma.userJourney.create({
      data: {
        userId,
        journeyId,
        currentDay: 1,
        status: "active",
      },
      include: {
        journey: true,
      },
    });

    const response: UserJourney = {
      id: userJourney.id,
      userId: userJourney.userId,
      journey: {
        id: userJourney.journey.id,
        title: userJourney.journey.title,
        slug: userJourney.journey.slug,
        description: userJourney.journey.description,
        durationDays: userJourney.journey.durationDays,
        theme: userJourney.journey.theme,
        tradition: userJourney.journey.tradition as "hindu" | "buddhist" | "greek" | "universal",
        isPremium: userJourney.journey.isPremium,
      },
      currentDay: userJourney.currentDay,
      startedAt: userJourney.startedAt.toISOString(),
      completedAt: userJourney.completedAt?.toISOString() || null,
      status: userJourney.status as "active" | "completed" | "paused",
    };

    return Response.json(
      {
        success: true,
        data: response,
      } as ApiResponse<UserJourney>,
      { status: 201 }
    );
  } catch (error) {
    console.error("Start journey error:", error);

    return Response.json(
      {
        success: false,
        error: "Internal server error",
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}
