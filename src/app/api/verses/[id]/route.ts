import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import type { ApiResponse, Verse } from "@/types/index";

interface VerseWithScripture {
  id: string;
  scriptureId: string;
  verseNumber: string;
  text: string;
  translation: string | null;
  themes: unknown;
  tags: unknown;
  scripture: {
    title: string;
    tradition: string;
    description: string | null;
    authorOrSource: string | null;
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<VerseWithScripture | null>>> {
  try {
    const { id } = await params;
    const verse = await prisma.verse.findUnique({
      where: { id },
      include: {
        scripture: {
          select: {
            title: true,
            tradition: true,
            description: true,
            authorOrSource: true,
          },
        },
      },
    });

    if (!verse) {
      return NextResponse.json(
        {
          success: false,
          error: "Verse not found",
        },
        { status: 404 }
      );
    }

    const data: VerseWithScripture = {
      id: verse.id,
      scriptureId: verse.scriptureId,
      verseNumber: verse.verseNumber,
      text: verse.text,
      translation: verse.translation,
      themes: verse.themes,
      tags: verse.tags,
      scripture: {
        title: verse.scripture.title,
        tradition: verse.scripture.tradition,
        description: verse.scripture.description,
        authorOrSource: verse.scripture.authorOrSource,
      },
    };

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching verse:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch verse",
      },
      { status: 500 }
    );
  }
}
