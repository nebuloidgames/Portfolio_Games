import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requestAccessSchema } from "@/lib/validation";
import { sendAccessRequestNotification } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = requestAccessSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      return NextResponse.json(
        {
          success: false,
          errors,
        },
        { status: 400 },
      );
    }

    const { fullName, email } = result.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: true,
          message: "Access request received.",
        },
        { status: 200 },
      );
    }

    // Check if there is already a pending request
    const existingPendingRequest = await prisma.accessRequest.findFirst({
      where: {
        email,
        status: "PENDING",
      },
      select: { id: true },
    });

    if (existingPendingRequest) {
      return NextResponse.json(
        {
          success: true,
          message: "Access request received.",
        },
        { status: 200 },
      );
    }

    // Create new access request
    const accessRequest = await prisma.accessRequest.create({
      data: {
        fullName,
        email,
        status: "PENDING",
      },
    });

    // Send notification email to admin
    const emailResult = await sendAccessRequestNotification({
      fullName: accessRequest.fullName,
      email: accessRequest.email,
    });

    if (!emailResult.success) {
      console.error(
        "Access request created, but admin notification email failed:",
        emailResult.error,
      );
    } else {
      console.log(
        "Admin access request notification sent successfully.",
      );
    }

    // Access request is successful even if email notification fails
    return NextResponse.json(
      {
        success: true,
        message: "Access request received.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Request access error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred. Please try again.",
      },
      { status: 500 },
    );
  }
}