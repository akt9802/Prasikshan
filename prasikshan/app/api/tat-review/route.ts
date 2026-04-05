import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// ─── Auth helper ────────────────────────────────────────────────────────────
function verifyUser(req: NextRequest): { ok: boolean; error?: NextResponse } {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { ok: false, error: NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 }) };
  }
  const token = authHeader.slice(7);
  const secret = process.env.JWT_SECRET;
  if (!secret) return { ok: false, error: NextResponse.json({ success: false, message: "Server misconfiguration" }, { status: 500 }) };

  try {
    jwt.verify(token, secret);
    return { ok: true };
  } catch {
    return { ok: false, error: NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 403 }) };
  }
}

export async function POST(req: NextRequest) {
  const auth = verifyUser(req);
  if (!auth.ok) return auth.error!;

  try {
    const body = await req.json();
    const { stories, totalPictures } = body;

    if (!stories || !Array.isArray(stories) || stories.length === 0) {
      return NextResponse.json({ success: false, error: "Stories are empty" }, { status: 400 });
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
    return NextResponse.json({ success: false, error: "Failed to connect to AI review service." }, { status: 500 });
  }
}
