import connectDB from '@/lib/db';
import OirSet from '@/models/OirSet';
import UserResult from '@/models/UserResult';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

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
        console.warn('Invalid token for OIR questions fetch');
      }
    }

    // Connect to database
    await connectDB();

    // Get query parameter for setId or setName if provided
    const { searchParams } = new URL(request.url);
    const setNameParam = searchParams.get('setName');

    let oirSet;

    if (setNameParam) {
      // Fetch specific set by name
      oirSet = await OirSet.findOne({ setName: setNameParam });
    } else if (userId) {
      // 2. Sequential Logic for User
      const userResult = await UserResult.findOne({ userId });
      const completedSetNames = userResult ? userResult.oir.map((o: any) => o.setName).filter(Boolean) : [];
      
      const allSets = await OirSet.find({}).select('setName');
      
      // Sort sets numerically if they follow "Set X" pattern
      allSets.sort((a, b) => a.setName.localeCompare(b.setName, undefined, { numeric: true, sensitivity: 'base' }));

      // Find the first set not yet completed
      oirSet = null;
      for (const s of allSets) {
        if (!completedSetNames.includes(s.setName)) {
          oirSet = await OirSet.findOne({ setName: s.setName });
          break;
        }
      }

      // 3. Fallback: If all sets completed, return a random one
      if (!oirSet && allSets.length > 0) {
        const randomIndex = Math.floor(Math.random() * allSets.length);
        oirSet = await OirSet.findOne({ setName: allSets[randomIndex].setName });
      }
    } else {
      // Fetch a random set if guest (unlikely/fallback)
      const totalSets = await OirSet.countDocuments();
      if (totalSets === 0) {
        return NextResponse.json({ success: false, message: 'No OIR sets available.', count: 0 }, { status: 400 });
      }
      const randomIndex = Math.floor(Math.random() * totalSets);
      oirSet = await OirSet.findOne().skip(randomIndex);
    }

    if (!oirSet) {
      return NextResponse.json(
        {
          success: false,
          message: 'Requested OIR set not found.',
          count: 0,
        },
        { status: 404 }
      );
    }

    console.log(`Successfully fetched ${oirSet.questions.length} OIR questions from ${oirSet.setName}`);

    return NextResponse.json(
      {
        success: true,
        data: oirSet.questions,
        setName: oirSet.setName,
        count: oirSet.questions.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching OIR questions:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch OIR questions',
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}
