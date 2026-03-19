import mongoose, { Schema, Document } from 'mongoose';

export interface IWatQuestion {
  word: string;
  sentences: string[];
}

export interface IWatSet extends Document {
  setName: string;
  questions: IWatQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const WatSetSchema = new Schema<IWatSet>(
  {
    setName: {
      type: String,
      required: [true, 'Please provide a set name'],
    },
    questions: [
      {
        word: {
          type: String,
          required: [true, 'Word is required'],
        },
        sentences: {
          type: [String],
          required: [true, 'Sentences are required'],
          validate: {
            validator: function (v: string[]) {
              return v.length > 0;
            },
            message: 'At least one sentence is required',
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
const WatSet =
  mongoose.models.WatSet ||
  mongoose.model<IWatSet>('WatSet', WatSetSchema);

export default WatSet;
