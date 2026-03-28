import { prisma } from "@/lib/db";
import type { ApiResponse } from "@/types";

export interface JourneyDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  durationDays: number;
  theme: string;
  tradition: string;
  isPremium: boolean;
  days: {
    dayNumber: number;
    verseText: string;
    reflectionPrompt: string;
    guidanceNotes: string;
  }[];
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const journey = await prisma.journey.findUnique({
      where: { id },
      include: {
        days: {
          include: {
            verse: true,
          },
          orderBy: {
            dayNumber: "asc",
          },
        },
      },
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

    const journeyDetail: JourneyDetail = {
      id: journey.id,
      title: journey.title,
      slug: journey.slug,
      description: journey.description,
      durationDays: journey.durationDays,
      theme: journey.theme,
      tradition: journey.tradition,
      isPremium: journey.isPremium,
      days: journey.days.map((day) => ({
        dayNumber: day.dayNumber,
        verseText: day.verse.text,
        reflectionPrompt: day.reflectionPrompt,
        guidanceNotes: day.guidanceNotes,
      })),
    };

    return Response.json(
      {
        success: true,
        data: journeyDetail,
      } as ApiResponse<JourneyDetail>,
      { status: 200 }
    );
  } catch (error) {
    console.error("Journey fetch error:", error);

    return Response.json(
      {
        success: false,
        error: "Internal server error",
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}
