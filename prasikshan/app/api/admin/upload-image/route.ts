import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import cloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import User from "@/models/User";

// ─── Auth helper ────────────────────────────────────────────────────────────
async function verifyAdmin(req: NextRequest): Promise<{ ok: boolean; error?: NextResponse }> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { ok: false, error: NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 }) };
  }
  const token = authHeader.slice(7);
  const secret = process.env.JWT_SECRET;
  if (!secret) return { ok: false, error: NextResponse.json({ success: false, message: "Server misconfiguration" }, { status: 500 }) };

  try {
    const decoded = jwt.verify(token, secret) as { userId: string };
    await connectDB();
    const user = await User.findById(decoded.userId).select("role");
    if (!user || user.role !== "admin") {
      return { ok: false, error: NextResponse.json({ success: false, message: "Forbidden — Admins only" }, { status: 403 }) };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: NextResponse.json({ success: false, message: "Invalid token" }, { status: 403 }) };
  }
}

export async function POST(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return auth.error!;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "ppdt", format: "webp" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json(uploadResult as any, { status: 200 });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
  }
}
