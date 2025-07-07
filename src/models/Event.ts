import mongoose, { Document, Schema } from 'mongoose';
import User from "./User";

export interface ITicketType {
  name: string;
  price: number;
  isActive: boolean;
}

export interface IEventLocation {
  type: 'online' | 'offline';
  address?: string;
  onlineUrl?: string;
}


export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: IEventLocation;
  ticketTypes: ITicketType[];
  isPublic: boolean;
  status: 'draft' | 'pending' | 'approved';
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
  isActive: { type: Boolean, default: true }
});

const EventLocationSchema = new Schema<IEventLocation>({
  type: { type: String, enum: ['online', 'offline'], required: true },
  address: { type: String },
  onlineUrl: { type: String }
});


const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: { type: EventLocationSchema, required: true },
    ticketTypes: [TicketTypeSchema],
    isPublic: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['draft', 'pending', 'approved'],
      default: 'draft'
    },
    bannerUrl: { type: String },
    brochureUrl: { type: String },
    speakerImages: [{ type: String }],
    organizer: {
      type: Schema.Types.ObjectId,
      ref: User.modelName,
      required: true
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: User.modelName,
      required: false
    }
  },
  {
    timestamps: true
  }
);

// Optional indexes
EventSchema.index({ organizer: 1 });
EventSchema.index({ status: 1 });

const Event =
  mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;


// import mongoose, { Document, Schema } from 'mongoose';

// export interface ITicketType {
//   name: string;
//   price: number;
//   description?: string;
//   maxQuantity?: number;
//   isActive: boolean;
// }

// export interface IAgendaItem {
//   time: string;
//   title: string;
//   description?: string;
//   speaker?: string;
//   speakerImage?: string;
// }

// export interface IEventLocation {
//   type: 'online' | 'offline';
//   address?: string;
//   city?: string;
//   state?: string;
//   country?: string;
//   zipCode?: string;
//   onlineUrl?: string;
//   venue?: string;
// }

// export interface IEvent extends Document {
//   title: string;
//   slug: string;
//   description: string;
//   shortDescription?: string;
//   startDate: Date;
//   endDate: Date;
//   location: IEventLocation;
//   banner?: string;
//   brochure?: string;
//   speakerImages: string[];
//   agenda: IAgendaItem[];
//   ticketTypes: ITicketType[];
//   maxAttendees?: number;
//   isPublic: boolean;
//   status: 'draft' | 'pending' | 'approved' | 'rejected' | 'cancelled';
//   approvalMessage?: string;
//   category?: string;
//   tags: string[];
//   organizer: mongoose.Types.ObjectId;
//   approvedBy?: mongoose.Types.ObjectId;
//   approvedAt?: Date;
//   totalRegistrations: number;
//   totalEarnings: number;
//   customFormSchema?: any; // JSON schema for custom form
//   createdAt: Date;
//   updatedAt: Date;
// }

// const TicketTypeSchema = new Schema<ITicketType>({
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//     min: 0,
//   },
//   description: {
//     type: String,
//     trim: true,
//   },
//   maxQuantity: {
//     type: Number,
//     min: 1,
//   },
//   isActive: {
//     type: Boolean,
//     default: true,
//   },
// });

// const AgendaItemSchema = new Schema<IAgendaItem>({
//   time: {
//     type: String,
//     required: true,
//   },
//   title: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   description: {
//     type: String,
//     trim: true,
//   },
//   speaker: {
//     type: String,
//     trim: true,
//   },
//   speakerImage: {
//     type: String,
//   },
// });

// const EventLocationSchema = new Schema<IEventLocation>({
//   type: {
//     type: String,
//     enum: ['online', 'offline'],
//     required: true,
//   },
//   address: String,
//   city: String,
//   state: String,
//   country: String,
//   zipCode: String,
//   onlineUrl: String,
//   venue: String,
// });

// const EventSchema = new Schema<IEvent>(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//       index: true,
//     },
//     slug: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       index: true,
//     },
//     description: {
//       type: String,
//       required: true,
//     },
//     shortDescription: {
//       type: String,
//       maxlength: 200,
//     },
//     startDate: {
//       type: Date,
//       required: true,
//       index: true,
//     },
//     endDate: {
//       type: Date,
//       required: true,
//     },
//     location: {
//       type: EventLocationSchema,
//       required: true,
//     },
//     banner: {
//       type: String,
//     },
//     brochure: {
//       type: String,
//     },
//     speakerImages: [{
//       type: String,
//     }],
//     agenda: [AgendaItemSchema],
//     ticketTypes: [TicketTypeSchema],
//     maxAttendees: {
//       type: Number,
//       min: 1,
//     },
//     isPublic: {
//       type: Boolean,
//       default: false,
//       index: true,
//     },
//     status: {
//       type: String,
//       enum: ['draft', 'pending', 'approved', 'rejected', 'cancelled'],
//       default: 'draft',
//       index: true,
//     },
//     approvalMessage: {
//       type: String,
//     },
//     category: {
//       type: String,
//       index: true,
//     },
//     tags: [{
//       type: String,
//       lowercase: true,
//     }],
//     organizer: {
//       type: Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//       index: true,
//     },
//     approvedBy: {
//       type: Schema.Types.ObjectId,
//       ref: 'User',
//     },
//     approvedAt: {
//       type: Date,
//     },
//     totalRegistrations: {
//       type: Number,
//       default: 0,
//     },
//     totalEarnings: {
//       type: Number,
//       default: 0,
//     },
//     customFormSchema: {
//       type: Schema.Types.Mixed, // JSON schema for dynamic forms
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Indexes for better query performance
// EventSchema.index({ status: 1, isPublic: 1 });
// EventSchema.index({ organizer: 1, status: 1 });
// EventSchema.index({ startDate: 1, status: 1 });
// EventSchema.index({ category: 1, startDate: 1 });
// EventSchema.index({ tags: 1 });

// // Text search index
// EventSchema.index({ 
//   title: 'text', 
//   description: 'text', 
//   shortDescription: 'text' 
// });

// export const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema); for this schema make an api in next js to create, update and delete event 