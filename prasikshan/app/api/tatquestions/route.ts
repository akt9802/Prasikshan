import connectDB from "@/lib/db";
import TatQuestion from "@/models/TatQuestion";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        console.log("🔍 TAT API: Starting fetch...");
        await connectDB();
        console.log("✅ TAT API: Database connected");

        // Fetch 12 random questions according to TAT rules
        const randomQuestions = await TatQuestion.aggregate([
            { $sample: { size: 12 } },
        ]);

        if (!randomQuestions || randomQuestions.length === 0) {
            console.warn("No TAT questions found in the database");
            return NextResponse.json(
                {
                    success: false,
                    error: "No TAT questions found in the database",
                    data: [],
                },
                { status: 404 }
            );
        }

        // Ensure all documents have necessary structures like images mapped directly
        const fixedQuestions = randomQuestions.map((question) => ({
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
