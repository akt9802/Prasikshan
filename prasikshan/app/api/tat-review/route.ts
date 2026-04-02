import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { stories, totalPictures } = body;

    if (!stories || !Array.isArray(stories) || stories.length === 0) {
      return NextResponse.json(
        { success: false, error: "Stories are empty" },
        { status: 400 }
      );
    }

    const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:5001";

    const response = await fetch(`${aiServiceUrl}/api/tat-review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stories, totalPictures: totalPictures || 12 }),
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
