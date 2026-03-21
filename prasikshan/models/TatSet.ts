import mongoose, { Schema, Document } from 'mongoose';

export interface IStory {
  title: string;
  narration: string;
}

export interface ITatQuestion {
  image: string;
  stories: IStory[];
}

export interface ITatSet extends Document {
  setName: string;
  questions: ITatQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const TatSetSchema = new Schema<ITatSet>(
  {
    setName: {
      type: String,
      required: [true, 'Please provide a set name'],
    },
    questions: [
      {
        image: {
          type: String,
          required: [true, 'Image URL is required'],
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
    ],
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
const TatSet =
  mongoose.models.TatSet ||
  mongoose.model<ITatSet>('TatSet', TatSetSchema);

export default TatSet;
