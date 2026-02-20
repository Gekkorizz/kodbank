import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { registerSchema } from "@/lib/validation";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input against schema
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      const errors = validation.error.flatten();
      const firstError = Object.values(errors.fieldErrors)[0]?.[0];

      return NextResponse.json(
        { error: firstError || "Validation failed" },
        { status: 400 },
      );
    }

    const { email, password, confirmPassword, fullName } = validation.data;

    // Double-check password match (redundant but defensive)
    if ((password ?? "").trim() !== (confirmPassword ?? "").trim()) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "This email is already registered" },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName: fullName || null,
      },
    });

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        createdAt: user.createdAt,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


