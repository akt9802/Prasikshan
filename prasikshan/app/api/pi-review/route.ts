import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { answers, timeTaken } = body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { success: false, error: "Answers provided are empty" },
        { status: 400 }
      );
    }

    const aiServiceUrl = process.env.AI_SERVICE_URL || "http://127.0.0.1:5001";

    const response = await fetch(`${aiServiceUrl}/api/pi-review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, timeTaken }),
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
