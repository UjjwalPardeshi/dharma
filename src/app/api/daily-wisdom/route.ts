import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import type { ApiResponse, DailyWisdom } from "@/types/index";
import crypto from "crypto";

interface DailyWisdomResponse {
  id: string;
  verse: {
    id: string;
    scriptureId: string;
    verseNumber: string;
    text: string;
    translation: string | null;
    themes: string[];
    tags: string[];
    scripture: {
      title: string;
      tradition: string;
      description: string | null;
      authorOrSource: string | null;
    };
  };
  aiInsight: string;
  date: string;
}

function getVerseIndexForDate(totalVerses: number, date: Date): number {
  // Create a deterministic hash based on the date (YYYY-MM-DD)
  const dateStr = date.toISOString().split("T")[0];
  const hash = crypto
    .createHash("sha256")
    .update(dateStr)
    .digest();
  const hashNum = Buffer.from(hash).readUInt32BE(0);
  return hashNum % totalVerses;
}

export async function GET(): Promise<NextResponse<ApiResponse<DailyWisdomResponse | null>>> {
  try {
    // Get total verse count
    const totalVerses = await prisma.verse.count();

    if (totalVerses === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No verses available",
        },
        { status: 404 }
      );
    }

    // Determine which verse to show today
    const today = new Date();
    const verseIndex = getVerseIndexForDate(totalVerses, today);

    // Fetch the verse for today
    const verse = await prisma.verse.findMany({
      take: 1,
      skip: verseIndex,
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

    if (!verse || verse.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Verse not found",
        },
        { status: 404 }
      );
    }

    const selectedVerse = verse[0];

    // Generate a simple AI insight based on the verse themes
    const themesArray = (Array.isArray(selectedVerse.themes) ? selectedVerse.themes : []) as string[];
    const themes = themesArray.length > 0 ? themesArray.join(", ") : "wisdom";
    const aiInsight =
      `Reflect on the themes of ${themes} in your daily life. ` +
      `This ancient wisdom from ${selectedVerse.scripture.title} invites you to ` +
      `contemplate how these principles apply to your current circumstances and challenges.`;

    const tagsArray = (Array.isArray(selectedVerse.tags) ? selectedVerse.tags : []) as string[];
    const data: DailyWisdomResponse = {
      id: selectedVerse.id,
      verse: {
        id: selectedVerse.id,
        scriptureId: selectedVerse.scriptureId,
        verseNumber: selectedVerse.verseNumber,
        text: selectedVerse.text,
        translation: selectedVerse.translation,
        themes: themesArray,
        tags: tagsArray,
        scripture: {
          title: selectedVerse.scripture.title,
          tradition: selectedVerse.scripture.tradition,
          description: selectedVerse.scripture.description,
          authorOrSource: selectedVerse.scripture.authorOrSource,
        },
      },
      aiInsight,
      date: today.toISOString().split("T")[0],
    };

    return NextResponse.json(
      {
        success: true,
        data,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching daily wisdom:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch daily wisdom",
      },
      { status: 500 }
    );
  }
}
