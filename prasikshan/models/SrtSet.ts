import mongoose, { Schema, Document } from 'mongoose';

export interface ISrtQuestion {
  situation: string;
  sample_reaction: string;
}

export interface ISrtSet extends Document {
  setName: string;
  questions: ISrtQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const SrtQuestionSchema = new Schema<ISrtQuestion>({
  situation: { type: String, required: true },
  sample_reaction: { type: String, required: false }, // Made optional in case some don't have sample reactions
});

const SrtSetSchema = new Schema<ISrtSet>({
  setName: { type: String, required: true },
  questions: {
    type: [SrtQuestionSchema],
    required: true,
    validate: [
      (arr: ISrtQuestion[]) => arr.length === 60,
      'A set must have exactly 60 questions',
    ],
  },
}, { timestamps: true });

export default mongoose.models.SrtSet || mongoose.model<ISrtSet>('SrtSet', SrtSetSchema);
