"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  XCircle,
  Loader2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IBooking } from "@/models/Booking";
import { IEvent } from "@/models/Event";

interface BookingWithEvent extends Omit<IBooking, "event"> {
  _id: string;
  event: IEvent;
}

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
};

const bookingItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
  transition: {
    type: "spring",
    stiffness: 100,
    damping: 10,
  },
};

const BookingsPage = () => {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingWithEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/attendee/bookings");

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();

        if (data.success) {
          setBookings(data.bookings);
        } else {
          throw new Error(data.message || "Failed to load bookings");
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <BookingsLoading />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-background/80 backdrop-blur-sm border-0 shadow-lg max-w-md mx-auto">
            <CardHeader className="items-center">
              <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full">
                <XCircle className="text-red-500 dark:text-red-400 h-10 w-10" />
              </div>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <h2 className="text-2xl font-bold tracking-tight">
                Error loading bookings
              </h2>
              <p className="text-muted-foreground">{error}</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                onClick={() => window.location.reload()}
                className="gap-2"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                Try Again
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-background/80 backdrop-blur-sm border-0 shadow-lg max-w-md mx-auto">
            <CardHeader className="items-center">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-full text-white">
                <Ticket className="h-10 w-10" />
              </div>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <h2 className="text-2xl font-bold tracking-tight">
                No bookings yet
              </h2>
              <p className="text-muted-foreground">
                Your upcoming events will appear here
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => router.push("/events")} className="gap-2">
                Browse Events
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={pageVariants}
        className="space-y-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
            <p className="text-muted-foreground">
              Manage your event registrations
            </p>
          </div>
          <Badge variant="secondary" className="px-4 py-2 text-sm w-fit">
            {bookings.length} {bookings.length === 1 ? "Event" : "Events"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence>
            {bookings.map((booking) => (
              <motion.div
                key={booking._id}
                variants={bookingItemVariants}
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <BookingCard booking={booking} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

const BookingCard = ({ booking }: { booking: BookingWithEvent }) => {
  const router = useRouter();
  const event = booking.event;
  const ticketType = event.ticketTypes[booking.ticketTypeIndex];
  const createdAt = new Date(booking.createdAt);
  const eventDate = new Date(booking.event.startDate || createdAt); // Fallback to created date if event date not available

  const handleViewDetails = () => {
    router.push(`/bookings/${event.slug}`);
  };

  const handleViewEvent = () => {
    router.push(`/events/${event.slug}`);
  };

  return (
    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="grid grid-cols-1 lg:grid-cols-5">
        <div className="lg:col-span-2 bg-gradient-to-br from-primary/10 to-indigo-500/10 p-6 flex items-center justify-center">
          <div className="relative w-full h-48 rounded-md overflow-hidden">
            {/* Optional overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-indigo-600/20 z-10"></div>

            <Avatar className="w-full h-full rounded-lg z-0">
              {/* Image fallback to first letter of title if image fails */}
              <AvatarImage
                src={event.bannerUrl}
                alt={event.title}
                className="object-cover w-full h-full"
              />
              <AvatarFallback className="text-4xl font-bold bg-muted">
                {event.title?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Booking Details */}
        <div className="lg:col-span-3 p-6">
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                    {event.title}
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Booked on {format(createdAt, "MMMM do, yyyy")}
                  </p>
                </div>
                <Badge variant="outline" className="ml-2">
                  {format(eventDate, "MMM d")}
                </Badge>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">
                        {event.location.type === "online"
                          ? "Online Event"
                          : event.location.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-full">
                      <Ticket className="h-4 w-4 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ticket</p>
                      <p className="font-medium">{ticketType.name}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-full">
                      <div className="h-4 w-4 flex items-center justify-center text-emerald-500">
                        ₹
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-medium">₹{ticketType.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-full">
                      <Clock className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Booking ID
                      </p>
                      <p className="font-mono font-medium text-sm">
                        {booking._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleViewEvent}
                className="gap-2"
              >
                Event Page
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button onClick={handleViewDetails} className="gap-2">
                Booking Details
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const BookingsLoading = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-48" />
        </div>
        <Skeleton className="h-8 w-20" />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden border-0">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              <div className="lg:col-span-2 bg-muted/50 p-6">
                <Skeleton className="w-full h-48 rounded-lg" />
              </div>
              <div className="lg:col-span-3 p-6">
                <div className="flex justify-between">
                  <Skeleton className="h-7 w-64" />
                  <Skeleton className="h-6 w-16" />
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BookingsPage;
