import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  Tag,
  Users,
} from "lucide-react";
import { formatDateRange } from "../utils/formatDateRange";
import { getTicketPriceRange } from "../utils/getTicketPriceRange";
import { Badge } from "@/components/ui/badge";
import { ITicketType,IEventLocation} from "@/models/Event"
// ---------- Define types based on your schema ----------

interface IEventSidebarProps {
  startDate: string | Date;
  endDate: string | Date;
  location: IEventLocation;
  organizer: {
    name?: string;
    email: string;
  };
  category: string;
  ticketTypes: ITicketType[];
  registered: boolean;
  eventId: string;
}

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const buttonHover = {
  scale: 1.03,
  transition: { duration: 0.2 },
};

export const EventSidebar = ({
  startDate,
  endDate,
  location,
  organizer,
  category,
  ticketTypes,
  registered,
  eventId,
}: IEventSidebarProps) => (
  <>
    <Card className="border-0 shadow-lg rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Event Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <DetailItem
          icon={<CalendarDays className="h-5 w-5 text-[#468FAF]" />}
          label="Date & Time"
          value={formatDateRange(startDate, endDate)}
        />

        <DetailItem
          icon={<Clock className="h-5 w-5 text-[#FF6B6B]" />}
          label="Duration"
          value={`${Math.round(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60)
          )} hours`}
        />

        <DetailItem
          icon={<MapPin className="h-5 w-5 text-[#468FAF]" />}
          label="Location"
          value={location.address || "Online"}
        />

        <DetailItem
          icon={<User className="h-5 w-5 text-[#FF6B6B]" />}
          label="Organizer"
          value={organizer.name || organizer.email}
        />

        <DetailItem
          icon={<Tag className="h-5 w-5 text-[#468FAF]" />}
          label="Category"
          value={category || "General"}
        />
      </CardContent>
    </Card>

    <Card className="border-0 shadow-lg rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Register Now
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gradient-to-r from-[#468FAF]/10 to-[#FF6B6B]/10 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Price From</p>
              <p className="text-2xl font-bold text-[#FF6B6B]">
                {getTicketPriceRange(ticketTypes)}
              </p>
            </div>
            <Users className="h-8 w-8 text-[#468FAF]" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-800">Available Tickets</h3>
          {ticketTypes.filter((t) => t.isActive).map((ticket) => (
            <div
              key={ticket._id?.toString() ?? `ticket-${ticket.name}-${ticket.price}`}
              className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
            >
              <div>
                <p className="font-medium text-gray-800">{ticket.name}</p>
                <p className="text-sm text-gray-500">{ticket.sold} sold</p>
              </div>
              <p className="font-medium text-gray-800">
                ${ticket.price.toLocaleString()}
              </p>
            </div>
          ))}
          {ticketTypes.filter((t) => t.isActive).length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No tickets currently available
            </p>
          )}
        </div>

        {registered ? (
          <Button
            disabled
            variant="outline"
            className="w-full bg-gray-100 text-gray-500 py-6 text-lg rounded-xl font-bold cursor-not-allowed"
          >
            Already Registered
          </Button>
        ) : (
          <motion.div whileHover={buttonHover}>
            <Link href={`${eventId}/register`} passHref>
              <Button
                type="button"
                variant="outline"
                className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#e55f5f] hover:from-[#e55f5f] hover:to-[#FF6B6B] text-white py-6 text-lg rounded-xl font-bold"
                size="lg"
              >
                Register Now
              </Button>
            </Link>
          </motion.div>
        )}
      </CardContent>
    </Card>
  </>
);

const DetailItem = ({ icon, label, value }: DetailItemProps) => (
  <div className="flex items-start">
    <div className="bg-gray-100 p-3 rounded-lg">{icon}</div>
    <div className="ml-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  </div>
);
