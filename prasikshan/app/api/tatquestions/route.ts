import connectDB from "@/lib/db";
import TatSet from "@/models/TatSet";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        console.log("🔍 TAT API: Starting fetch...");
        await connectDB();
        console.log("✅ TAT API: Database connected");

        // Fetch a random TAT Set (which already contains 12 pictures)
        const randomSets = await TatSet.aggregate([
            { $sample: { size: 1 } },
        ]);

        if (!randomSets || randomSets.length === 0) {
            console.warn("No TAT sets found in the database");
            return NextResponse.json(
                {
                    success: false,
                    error: "No TAT sets found in the database",
                    data: [],
                },
                { status: 404 }
            );
        }

        const selectedSet = randomSets[0];

        // Ensure all documents have necessary structures like images mapped directly
        const fixedQuestions = selectedSet.questions.map((question: any) => ({
            ...question,
            image: question.image,
        }));

        console.log(`✅ TAT API: Successfully fetched ${fixedQuestions.length} questions`);

        return NextResponse.json({
            success: true,
            data: fixedQuestions,
        });
    } catch (error) {
        console.error("❌ TAT API Error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch TAT questions",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
