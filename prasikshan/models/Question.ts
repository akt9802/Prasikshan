import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  question: string;
  options: string[];
  answer: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    question: {
      type: String,
      required: [true, 'Please provide a question'],
    },
    options: {
      type: [String],
      required: [true, 'Please provide options'],
      validate: {
        validator: function (v: string[]) {
          return v.length > 0;
        },
        message: 'At least one option is required',
      },
    },
    answer: {
      type: String,
      required: [true, 'Please provide the answer'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
const Question = mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);

export default Question;
