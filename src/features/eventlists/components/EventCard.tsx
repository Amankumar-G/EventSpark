import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { EventWithDetails } from "@/features/events/types/event";
import { formatDate, getCheapestTicketPrice } from "../utils/eventUtils";

export const EventCard = ({ event }: { event: EventWithDetails }) => {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="relative w-full h-48">
        {event.bannerUrl ? (
          <Image
            src={event.bannerUrl}
            alt={event.title}
            layout="fill"
            objectFit="cover"
            className="object-center"
          />
        ) : (
          <div className="bg-gradient-to-r from-[#468FAF] to-[#FF6B6B] w-full h-full flex items-center justify-center text-white text-lg font-semibold">
            {event.title}
          </div>
        )}
      </div>

      <CardContent className="p-6 flex-grow flex flex-col">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-xl font-bold text-gray-800 truncate">
            {event.title}
          </CardTitle>
          {event.category && (
            <CardDescription className="text-[#468FAF] font-medium">
              {event.category}
            </CardDescription>
          )}
        </CardHeader>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <CalendarDays className="h-4 w-4 mr-2 text-[#468FAF]" />
            <span>{formatDate(event.startDate)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-[#FF6B6B]" />
            <span className="truncate">{event.location.address}</span>
          </div>
        </div>

        <div className="mt-auto flex justify-between items-center">
          <Badge
            variant="outline"
            className={
              event.location.type === "offline"
                ? "border-[#468FAF] text-[#468FAF]"
                : "border-[#FF6B6B] text-[#FF6B6B]"
            }
          >
            {event.location.type === "offline" ? "In-person" : "Online"}
          </Badge>
          <span className="font-bold text-gray-800">
            {getCheapestTicketPrice(
              event.ticketTypes
                .filter((ticket) => ticket.isActive !== undefined)
                .map((ticket) => ({
                  price: ticket.price,
                  isActive: ticket.isActive as boolean,
                }))
            )}
          </span>
        </div>

        <Button
          asChild
          variant="ghost"
          className="mt-4 text-[#468FAF] hover:text-[#3a7a99] hover:bg-[#468FAF]/10 px-0"
        >
          <Link href={`/events/${event.slug}`}>
            View details <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};