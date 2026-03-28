import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types/index";

interface ThemeWithCount {
  id: string;
  name: string;
  description: string | null;
  verseCount: number;
}

export async function GET(): Promise<NextResponse<ApiResponse<ThemeWithCount[]>>> {
  try {
    const themes = await prisma.theme.findMany({
      orderBy: {
        name: "asc",
      },
    });

    // Since themes are stored as JSON in Verse model, we calculate counts in application
    const verseThemeCounts: Record<string, number> = {};
    const verses = await prisma.verse.findMany({
      select: {
        themes: true,
      },
    });

    for (const verse of verses) {
      const verseThemes = Array.isArray(verse.themes) ? (verse.themes as string[]) : [];
      for (const theme of verseThemes) {
        verseThemeCounts[theme] = (verseThemeCounts[theme] || 0) + 1;
      }
    }

    const data = themes.map((theme) => ({
      id: theme.id,
      name: theme.name,
      description: theme.description,
      verseCount: verseThemeCounts[theme.slug] || 0,
    }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching themes:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch themes",
      },
      { status: 500 }
    );
  }
}
