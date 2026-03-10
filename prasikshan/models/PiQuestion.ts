import mongoose, { Schema, model, Document } from "mongoose";

export interface IPiQuestion extends Document {
  question_id: number;
  question: string;
  expectation: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const piQuestionSchema = new Schema<IPiQuestion>(
  {
    question_id: {
      type: Number,
      required: true,
      unique: true,
    },
    question: {
      type: String,
      required: true,
    },
    expectation: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PiQuestion =
  mongoose.models.PiQuestion ||
  model<IPiQuestion>("PiQuestion", piQuestionSchema, "PI");

export default PiQuestion;
