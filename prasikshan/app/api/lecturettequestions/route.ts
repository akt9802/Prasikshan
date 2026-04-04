import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import UserResult from "@/models/UserResult";
import LecturetteQuestion from "@/models/LecturetteQuestion";

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
        console.warn('Invalid token for Lecturette fetch');
      }
    }

    await connectDB();

    let selectedTopic;

    if (userId) {
      // 2. Sequential Logic for User
      const userResult = await UserResult.findOne({ userId });
      const completedTopics = userResult ? userResult.lecturette.map((o: any) => o.setName).filter(Boolean) : [];
      
      const allTopics = await LecturetteQuestion.find({}).sort({ topic_id: 1 });

      // Find the first topic not yet completed
      selectedTopic = null;
      for (const t of allTopics) {
        if (!completedTopics.includes(t.topic_id.toString())) {
          selectedTopic = t;
          break;
        }
      }

      // 3. Fallback: If all topics completed, return a random one
      if (!selectedTopic && allTopics.length > 0) {
        const randomIndex = Math.floor(Math.random() * allTopics.length);
        selectedTopic = allTopics[randomIndex];
      }
    } else {
      // Fetch a random topic if guest
      const totalCount = await LecturetteQuestion.countDocuments();
      if (totalCount === 0) return NextResponse.json({ success: false, error: "No topics found" }, { status: 424 });
      const randomIndex = Math.floor(Math.random() * totalCount);
      selectedTopic = await LecturetteQuestion.findOne().skip(randomIndex);
    }

    if (!selectedTopic) {
      return NextResponse.json({ success: false, error: "No topic found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: selectedTopic,
    });
  } catch (error) {
    console.error("Error fetching lecturette question:", error);
    return NextResponse.json(
      { success: false, error: "Error fetching question" },
      { status: 500 }
    );
  }
}
