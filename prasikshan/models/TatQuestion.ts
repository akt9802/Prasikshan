import mongoose from "mongoose";

export interface IStory {
    title: string;
    narration: string;
}

export interface ITatQuestion {
    _id?: number;
    image: string;
    stories: IStory[];
    createdAt?: Date;
    updatedAt?: Date;
}

const tatQuestionSchema = new mongoose.Schema<ITatQuestion>(
    {
        _id: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        stories: [
            {
                title: {
                    type: String,
                    required: true,
                },
                narration: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    { timestamps: true }
);

const TatQuestion =
    mongoose.models.TatQuestion ||
    mongoose.model<ITatQuestion>("TatQuestion", tatQuestionSchema, "TAT");

export default TatQuestion;
