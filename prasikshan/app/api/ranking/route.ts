import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
    try {
        await connectDB();

        // fetch only the fields we need
        const users = await User.find({}, 'username fullName email testsTaken').lean();

        // map and compute testsTakenCount
        const mapped = users.map(u => ({
            username: u.username,
            fullName: u.fullName,
            email: u.email,
            testsTaken: Array.isArray(u.testsTaken) ? u.testsTaken : [],
            testsTakenCount: Array.isArray(u.testsTaken) ? u.testsTaken.length : 0,
        }));

        // sort by testsTakenCount desc
        mapped.sort((a, b) => b.testsTakenCount - a.testsTakenCount);

        // add rank (1-based)
        const ranked = mapped.map((u, idx) => ({ ...u, name: u.username || u.fullName, rank: idx + 1 }));

        return NextResponse.json({ success: true, data: ranked });
    } catch (err: any) {
        console.error('Error in /api/ranking:', err);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
