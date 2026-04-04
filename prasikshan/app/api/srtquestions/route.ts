import connectDB from '@/lib/db';
import SrtSet from '@/models/SrtSet';
import UserResult from '@/models/UserResult';
import { NextRequest, NextResponse } from 'next/server';
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
        console.warn('Invalid token for SRT questions fetch');
      }
    }

    await connectDB();

    let selectedSet;

    if (userId) {
      // 2. Sequential Logic for User
      const userResult = await UserResult.findOne({ userId });
      const completedSetNames = userResult ? userResult.srt.map((o: any) => o.setName).filter(Boolean) : [];
      
      const allSets = await SrtSet.find({}).select('setName');
      
      // Sort sets numerically
      allSets.sort((a, b) => a.setName.localeCompare(b.setName, undefined, { numeric: true, sensitivity: 'base' }));

      // Find the first set not yet completed
      selectedSet = null;
      for (const s of allSets) {
        if (!completedSetNames.includes(s.setName)) {
          selectedSet = await SrtSet.findOne({ setName: s.setName });
          break;
        }
      }

      // 3. Fallback: If all sets completed, return a random one
      if (!selectedSet && allSets.length > 0) {
        const randomIndex = Math.floor(Math.random() * allSets.length);
        selectedSet = await SrtSet.findOne({ setName: allSets[randomIndex].setName });
      }
    } else {
      // Fetch a random set if guest
      const totalSets = await SrtSet.countDocuments();
      if (totalSets === 0) return NextResponse.json({ success: false, error: "No SRT sets found" }, { status: 424 });
      const randomIndex = Math.floor(Math.random() * totalSets);
      selectedSet = await SrtSet.findOne().skip(randomIndex);
    }

    if (!selectedSet) {
      return NextResponse.json({ success: false, error: "No SRT set found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: selectedSet.questions,
      setName: selectedSet.setName,
      count: selectedSet.questions.length,
    });
  } catch (error) {
    console.error('❌ SRT API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch SRT questions',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
