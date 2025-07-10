import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { TicketCard } from "./TicketCard";

interface TicketSelectionProps {
  ticketTypes: any[];
  selectedTicketType: number | null;
  onSelectTicket: (index: number) => void;
}

export const TicketSelection = ({
  ticketTypes,
  selectedTicketType,
  onSelectTicket,
}: TicketSelectionProps) => (
  <Card className="border-0 shadow-sm rounded-xl overflow-hidden">
    <CardHeader className="bg-gradient-to-r from-[#FF6B6B] to-[#e55f5f] p-6 text-white">
      <CardTitle>Available Tickets</CardTitle>
      <CardDescription className="text-white/90">
        {ticketTypes.length} options available
      </CardDescription>
    </CardHeader>
    <CardContent className="p-6 space-y-4">
      {ticketTypes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No active tickets available for this event
        </div>
      ) : (
        ticketTypes.map((ticket, index) => (
          <TicketCard
            key={index}
            ticket={ticket}
            isSelected={selectedTicketType === index}
            onClick={() => onSelectTicket(index)}
          />
        ))
      )}
    </CardContent>
  </Card>
);