import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  clearAuthCookie,
  createAuthToken,
  setAuthCookie,
  verifyPassword,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body ?? {};

    if (!email || !password) {
      return NextResponse.json(
        { error: "email and password are required" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // On each login, clear any existing cookie and issue a fresh token.
    await clearAuthCookie();
    const userToken = await createAuthToken(user.id);
    await setAuthCookie(userToken.token);

    return NextResponse.json(
      {
        token: userToken.token,
        expiresAt: userToken.expiresAt,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


