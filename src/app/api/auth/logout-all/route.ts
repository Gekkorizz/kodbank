import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { clearAuthCookie, getUserFromRequest } from "@/lib/auth";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const authUser = await getUserFromRequest(request);

    if (!authUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await prisma.userToken.updateMany({
      where: {
        userId: authUser.id,
        revoked: false,
      },
      data: {
        revoked: true,
      },
    });

    await clearAuthCookie();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Logout-all error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


