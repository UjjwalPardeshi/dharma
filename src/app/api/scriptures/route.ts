import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import type { ApiResponse, Scripture } from "@/types/index";

interface ScriptureWithVerseCount extends Scripture {
  verseCount: number;
}

export async function GET(): Promise<NextResponse<ApiResponse<ScriptureWithVerseCount[]>>> {
  try {
    const scriptures = await prisma.scripture.findMany({
      include: {
        _count: {
          select: { verses: true },
        },
      },
      orderBy: {
        title: "asc",
      },
    });

    const data = scriptures.map((scripture) => ({
      id: scripture.id,
      title: scripture.title,
      tradition: scripture.tradition as any,
      description: scripture.description,
      authorOrSource: scripture.authorOrSource,
      totalVerses: scripture.totalVerses,
      verseCount: scripture._count.verses,
    }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching scriptures:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch scriptures",
      },
      { status: 500 }
    );
  }
}
