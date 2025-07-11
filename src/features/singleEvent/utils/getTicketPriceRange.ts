import { EventWithDetails } from "@/features/events/types/event";

export const getTicketPriceRange = (
  ticketTypes: EventWithDetails["ticketTypes"]
): string => {
  if (!ticketTypes || ticketTypes.length === 0) return "Free";

  const activePrices = ticketTypes
    .filter((t) => t.isActive && t.price !== undefined)
    .map((t) => t.price);
  if (activePrices.length === 0) return "Free";

  const minPrice = Math.min(...activePrices);
  const maxPrice = Math.max(...activePrices);

  if (minPrice === 0) return "Free";
  if (minPrice === maxPrice) return `₹${minPrice.toLocaleString()}`;
  return `₹${minPrice.toLocaleString()} - ₹${maxPrice.toLocaleString()}`;
};