// types/globals.ts

export interface EventLocation {
  type: string;
  address: string;
  // Added onlineUrl for online events, and made it optional
  onlineUrl?: string;
  _id?: string; // Assuming _id might be present for existing locations
}

// Re-defined TicketType based on your new specific type,
// ensuring it aligns with what's expected for ticket creation.
export type TicketType = {
  name: string;
  price: number;
  isActive: boolean;
};

// Updated EventWithDetails interface
export interface EventWithDetails {
  // _id can be a string or an object with a toString method (e.g., MongoDB ObjectId)
  _id: string | { toString(): string };
  title: string;
  slug: string;
  description: string;
  // Dates can be string (ISO) or Date objects for flexibility
  startDate: string | Date;
  endDate: string | Date;
  location: EventLocation;
  // Use the defined TicketType for consistency, adding 'sold' as optional
  ticketTypes: Array<TicketType & { sold?: number; _id?: string }>;
  isPublic?: boolean; // Optional as per your update
  status: 'active' | 'pending' | 'draft' | 'cancelled';
  bannerUrl?: string; // Optional banner URL
  brochureUrl?: string; // Keeping this from previous version if still relevant
  speakerImages: string[]; // Array of image URLs
  organizer: {
    _id: string;
    email: string;
    name?: string; // Optional organizer name
  };
  createdAt?: string; // Optional, might not be needed on client-side forms
  updatedAt?: string; // Optional
  __v?: number; // Optional version key
  category?: string; // Keeping this as an example of additional fields
}

// EventFormData for form handling, specifically for file uploads
export type EventFormData = {
  _id?: string; // Optional for edit mode
  title: string;
  slug: string;
  description: string;
  startDate: string;
  endDate: string;
  location: { type: string; address: string; onlineUrl?: string }; // Include onlineUrl here too
  ticketTypes: TicketType[]; // Uses the defined TicketType
  isPublic: boolean;
  bannerImage: File | null;
  brochureFile: File | null;
  speakerImages: File[]; // Array of File objects for upload
};

// Props for the Create/Edit Event Modal
export type CreateEventModalProps = {
  initialData?: EventWithDetails; // Pre-fill form data for editing
  mode?: 'create' | 'edit'; // Specifies modal behavior
  onSuccess?: () => void; // Callback after successful operation
};