import connectDB from '@/lib/db';
import WatSet from '@/models/WatSet';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔌 WAT API: Connecting to database...');
    await connectDB();
    console.log('✅ WAT API: Database connected');

    // Optional query param: ?setName=Set%201
    const { searchParams } = new URL(request.url);
    const setName = searchParams.get('setName');

    let watSet;

    if (setName) {
      // Fetch a specific set by name
      watSet = await WatSet.findOne({ setName });
    } else {
      // Fetch a random set
      const totalSets = await WatSet.countDocuments();

      if (totalSets === 0) {
        return NextResponse.json(
          {
            success: false,
            error:
              'No WAT sets available. Please run the createWatSets script first.',
            data: [],
            count: 0,
          },
          { status: 424 }
        );
      }

      const randomIndex = Math.floor(Math.random() * totalSets);
      watSet = await WatSet.findOne().skip(randomIndex);
    }

    if (!watSet) {
      return NextResponse.json(
        {
          success: false,
          error: 'Requested WAT set not found.',
          data: [],
          count: 0,
        },
        { status: 404 }
      );
    }

    console.log(
      `✅ WAT API: Fetched ${watSet.questions.length} questions from "${watSet.setName}"`
    );

    return NextResponse.json({
      success: true,
      data: watSet.questions,   // [{ word, sentences }, ...]
      setName: watSet.setName,
      count: watSet.questions.length,
    });
  } catch (error) {
    console.error('❌ WAT API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch WAT questions',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
