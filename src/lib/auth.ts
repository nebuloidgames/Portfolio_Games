import crypto from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

export const SESSION_COOKIE_NAME = "session-token";
const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

export async function createSession(
  userId: string,
): Promise<{ token: string; cookieValue: string }> {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);

  await prisma.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  return { token, cookieValue: token };
}

export async function setSessionCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function getCurrentUser() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return getUserBySessionToken(token);
}

/**
 * The active user a session token belongs to, or null if the token is
 * unknown, expired, or its user isn't ACTIVE. `touch` records the session
 * as used — skip it for high-volume checks like every game asset request.
 */
export async function getUserBySessionToken(
  token: string,
  { touch = true }: { touch?: boolean } = {},
) {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          username: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true,
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    return null;
  }

  if (session.user.status !== "ACTIVE") {
    return null;
  }

  if (touch) {
    await prisma.session.update({
      where: { id: session.id },
      data: { lastUsedAt: new Date() },
    });
  }

  return session.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  if (user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
  return user;
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    await prisma.session.deleteMany({ where: { tokenHash } });
  }

  store.delete(SESSION_COOKIE_NAME);
}

export async function destroyUserSessions(userId: string): Promise<void> {
  await prisma.session.deleteMany({ where: { userId } });
}
