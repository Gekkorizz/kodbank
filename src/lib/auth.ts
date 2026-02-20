import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { prisma } from "./db";

const TOKEN_COOKIE_NAME = "kodbank_token";
const TOKEN_TTL_HOURS = 24; // default token lifetime

export interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(): string {
  return crypto.randomBytes(48).toString("hex");
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length).trim();
  }

  const cookieToken = req.cookies.get(TOKEN_COOKIE_NAME)?.value;
  return cookieToken ?? null;
}

export async function createAuthToken(userId: string, type = "AUTH") {
  const token = generateToken();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + TOKEN_TTL_HOURS * 60 * 60 * 1000);

  const userToken = await prisma.userToken.create({
    data: {
      userId,
      token,
      type,
      expiresAt,
    },
  });

  return userToken;
}

export async function getUserFromToken(token: string): Promise<AuthUser | null> {
  const now = new Date();

  const found = await prisma.userToken.findFirst({
    where: {
      token,
      revoked: false,
      expiresAt: {
        gt: now,
      },
      user: {
        // user must still exist
      },
    },
    include: {
      user: true,
    },
  });

  if (!found || !found.user) return null;

  return {
    id: found.user.id,
    email: found.user.email,
    fullName: found.user.fullName,
  };
}

export async function getUserFromRequest(
  req: NextRequest,
): Promise<AuthUser | null> {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return getUserFromToken(token);
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  const now = new Date();
  const expires = new Date(now.getTime() + TOKEN_TTL_HOURS * 60 * 60 * 1000);

  cookieStore.set(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE_NAME);
}


