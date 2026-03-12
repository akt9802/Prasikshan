import mongoose, { Schema, Document } from 'mongoose';

export interface ITestResult {
  testName: string;
  score: number;
  timeTaken: number;
  dateTaken: string;
  responses?: any[];
  createdAt?: Date;
  [key: string]: any;
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  profileImage?: string;
  testsTaken?: ITestResult[];
  isVerified: boolean;
  verifyOtp?: string;
  verifyOtpExpiry?: Date;
  resetPasswordOtp?: string;
  resetPasswordOtpExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Please provide a username'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Don't return password by default
    },
    fullName: {
      type: String,
      trim: true,
      maxlength: [50, 'Full name cannot exceed 50 characters'],
    },
    profileImage: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifyOtp: {
      type: String,
    },
    verifyOtpExpiry: {
      type: Date,
    },
    resetPasswordOtp: {
      type: String,
    },
    resetPasswordOtpExpiry: {
      type: Date,
    },
    testsTaken: {
      type: [
        {
          testName: String,
          score: Number,
          timeTaken: Number,
          dateTaken: String,
          responses: Schema.Types.Mixed,
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
