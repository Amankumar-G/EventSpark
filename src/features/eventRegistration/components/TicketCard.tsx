import { motion } from "framer-motion";
import { Ticket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cardHover } from "../constants/animations";

interface TicketCardProps {
  ticket: any;
  isSelected: boolean;
  onClick: () => void;
}

export const TicketCard = ({
  ticket,
  isSelected,
  onClick,
}: TicketCardProps) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    transition={{
      type: "spring",
      stiffness: 400,
      damping: 10,
    }}
  >
    <div
      className={`border overflow-hidden transition-all ${
        isSelected
          ? "border-[#468FAF] ring-2 ring-[#468FAF]/20"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Ticket className="h-5 w-5 text-[#FF6B6B]" />
              <h3 className="text-lg font-semibold">{ticket.name}</h3>
            </div>
            <Badge variant="outline" className="text-xs">
              {ticket.sold} sold
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              ₹{ticket.price.toLocaleString()}
            </p>
          </div>
        </div>
        <Separator className="my-4" />
        <Button
          onClick={onClick}
          disabled={isSelected}
          className="w-full"
          variant={isSelected ? "default" : "outline"}
        >
          {isSelected ? "Selected" : "Select Ticket"}
        </Button>
      </div>
    </div>
  </motion.div>
);
