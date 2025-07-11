// models/Booking.ts
import mongoose, { Document, Schema } from "mongoose";
import Event from "./Event";

export interface IBooking extends Document {
  event: string | { toString(): string };
  userId: string;
  formData: Record<string, unknown>;
  ticketTypeId: string; // <-- Changed from index to ID
  paymentIntentId: string;
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    event: { type: Schema.Types.ObjectId, ref: Event.modelName, required: true },
    userId: { type: String, required: true },
    formData: { type: Schema.Types.Mixed, required: true },
    ticketTypeId: { type: String, required: true }, // <-- Changed from Number to String
    paymentIntentId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
