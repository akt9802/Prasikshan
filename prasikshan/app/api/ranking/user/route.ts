import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import UserResult from '@/models/UserResult';

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const nameQuery = searchParams.get('name');

        if (!nameQuery) {
            return NextResponse.json({ success: false, message: 'Name parameter required' }, { status: 400 });
        }

        // 1. Fetch all users enough to determine rank and find our specific user
        const users = await User.find({}, 'username fullName email').lean();
        const userResults = await UserResult.find({}).lean();
        
        const resultDict: any = {};
        for (const res of userResults) {
            resultDict[(res as any).userId.toString()] = res;
        }

        const mapped = users.map(u => {
            const result = resultDict[(u as any)._id.toString()];
            let totalScore = 0;
            let testsTakenCount = 0;
            if (result) {
                const arrays = ['oir', 'ppdt', 'tat', 'wat', 'srt', 'lecturette', 'pi'];
                for (const arr of arrays) {
                    if (Array.isArray(result[arr])) {
                        testsTakenCount += result[arr].length;
                        for (const test of result[arr]) {
                            totalScore += (test.score || 0);
                        }
                    }
                }
            }
            totalScore = Math.round(totalScore * 100) / 100;

            return {
                _id: u._id,
                username: u.username,
                fullName: u.fullName,
                email: u.email,
                testsTakenCount,
                totalScore,
                name: u.username || u.fullName || u.email.split('@')[0]
            };
        });

        // 2. Sort to get rank
        mapped.sort((a, b) => {
            if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
            if (b.testsTakenCount !== a.testsTakenCount) return b.testsTakenCount - a.testsTakenCount;
            const nameA = a.name || '';
            const nameB = b.name || '';
            return nameA.localeCompare(nameB);
        });

        const targetUser = mapped.find(u => u.name === nameQuery);

        if (!targetUser) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        const rank = mapped.indexOf(targetUser) + 1;

        // 3. Get detailed performance data (UserResult)
        const detailedResult = await UserResult.findOne({ userId: targetUser._id }).lean();
        
        // Flatten testsTaken for charts
        const testsTaken = detailedResult ? [
            ...(detailedResult.oir || []).map((t: any) => ({ ...t, testName: t.testName || 'OIR' })),
            ...(detailedResult.ppdt || []).map((t: any) => ({ ...t, testName: t.testName || 'PPDT' })),
            ...(detailedResult.tat || []).map((t: any) => ({ ...t, testName: t.testName || 'TAT' })),
            ...(detailedResult.wat || []).map((t: any) => ({ ...t, testName: t.testName || 'WAT' })),
            ...(detailedResult.srt || []).map((t: any) => ({ ...t, testName: t.testName || 'SRT' })),
            ...(detailedResult.lecturette || []).map((t: any) => ({ ...t, testName: t.testName || 'LECTURETTE' })),
            ...(detailedResult.pi || []).map((t: any) => ({ ...t, testName: t.testName || 'PI' })),
        ].sort((a, b) => new Date(a.dateTaken).getTime() - new Date(b.dateTaken).getTime()) : [];

        return NextResponse.json({
            success: true,
            user: {
                ...targetUser,
                rank,
                testsTaken,
            }
        });

    } catch (error: any) {
        console.error('Error in /api/ranking/user:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
