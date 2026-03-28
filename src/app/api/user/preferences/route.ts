import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const preferencesSchema = z.object({
  age: z.number().int().min(13).max(120).optional(),
  culturalBackground: z.string().optional(),
  preferredTradition: z
    .enum(["hindu", "buddhist", "greek", "universal"])
    .optional(),
  tonePreference: z
    .enum(["casual", "devotional", "philosophical", "practical"])
    .optional(),
  notificationEnabled: z.boolean().optional(),
  dailyWisdom: z.boolean().optional(),
  language: z.string().optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = preferencesSchema.parse(body);

    // Update user profile
    const updateData: Record<string, unknown> = {};
    if (validatedData.age !== undefined)
      updateData.age = validatedData.age;
    if (validatedData.culturalBackground !== undefined)
      updateData.culturalBackground = validatedData.culturalBackground;
    if (validatedData.preferredTradition !== undefined)
      updateData.preferredTradition = validatedData.preferredTradition;

    if (Object.keys(updateData).length > 0) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: updateData,
      });
    }

    // Update preferences
    const preferencesData: Record<string, unknown> = {};
    if (validatedData.tonePreference !== undefined)
      preferencesData.tonePreference = validatedData.tonePreference;
    if (validatedData.notificationEnabled !== undefined)
      preferencesData.notificationEnabled = validatedData.notificationEnabled;
    if (validatedData.dailyWisdom !== undefined)
      preferencesData.dailyWisdom = validatedData.dailyWisdom;
    if (validatedData.language !== undefined)
      preferencesData.language = validatedData.language;

    if (Object.keys(preferencesData).length > 0) {
      await prisma.userPreferences.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          ...preferencesData,
        },
        update: preferencesData,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Preferences updated successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || "Validation failed" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { preferences: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          age: user.age,
          culturalBackground: user.culturalBackground,
          preferredTradition: user.preferredTradition,
        },
        preferences: user.preferences,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}
