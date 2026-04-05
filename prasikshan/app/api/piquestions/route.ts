import connectDB from "@/lib/db";
import PiQuestion from "@/models/PiQuestion";
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

export async function GET(req: NextRequest) {
  const auth = verifyUser(req);
  if (!auth.ok) return auth.error!;

  try {
    console.log("🔍 PI API: Starting fetch...");
    const conn = await connectDB();
    console.log("✅ PI API: Database connected");

    const db = conn.connection.db;
    const piCollection = db.collection("PI");

    const totalCount = await piCollection.countDocuments();
    console.log(`📊 PI API: Total count from PI collection: ${totalCount}`);

    if (totalCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No PI questions available. Please seed the database first.",
          data: [],
          count: 0,
        },
        { status: 424 }
      );
    }

    const questions = await piCollection.find({}).sort({ question_id: 1 }).toArray();
    console.log(`✅ PI API: Fetched ${questions.length} PI questions`);

    return NextResponse.json({ success: true, data: questions, count: questions.length });
  } catch (error) {
    console.error("❌ PI API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch PI questions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
