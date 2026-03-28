import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
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
  };
}

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<VerseWithScripture[]>>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q") || "";
    const tradition = searchParams.get("tradition");
    const theme = searchParams.get("theme");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {
      AND: [],
    };

    // Full-text search on verse text
    if (q.trim()) {
      where.AND.push({
        OR: [
          {
            text: {
              search: q,
            },
          },
          {
            tags: {
              hasSome: [q],
            },
          },
        ],
      });
    }

    // Filter by tradition
    if (tradition && tradition !== "all") {
      where.AND.push({
        scripture: {
          tradition: tradition,
        },
      });
    }

    // Filter by theme
    if (theme && theme !== "all") {
      where.AND.push({
        themes: {
          hasSome: [theme],
        },
      });
    }

    // Remove empty AND array if no filters
    if (where.AND.length === 0) {
      delete where.AND;
    }

    const [total, verses] = await Promise.all([
      prisma.verse.count({ where: where.AND ? where : undefined }),
      prisma.verse.findMany({
        where: where.AND ? where : undefined,
        include: {
          scripture: {
            select: {
              title: true,
              tradition: true,
            },
          },
        },
        skip: offset,
        take: limit,
        orderBy: {
          verseNumber: "asc",
        },
      }),
    ]);

    const data = verses.map((verse) => ({
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
      },
    }));

    return NextResponse.json({
      success: true,
      data,
      meta: {
        total,
        page: Math.floor(offset / limit) + 1,
        limit,
      },
    });
  } catch (error) {
    console.error("Error searching verses:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search verses",
      },
      { status: 500 }
    );
  }
}
