import path from 'path';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Ensure env vars (including DATABASE_URL) are loaded before creating PrismaClient.
// Prefer .env.local for Next.js, fall back to .env.
if (!process.env.DATABASE_URL) {
	const envPath =
		process.env.NODE_ENV === "test" ? ".env.test" : ".env.local";
	dotenv.config({ path: path.resolve(process.cwd(), envPath) });
	if (!process.env.DATABASE_URL) {
		dotenv.config({ path: path.resolve(process.cwd(), ".env") });
	}
}

if (!process.env.DATABASE_URL) {
	throw new Error(
		"Missing DATABASE_URL. Set it in .env.local (preferred) or .env.",
	);
}

declare global {
	// eslint-disable-next-line no-var
	var __prismaClient: PrismaClient | undefined;
}

const prisma = global.__prismaClient ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.__prismaClient = prisma;

export { prisma };
export default prisma;
