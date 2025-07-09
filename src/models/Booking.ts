// models/Booking.ts
import mongoose, { Document, Schema } from "mongoose";
import Event from "./Event";
import User from "./User";

export interface IBooking extends Document {
  _id: string;
  eventId: mongoose.Types.ObjectId;
  attendeeId: string; // Generated unique ID for the attendee
  attendeeData: Record<string, any>; // Dynamic form data
  ticketSelections: {
    ticketTypeIndex: number; // Index in event.ticketTypes array
    quantity: number;
    priceAtBooking: number; // Store price at time of booking
  }[];
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "failed" | "free";
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  bookingReference: string; // Human-readable booking reference
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: Event.modelName,
      required: true,
    },
    attendeeId: {
      type: String,
      required: true,
      unique: true,
    },
    attendeeData: {
      type: Schema.Types.Mixed,
      required: true,
    },
    ticketSelections: [
      {
        ticketTypeIndex: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        priceAtBooking: { type: Number, required: true, min: 0 },
      },
    ],
    totalAmount: { type: Number, required: true, min: 0 },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "free"],
      default: "pending",
    },
    stripeSessionId: { type: String },
    stripePaymentIntentId: { type: String },
    bookingReference: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

BookingSchema.index({ eventId: 1, attendeeId: 1 }, { unique: true });
BookingSchema.index({ stripeSessionId: 1 });
BookingSchema.index({ bookingReference: 1 });

const Booking = mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;