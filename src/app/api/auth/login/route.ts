import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";
import { verifyPassword } from "@/lib/credentials";
import { sendLoginNotification } from "@/lib/email";
import { createSession, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Invalid username or password." },
        { status: 401 },
      );
    }

    const { username, password } = result.data;

    const user = await prisma.user.findFirst({
      where: { username: { equals: username, mode: "insensitive" } },
      select: {
        id: true,
        fullName: true,
        email: true,
        username: true,
        passwordHash: true,
        status: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid username or password." },
        { status: 401 },
      );
    }

    if (user.status !== "ACTIVE") {
      return NextResponse.json(
        { success: false, message: "Invalid username or password." },
        { status: 401 },
      );
    }

    const isValidPassword = await verifyPassword(
      password,
      user.passwordHash,
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: "Invalid username or password." },
        { status: 401 },
      );
    }

    const { token } = await createSession(user.id);
    await setSessionCookie(token);

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Alert the admins; never let an email problem block the login.
    await sendLoginNotification({
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      role: user.role,
    }).catch(() => undefined);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred. Please try again.",
      },
      { status: 500 },
    );
  }
}