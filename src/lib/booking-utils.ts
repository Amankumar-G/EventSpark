// lib/booking-utils.ts
import { customAlphabet } from 'nanoid';

export const generateAttendeeId = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 12);
export const generateBookingReference = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

export function validateTicketAvailability(
  event: any,
  ticketSelections: { ticketTypeIndex: number; quantity: number }[]
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (const selection of ticketSelections) {
    const ticketType = event.ticketTypes[selection.ticketTypeIndex];
    
    if (!ticketType) {
      errors.push(`Invalid ticket type at index ${selection.ticketTypeIndex}`);
      continue;
    }
    
    if (!ticketType.isActive) {
      errors.push(`Ticket type "${ticketType.name}" is not active`);
      continue;
    }
    
    // Note: You might want to add a totalQuantity field to your schema
    // For now, we'll assume unlimited tickets unless you have inventory management
    if (selection.quantity <= 0) {
      errors.push(`Invalid quantity for ticket type "${ticketType.name}"`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}