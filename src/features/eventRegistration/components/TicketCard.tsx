import { motion } from "framer-motion";
import { Ticket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cardHover } from "../constants/animations";

interface TicketCardProps {
  ticket: any;
  isSelected: boolean;
  isLoading?: boolean; // 🆕
  onClick: () => void;
}

export const TicketCard = ({
  ticket,
  isSelected,
  onClick,
  isLoading,
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
          disabled={isLoading}
          className={`w-full ${isSelected ? "bg-[#FF6B6B] text-white" : ""}`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              Loading...
            </span>
          ) : isSelected ? (
            "Selected"
          ) : (
            "Select"
          )}
        </Button>
      </div>
    </div>
  </motion.div>
);
