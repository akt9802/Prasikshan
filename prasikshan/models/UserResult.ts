import mongoose, { Schema, Document } from 'mongoose';

export interface IResultItem {
  testName: string;
  score: number;
  timeTaken: number;
  dateTaken: string;
  responses?: any;
  createdAt?: Date;
}

export interface IUserResult extends Document {
  userId: mongoose.Types.ObjectId;
  oir: IResultItem[];
  ppdt: IResultItem[];
  tat: IResultItem[];
  wat: IResultItem[];
  srt: IResultItem[];
  lecturette: IResultItem[];
  pi: IResultItem[];
  createdAt: Date;
  updatedAt: Date;
}

const ResultItemSchema = new Schema({
  testName: String,
  score: Number,
  timeTaken: Number,
  dateTaken: Schema.Types.Mixed,
  responses: Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { strict: false });

const UserResultSchema = new Schema<IUserResult>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    oir: [ResultItemSchema],
    ppdt: [ResultItemSchema],
    tat: [ResultItemSchema],
    wat: [ResultItemSchema],
    srt: [ResultItemSchema],
    lecturette: [ResultItemSchema],
    pi: [ResultItemSchema],
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
const UserResult = mongoose.models.UserResult || mongoose.model<IUserResult>('UserResult', UserResultSchema);

export default UserResult;
