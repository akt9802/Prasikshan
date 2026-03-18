import mongoose, { Schema, Document } from 'mongoose';

export interface IOirSet extends Document {
  setName: string;
  questions: {
    question: string;
    options: string[];
    answer: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const OirSetSchema = new Schema<IOirSet>(
  {
    setName: {
      type: String,
      required: [true, 'Please provide a set name'],
    },
    questions: [
      {
        question: {
          type: String,
          required: [true, 'Question is required'],
        },
        options: {
          type: [String],
          required: [true, 'Options are required'],
        },
        answer: {
          type: String,
          required: [true, 'Answer is required'],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
const OirSet = mongoose.models.OirSet || mongoose.model<IOirSet>('OirSet', OirSetSchema);

export default OirSet;
