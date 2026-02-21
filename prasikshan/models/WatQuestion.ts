import mongoose, { Schema, model, Document } from "mongoose";

export interface IWatQuestion extends Document {
  word: string;
  sentences: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const watQuestionSchema = new Schema<IWatQuestion>(
  {
    word: {
      type: String,
      required: true,
    },
    sentences: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const WatQuestion =
  mongoose.models.WatQuestion ||
  model<IWatQuestion>("WatQuestion", watQuestionSchema, "WAT");

export default WatQuestion;
