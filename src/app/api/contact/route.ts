import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { routeLeadSubmission } from "@/lib/contact";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const realIp = request.headers.get("x-real-ip")?.trim();
    const result = await routeLeadSubmission(payload, {
      remoteIp: forwardedFor || realIp || undefined,
    });

    return NextResponse.json(result, {
      status: result.ok ? 200 : 400,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: error.issues[0]?.message ?? "Please review the form fields.",
          issues: error.flatten(),
        },
        { status: 400 },
      );
    }

    console.error("[contact-api] Unexpected error", error);

    return NextResponse.json(
      {
        message:
          "We could not process your request right now. Please call or use online booking.",
      },
      { status: 500 },
    );
  }
}