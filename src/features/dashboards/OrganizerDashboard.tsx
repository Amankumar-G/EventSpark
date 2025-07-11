"use client";

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchOrganizerEvents } from "@/hooks/useFetchOrganizerEvents";
import { CalendarDays, MapPin, Ticket } from "lucide-react";
import { CreateEventModal } from "@/features/events/components/CreateEvent";
import AttendeeModal from "@/features/events/components/AttendeeModal";
import { EventWithDetails, TicketType } from "@/features/events/types/event";
import { useState } from "react";
// Updated type definition

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const cardHover = {
  hover: { y: -5, transition: { duration: 0.2 } },
};

export default function OrganizerDashboard() {
  const { user } = useUser();
  const { events, isLoading, error, refetch } = useFetchOrganizerEvents(
    user?.id
  );

  const activeEvents = events?.filter((e) => e.status === "approved").length || 0;

  const pendingEvents =
    events?.filter((e) => e.status === "pending").length || 0;

  const totalRegistrations =
    events?.reduce((sum: number, event: EventWithDetails) => {
      return (
        sum +
        event.ticketTypes.reduce(
          (tSum: number, ticket: TicketType & { sold?: number }) => {
            return tSum + (ticket.sold || 0);
          },
          0
        )
      );
    }, 0) || 0;

  const totalEarnings =
    events?.reduce((sum: number, event: EventWithDetails) => {
      return (
        sum +
        event.ticketTypes.reduce(
          (tSum: number, ticket: TicketType & { sold?: number }) => {
            return tSum + (ticket.sold || 0) * ticket.price;
          },
          0
        )
      );
    }, 0) || 0;

  const summaryCards = [
    {
      title: "Active Events",
      value: activeEvents,
      icon: "🎯",
    },
    {
      title: "Pending Approvals",
      value: pendingEvents,
      icon: "⏳",
    },
    {
      title: "Total Registrations",
      value: totalRegistrations,
      icon: "🎟️",
    },
    {
      title: "Total Earnings",
      value: `₹${totalEarnings.toLocaleString()}`,
      icon: "💰",
    },
  ];

  // Handle successful event creation/update
  const handleEventSuccess = () => {
    refetch(); // Refetch the events to update the dashboard
  };

  if (error)
    return (
      <div className="text-red-500 p-4">
        Error loading events: {error.message}
      </div>
    );

  return (
    <div className="container mx-auto px-4 pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Event Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your events and track performance
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <CreateEventModal mode="create" onSuccess={handleEventSuccess} />
        </div>
      </div>

      {/* Summary Cards Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ staggerChildren: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {summaryCards.map((card, index) => (
          <motion.div key={index} variants={fadeIn} whileHover="hover">
            <motion.div variants={cardHover}>
              <SummaryCard
                title={card.title}
                value={card.value}
                icon={card.icon}
                index={index}
              />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Events Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Events</h2>
          <div className="text-sm text-muted-foreground">
            {events?.length || 0} {events?.length === 1 ? "event" : "events"}{" "}
            total
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <EventsTable
            events={events || []}
            onEventUpdate={handleEventSuccess}
          />
        )}
      </motion.div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
  index,
}: {
  title: string;
  value: string | number;
  icon: string;
  index: number;
}) {
  const colors = ["bg-blue-50", "bg-orange-50", "bg-green-50", "bg-purple-50"];
  const accents = [
    "text-[#468FAF]",
    "text-[#FF6B6B]",
    "text-green-600",
    "text-purple-600",
  ];

  return (
    <Card className={`${colors[index]} border-0 rounded-xl h-full`}>
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle className={`text-sm font-medium ${accents[index]}`}>
          {title}
        </CardTitle>
        <span className="text-2xl">{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function EventsTable({
  events,
  onEventUpdate,
}: {
  events: EventWithDetails[];
  onEventUpdate: () => void;
}) {
  const [openModalEventId, setOpenModalEventId] = useState<string | null>(null);
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getCheapestTicketPrice = (ticketTypes: { price: number }[]) => {
    if (!ticketTypes.length) return 0;
    return Math.min(...ticketTypes.map((t) => t.price));
  };

  const getTotalTicketsSold = (ticketTypes: { sold?: number }[]) => {
    return ticketTypes.reduce((sum, ticket) => sum + (ticket.sold || 0), 0);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Tickets</TableHead>
          <TableHead>Price</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow
            key={
              typeof event._id === "string" ? event._id : event._id.toString()
            }
          >
            <TableCell className="font-medium">
              <div className="flex items-center gap-3">
                  <div>{event.title}</div>
              </div>
            </TableCell>
            <TableCell>{getStatusBadge(event.status)}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                 <span className="truncate max-w-[200px] overflow-hidden whitespace-nowrap text-sm text-muted-foreground">
                  {event.location.address}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span>
                  {new Date(event.startDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-muted-foreground" />
                <span>{getTotalTicketsSold(event.ticketTypes)}</span>
              </div>
            </TableCell>
            <TableCell>
              ₹{getCheapestTicketPrice(event.ticketTypes).toLocaleString()}
              {event.ticketTypes.length > 1 && "+"}
            </TableCell>
            <TableCell className="flex justify-end gap-2">
              <CreateEventModal
                initialData={event}
                mode="edit"
                onSuccess={onEventUpdate}
              />
              <Button variant="outline" size="sm" asChild>
                <Link href={`/events/${event.slug}`}>View</Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpenModalEventId(event._id.toString())}
              >
                View Attendee List
              </Button>
              {openModalEventId && (
                <AttendeeModal
                  eventId={openModalEventId}
                  open={!!openModalEventId}
                  onClose={() => setOpenModalEventId(null)}
                />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
