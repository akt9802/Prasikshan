import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

/**
 * POST /api/admin/migrate-roles
 * Adds 'role' field to all existing users that don't have it (sets to 'user')
 * This is a one-time migration to handle users created before role field was added
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Update all documents that don't have a role field
    const result = await User.updateMany(
      { role: { $exists: false } },
      { $set: { role: 'user' } }
    );

    return NextResponse.json(
      {
        success: true,
        message: `Migration completed. Updated ${result.modifiedCount} users.`,
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error during migration:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Migration failed',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
