import connectDB from "@/lib/db";
import TatSet from "@/models/TatSet";
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
        console.warn('Invalid token for TAT questions fetch');
      }
    }

    await connectDB();

    let selectedSet;

    if (userId) {
      // 2. Sequential Logic for User
      const userResult = await UserResult.findOne({ userId });
      const completedSetNames = userResult ? userResult.tat.map((o: any) => o.setName).filter(Boolean) : [];
      
      const allSets = await TatSet.find({}).select('setName');
      
      // Sort sets numerically if they follow "Set X" pattern
      allSets.sort((a, b) => a.setName.localeCompare(b.setName, undefined, { numeric: true, sensitivity: 'base' }));

      // Find the first set not yet completed
      selectedSet = null;
      for (const s of allSets) {
        if (!completedSetNames.includes(s.setName)) {
          selectedSet = await TatSet.findOne({ setName: s.setName });
          break;
        }
      }

      // 3. Fallback: If all sets completed, return a random one
      if (!selectedSet && allSets.length > 0) {
        const randomIndex = Math.floor(Math.random() * allSets.length);
        selectedSet = await TatSet.findOne({ setName: allSets[randomIndex].setName });
      }
    } else {
      // Fetch a random set if guest
      const totalSets = await TatSet.countDocuments();
      if (totalSets === 0) return NextResponse.json({ success: false, error: "No TAT sets found" }, { status: 404 });
      const randomIndex = Math.floor(Math.random() * totalSets);
      selectedSet = await TatSet.findOne().skip(randomIndex);
    }

    if (!selectedSet) {
      return NextResponse.json({ success: false, error: "No TAT set found" }, { status: 404 });
    }

    // Ensure all documents have necessary structures like images mapped directly
    const fixedQuestions = selectedSet.questions.map((question: any) => ({
      ...question,
      image: question.image,
    }));

    return NextResponse.json({
      success: true,
      data: fixedQuestions,
      setName: selectedSet.setName,
    });
    } catch (error) {
        console.error("❌ TAT API Error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch TAT questions",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
