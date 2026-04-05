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
    const { answers, timeTaken } = body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json({ success: false, error: "Answers provided are empty" }, { status: 400 });
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
    return NextResponse.json({ success: false, error: "Failed to connect to AI review service." }, { status: 500 });
  }
}
