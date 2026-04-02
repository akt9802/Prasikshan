import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { responses, totalSituations } = body;

    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      return NextResponse.json(
        { success: false, error: "Responses are empty" },
        { status: 400 }
      );
    }

    const aiServiceUrl =
      process.env.AI_SERVICE_URL || "http://localhost:5001";

    const response = await fetch(`${aiServiceUrl}/api/srt-review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ responses, totalSituations: totalSituations || 60 }),
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
