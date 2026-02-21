import connectDB from '@/lib/db';
import OirQuestion from '@/models/OirQuestion';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Connect to database
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');

    // Check if OIR questions exist
    const totalCount = await OirQuestion.countDocuments();
    console.log(`Total OIR questions in database: ${totalCount}`);

    if (totalCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'No OIR questions available. Please seed questions first by visiting /api/oirquestions/seed',
          count: 0,
        },
        { status: 400 }
      );
    }

    // Fetch 40 random OIR questions using aggregation
    console.log('Fetching 40 random OIR questions...');
    const questions = await OirQuestion.aggregate([{ $sample: { size: Math.min(40, totalCount) } }]);
    console.log(`Successfully fetched ${questions.length} OIR questions`);

    return NextResponse.json(
      {
        success: true,
        data: questions,
        count: questions.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching OIR questions:', error);
    console.error('Error stack:', error.stack);
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
