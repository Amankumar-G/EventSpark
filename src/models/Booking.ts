// models/Booking.ts
import mongoose, { Document, Schema } from "mongoose";
import Event from "./Event";

export interface IBooking extends Document {
  event: string | { toString(): string };
  userId: string; // Clerk ID or Mongo ID
  formData: Record<string, unknown>;
  ticketTypeIndex: number;
  paymentIntentId: string;
  // status: "pending" | "paid" | "cancelled";
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  event: { type: Schema.Types.ObjectId,   ref: Event.modelName, required: true },
  userId: { type: String, required: true },
  formData: { type: Schema.Types.Mixed, required: true },
  ticketTypeIndex: { type: Number, required: true },
  paymentIntentId: { type: String },
  // status: { type: String, enum: ["pending", "paid", "cancelled"], default: "pending" },
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
