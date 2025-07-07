export type Roles = "Admin" | "Organizer" | "Attendee";

// export type EventWithDetails = {
//   _id: string
//   title: string
//   slug: string
//   description: string
//   startDate: string
//   endDate: string
//   location: {
//     venue: string
//     address: string
//     city: string
//     country: string
//   }
//   ticketTypes: {
//     name: string
//     price: number
//     quantity: number
//     sold: number
//   }[]
//   isPublic: boolean
//   status: 'active' | 'pending' | 'draft' | 'cancelled'
//   bannerUrl: string
//   brochureUrl: string
//   speakerImages: string[]
//   createdAt: string
//   updatedAt: string
// }

export interface EventWithDetails {
  _id: string | { toString(): string }
  title: string
  slug: string
  description: string
  startDate: string | Date
  endDate: string | Date
  location: {
    type: string
    address: string
  }
  ticketTypes: Array<{
    name: string
    price: number
    isActive?: boolean
    sold?: number
  }>
  isPublic?: boolean
  status: 'active' | 'pending' | 'draft' | 'cancelled'
  bannerUrl : string
}

export type EventsApiResponse = {
  success: boolean
  events: EventWithDetails[]
}
declare global {
  interface CustomJwtSessionClaims {
    metadata: { role?: Roles };
  }
}
