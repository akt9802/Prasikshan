import connectDB from '@/lib/db';
import SrtSet from '@/models/SrtSet';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔌 SRT API: Connecting to database...');
    await connectDB();
    console.log('✅ SRT API: Database connected');

    // Optional query param: ?setName=Set%201
    const { searchParams } = new URL(request.url);
    const setName = searchParams.get('setName');

    let srtSet;

    if (setName) {
      // Fetch a specific set by name
      srtSet = await SrtSet.findOne({ setName });
    } else {
      // Fetch a random set
      const totalSets = await SrtSet.countDocuments();

      if (totalSets === 0) {
        return NextResponse.json(
          {
            success: false,
            error:
              'No SRT sets available. Please run the createSrtSets script first.',
            data: [],
            count: 0,
          },
          { status: 424 }
        );
      }

      const randomIndex = Math.floor(Math.random() * totalSets);
      srtSet = await SrtSet.findOne().skip(randomIndex);
    }

    if (!srtSet) {
      return NextResponse.json(
        {
          success: false,
          error: 'Requested SRT set not found.',
          data: [],
          count: 0,
        },
        { status: 404 }
      );
    }

    console.log(
      `✅ SRT API: Fetched ${srtSet.questions.length} questions from "${srtSet.setName}"`
    );

    return NextResponse.json({
      success: true,
      data: srtSet.questions,   // [{ situation, sample_reaction }, ...]
      setName: srtSet.setName,
      count: srtSet.questions.length,
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
