import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'organizer' | 'attendee';
  profileImage?: string;
  isActive: boolean;
  totalAmount: number; // Income or Spending based on role
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'organizer', 'attendee'],
      default: 'attendee',
      index: true,
    },
    profileImage: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Income for organizers/admins, spending for attendees',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
UserSchema.index({ email: 1, isActive: 1 });
UserSchema.index({ role: 1, isActive: 1 });

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
