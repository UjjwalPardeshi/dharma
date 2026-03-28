import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { ApiResponse, Journey } from "@/types";

export async function GET(request: Request) {
  try {
    // Get all available journeys
    const journeys = await prisma.journey.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform to Journey type
    const formattedJourneys: Journey[] = journeys.map((j) => ({
      id: j.id,
      title: j.title,
      slug: j.slug,
      description: j.description,
      durationDays: j.durationDays,
      theme: j.theme,
      tradition: j.tradition as "hindu" | "buddhist" | "greek" | "universal",
      isPremium: j.isPremium,
    }));

    return Response.json(
      {
        success: true,
        data: formattedJourneys,
      } as ApiResponse<Journey[]>,
      { status: 200 }
    );
  } catch (error) {
    console.error("Journeys fetch error:", error);

    return Response.json(
      {
        success: false,
        error: "Internal server error",
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}
