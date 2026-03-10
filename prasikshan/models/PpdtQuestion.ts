import mongoose from "mongoose";

export interface IStory {
  title: string;
  narration: string;
}

export interface IPpdtQuestion {
  _id?: number;
  image: string;
  stories: IStory[];
  createdAt?: Date;
  updatedAt?: Date;
}

const ppdtQuestionSchema = new mongoose.Schema<IPpdtQuestion>(
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

const PpdtQuestion =
  mongoose.models.PpdtQuestion ||
  mongoose.model<IPpdtQuestion>("PpdtQuestion", ppdtQuestionSchema, "PPDT");

export default PpdtQuestion;