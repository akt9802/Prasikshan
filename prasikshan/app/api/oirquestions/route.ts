import connectDB from '@/lib/db';
import OirSet from '@/models/OirSet';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');

    // Get query parameter for setId or setName if provided
    const { searchParams } = new URL(request.url);
    const setName = searchParams.get('setName');

    let oirSet;

    if (setName) {
      // Fetch specific set by name
      oirSet = await OirSet.findOne({ setName });
    } else {
      // Fetch a random set if none specified
      const totalSets = await OirSet.countDocuments();
      if (totalSets === 0) {
        return NextResponse.json(
          {
            success: false,
            message: 'No OIR sets available. Please run the createOirSets script first.',
            count: 0,
          },
          { status: 400 }
        );
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
