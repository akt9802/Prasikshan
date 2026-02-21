import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    // Attempt to connect to database
    const conn = await connectDB();
    
    if (!conn) {
      return Response.json(
        { success: false, message: 'Failed to connect to database' },
        { status: 500 }
      );
    }

    // Test database query - count existing users
    const userCount = await User.countDocuments();

    return Response.json(
      {
        success: true,
        message: 'Database connection successful!',
        database: 'Connected to MongoDB',
        totalUsers: userCount,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Database connection error:', error);
    return Response.json(
      {
        success: false,
        message: 'Database connection failed',
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}
