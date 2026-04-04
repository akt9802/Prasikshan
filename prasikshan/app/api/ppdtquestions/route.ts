import connectDB from "@/lib/db";
import PpdtQuestion from "@/models/PpdtQuestion";
import UserResult from "@/models/UserResult";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    // 1. Get userId from token
    const authHeader = request.headers.get("authorization");
    let userId: string | null = null;
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      try {
        const secret = process.env.JWT_SECRET || 'default_secret';
        const decoded = jwt.verify(token, secret) as { userId: string };
        userId = decoded.userId;
      } catch (e) {
        console.warn('Invalid token for PPDT questions fetch');
      }
    }

    await connectDB();

    let selectedQuestion;

    if (userId) {
      // 2. Sequential Logic for User
      const userResult = await UserResult.findOne({ userId });
      const completedSetNames = userResult ? userResult.ppdt.map((o: any) => o.setName).filter(Boolean) : [];
      
      const allQuestions = await PpdtQuestion.find({}).sort({ _id: 1 }).select('_id');
      
      // Find the first question not yet completed
      selectedQuestion = null;
      for (const q of allQuestions) {
        const idStr = q._id!.toString();
        if (!completedSetNames.includes(idStr)) {
          selectedQuestion = await PpdtQuestion.findOne({ _id: q._id });
          break;
        }
      }

      // 3. Fallback: If all completed, return a random one
      if (!selectedQuestion && allQuestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * allQuestions.length);
        selectedQuestion = await PpdtQuestion.findOne({ _id: allQuestions[randomIndex]._id });
      }
    } else {
      // Fetch a random question if guest
      const total = await PpdtQuestion.countDocuments();
      if (total === 0) return NextResponse.json({ success: false, error: "No questions found" }, { status: 404 });
      const randomIndex = Math.floor(Math.random() * total);
      selectedQuestion = await PpdtQuestion.findOne().skip(randomIndex);
    }

    if (!selectedQuestion) {
      return NextResponse.json({ success: false, error: "No question found" }, { status: 404 });
    }

    // Prepare the response with fixed image URL
    const fixedQuestion = {
      ...selectedQuestion.toObject(),
      image: selectedQuestion.image,
    };

    return NextResponse.json({
      success: true,
      data: fixedQuestion,
    });
  } catch (error) {
    console.error("❌ PPDT API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch PPDT question",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}