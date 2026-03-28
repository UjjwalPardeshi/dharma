import { prisma } from "@/lib/db";
import bcryptjs from "bcryptjs";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, password } = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcryptjs.hash(password, 10);

    // Create user with default preferences and subscription
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        preferences: {
          create: {
            tonePreference: "practical",
            notificationEnabled: true,
            dailyWisdom: true,
            language: "en",
          },
        },
        subscription: {
          create: {
            planType: "free",
            status: "active",
            consultationLimit: 5,
            consultationsUsed: 0,
          },
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || "Validation failed" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
