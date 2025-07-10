// models/Event.ts
import mongoose, { Document, Schema } from "mongoose";
import User from "./User";

export interface ITicketType {
  name: string;
  price: number;
  isActive: boolean;
  sold: number;
}

export interface IEventLocation {
  type: "online" | "offline";
  address?: string;
  onlineUrl?: string;
}

export interface IEvent extends Document {
  _id: string | { toString(): string };
  title: string;
  slug: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: IEventLocation;
  ticketTypes: ITicketType[];
  isPublic: boolean;
  status: "draft" | "pending" | "approved";
  formConfig?: any;
  bannerUrl?: string;
  brochureUrl?: string;
  speakerImages: string[];
  organizer: mongoose.Types.ObjectId;
  approvedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TicketTypeSchema = new Schema<ITicketType>({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  isActive: { type: Boolean, default: true },
  sold: { type: Number, required: true, default: 0 },
});

const EventLocationSchema = new Schema<IEventLocation>({
  type: { type: String, enum: ["online", "offline"], required: true },
  address: { type: String },
  onlineUrl: { type: String },
});

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: { type: EventLocationSchema, required: true },
    ticketTypes: [TicketTypeSchema],
    isPublic: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["draft", "pending", "approved"],
      default: "draft",
    },
    formConfig: {
      type: Schema.Types.Mixed,
      default: null,
    },
    bannerUrl: { type: String },
    brochureUrl: { type: String },
    speakerImages: [{ type: String }],
    organizer: {
      type: Schema.Types.ObjectId,
      ref: User.modelName,
      required: true,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: User.modelName,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

EventSchema.index({ organizer: 1 });
EventSchema.index({ status: 1 });

const Event = mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
