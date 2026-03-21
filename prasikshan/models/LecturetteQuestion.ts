import mongoose, { Schema, Document } from "mongoose";

export interface ILecturetteQuestion extends Document {
  topic_id: number;
  topic: string;
  speech: string;
}

const LecturetteQuestionSchema = new Schema<ILecturetteQuestion>(
  {
    topic_id: {
      type: Number,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    speech: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const LecturetteQuestion =
  mongoose.models.LecturetteQuestion ||
  mongoose.model<ILecturetteQuestion>("LecturetteQuestion", LecturetteQuestionSchema, "lecturette");

export default LecturetteQuestion;
