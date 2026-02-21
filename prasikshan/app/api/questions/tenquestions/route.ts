import connectDB from '@/lib/db';
import Question from '@/models/Question';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Connect to database
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');

    // Fetch 10 random questions using aggregation
    console.log('Fetching 10 random questions...');
    const questions = await Question.aggregate([{ $sample: { size: 10 } }]);
    console.log(`Successfully fetched ${questions.length} questions`);

    return NextResponse.json(
      {
        success: true,
        data: questions,
        count: questions.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching ten questions:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch questions',
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}
