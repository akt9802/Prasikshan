import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, transcript, durationSeconds } = body;

    if (!transcript || !transcript.trim()) {
      return NextResponse.json(
        { success: false, error: "Transcript is empty" },
        { status: 400 }
      );
    }

    const aiServiceUrl =
      process.env.AI_SERVICE_URL || "http://localhost:5001";

    const response = await fetch(`${aiServiceUrl}/api/lecturette-review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, transcript, durationSeconds: durationSeconds || 0 }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: data.quota_exceeded ? 429 : response.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to connect to AI review service." },
      { status: 500 }
    );
  }
}
