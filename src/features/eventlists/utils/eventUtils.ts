export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

export const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export const formatDate = (dateString: string | Date) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const getCheapestTicketPrice = (
  ticketTypes: { price: number; isActive: boolean }[]
) => {
  if (!ticketTypes || ticketTypes.length === 0) return "Free";
  const activeTickets = ticketTypes.filter((t) => t.isActive);
  if (activeTickets.length === 0) return "N/A";
  const minPrice = Math.min(...activeTickets.map((t) => t.price));
  return minPrice === 0 ? "Free" : `₹${minPrice.toLocaleString()}`;
};