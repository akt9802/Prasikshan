import mongoose from "mongoose";

export interface ISrtQuestion {
  _id?: string;
  situation_id: number;
  situation: string;
  sample_reaction: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const srtQuestionSchema = new mongoose.Schema<ISrtQuestion>(
  {
    situation_id: {
      type: Number,
      required: true,
    },
    situation: {
      type: String,
      required: true,
    },
    sample_reaction: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const SrtQuestion =
  mongoose.models.SrtQuestion ||
  mongoose.model<ISrtQuestion>("SrtQuestion", srtQuestionSchema, "SRT");

export default SrtQuestion;
