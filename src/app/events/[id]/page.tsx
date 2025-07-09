"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Ticket,
  User,
  Globe,
  Clock,
  Tag,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";

// Import the EventWithDetails type
import { EventWithDetails } from "@/features/events/types/event";

// --- Framer Motion Variants ---
const pageFadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const sectionSlideIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
  transition: {
    duration: 0.6,
    ease: [0.16, 1, 0.3, 1],
  },
};

const buttonHover = {
  scale: 1.03,
  transition: { duration: 0.2 },
};

const galleryHover = {
  scale: 1.05,
  zIndex: 10,
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  transition: { duration: 0.3 },
};

// --- Helper Functions ---
const formatDateRange = (
  startDate: string | Date,
  endDate: string | Date
): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const startFormattedDate = start.toLocaleDateString("en-US", options);
  const endFormattedDate = end.toLocaleDateString("en-US", options);
  const startFormattedTime = start.toLocaleTimeString("en-US", timeOptions);
  const endFormattedTime = end.toLocaleTimeString("en-US", timeOptions);

  if (start.toDateString() === end.toDateString()) {
    return `${startFormattedDate} | ${startFormattedTime} - ${endFormattedTime}`;
  } else {
    return `${startFormattedDate} ${startFormattedTime} - ${endFormattedDate} ${endFormattedTime}`;
  }
};

const getTicketPriceRange = (
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
  if (minPrice === maxPrice) return `$${minPrice.toLocaleString()}`;
  return `$${minPrice.toLocaleString()} - $${maxPrice.toLocaleString()}`;
};

// --- Main Component ---
export default function SingleEventPage() {
  const { id } = useParams() as { id: string };
  const [event, setEvent] = useState<EventWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/events/${id}`);
        setEvent(response.data.event);
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Failed to load event details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Skeleton className="h-10 w-48 mb-8" />
        <Skeleton className="w-full h-[400px] rounded-2xl mb-10" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-10 w-3/4" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-6 w-3/4" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="lg:col-span-1 space-y-8">
            <Skeleton className="h-72 w-full" />
            <Skeleton className="h-52 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <div className="bg-gradient-to-r from-[#FF6B6B] to-[#468FAF] p-1 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="bg-white w-full h-full rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-[#FF6B6B]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Oops! Something went wrong.
        </h2>
        <p className="text-lg text-gray-600 mb-8">{error}</p>
        <Link href="/" passHref>
          <Button className="bg-gradient-to-r from-[#468FAF] to-[#3a7a99] hover:from-[#3a7a99] hover:to-[#468FAF] text-white px-8 py-3 rounded-xl">
            Go to Homepage
          </Button>
        </Link>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <div className="bg-gradient-to-r from-[#468FAF] to-[#FF6B6B] p-1 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="bg-white w-full h-full rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-[#468FAF]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Event Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          The event you are looking for does not exist or has been removed.
        </p>
        <Link href="/" passHref>
          <Button className="bg-gradient-to-r from-[#468FAF] to-[#3a7a99] hover:from-[#3a7a99] hover:to-[#468FAF] text-white px-8 py-3 rounded-xl">
            Go to Homepage
          </Button>
        </Link>
      </div>
    );
  }

  const {
    title,
    description,
    startDate,
    endDate,
    location,
    ticketTypes,
    bannerUrl,
    organizer,
    speakerImages,
    category,
  } = event;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageFadeIn}
      className="bg-gradient-to-b from-gray-50 to-white min-h-screen"
    >
      {/* Floating Header */}
      <motion.header
        variants={sectionSlideIn}
        className="z-50 bg-white/90 backdrop-blur-sm py-4 px-4 sm:px-6 shadow-sm"
      >
        <div className="container mx-auto max-w-5xl flex items-center justify-between">
          <Link href="/events" passHref>
            <Button
              variant="ghost"
              className="text-gray-700 hover:bg-gray-50 flex items-center gap-2 px-3 py-2 rounded-xl"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back to Events</span>
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate max-w-[calc(100%-160px)]">
            {title}
          </h1>
          <div className="flex items-center">
            <Badge
              variant="outline"
              className="border-[#468FAF] text-[#468FAF]"
            >
              {category || "Event"}
            </Badge>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-16 pb-16 max-w-5xl">
        <motion.div
          variants={sectionSlideIn}
          className="mb-10 relative w-full h-[30vh] md:h-[40vh] lg:h-[50vh] rounded-2xl overflow-hidden shadow-xl border-8 border-white"
        >
          {bannerUrl ? (
            <Image
              src={bannerUrl}
              alt={title}
              fill
              className="object-cover object-center"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gradient-to-r from-[#468FAF] to-[#FF6B6B] text-white text-xl">
              {title}
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 pt-16">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              {title}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center text-white/90">
                <CalendarDays className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  {formatDateRange(startDate, endDate)}
                </span>
              </div>
              <div className="w-1 h-1 bg-white/50 rounded-full"></div>
              <div className="flex items-center text-white/90">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{location.address}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description Section */}
            <motion.section variants={sectionSlideIn}>
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-[#468FAF]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                    Event Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-lg max-w-none text-gray-700">
                    {description}
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            {/* Gallery Section */}
            {speakerImages && speakerImages.length > 0 && (
              <motion.section variants={sectionSlideIn}>
                <Card className="border-0 shadow-sm rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-[#FF6B6B]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Event Gallery
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {speakerImages.map((imgSrc, index) => (
                        <motion.div
                          key={index}
                          whileHover={galleryHover}
                          className="relative rounded-xl overflow-hidden aspect-square shadow-md"
                        >
                          <Image
                            src={imgSrc}
                            alt={`Gallery image ${index + 1}`}
                            layout="fill"
                            objectFit="cover"
                            className="w-full h-full"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.section>
            )}

            {/* Location Section */}
            <motion.section variants={sectionSlideIn}>
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-[#468FAF]" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        {location.type === "offline" ? (
                          <MapPin className="h-6 w-6 text-[#FF6B6B]" />
                        ) : (
                          <Globe className="h-6 w-6 text-[#468FAF]" />
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium text-lg text-gray-800">
                          {location.type === "offline"
                            ? "In-Person Event"
                            : "Online Event"}
                        </h3>
                        <p className="text-gray-600 mt-1">{location.address}</p>
                      </div>
                    </div>

                    {location.type === "offline" && (
                      <div className="space-y-4">
                        {/* Map Display */}
                        <div className="rounded-xl overflow-hidden w-full h-64 border-2 border-gray-200">
                          <iframe
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(
                              location.address
                            )}&output=embed`}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            className="rounded-xl"
                          />
                        </div>
                        {/* Map Actions */}
                        <div className="flex gap-3">
                          <Button
                            asChild
                            variant="outline"
                            className="text-[#FF6B6B] border-[#FF6B6B] hover:bg-[#FF6B6B]/10"
                          >
                            <Link
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                location.address
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <MapPin className="h-4 w-4 mr-2" />
                              View on Google Maps
                            </Link>
                          </Button>

                          <Button
                            asChild
                            variant="outline"
                            className="text-[#468FAF] border-[#468FAF] hover:bg-[#468FAF]/10"
                          >
                            <Link
                              href={`https://maps.apple.com/?q=${encodeURIComponent(
                                location.address
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <MapPin className="h-4 w-4 mr-2" />
                              View on Apple Maps
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )}

                    {location.type === "online" && (
                      <div className="bg-gradient-to-r from-[#468FAF]/10 to-[#FF6B6B]/10 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between">
                        <div>
                          <h3 className="font-medium text-lg text-gray-800">
                            Online Access
                          </h3>
                          <p className="text-gray-600 mt-1">
                            Link will be provided after registration
                          </p>
                        </div>
                        <Button className="mt-4 sm:mt-0 bg-gradient-to-r from-[#468FAF] to-[#3a7a99] hover:from-[#3a7a99] hover:to-[#468FAF] text-white">
                          <Globe className="h-4 w-4 mr-2" /> Join Online
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          </div>

          {/* Sidebar Content */}
          <div className="lg:col-span-1 space-y-8">
            {/* Event Summary Card */}
            <motion.section variants={sectionSlideIn}>
              <Card className="border-0 shadow-lg rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Event Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <CalendarDays className="h-5 w-5 text-[#468FAF]" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Date & Time</p>
                      <p className="font-medium text-gray-800">
                        {formatDateRange(startDate, endDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <Clock className="h-5 w-5 text-[#FF6B6B]" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium text-gray-800">
                        {Math.round(
                          (new Date(endDate).getTime() -
                            new Date(startDate).getTime()) /
                            (1000 * 60 * 60)
                        )}{" "}
                        hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <MapPin className="h-5 w-5 text-[#468FAF]" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium text-gray-800">
                        {location.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <User className="h-5 w-5 text-[#FF6B6B]" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Organizer</p>
                      <p className="font-medium text-gray-800">
                        {organizer.name || organizer.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <Tag className="h-5 w-5 text-[#468FAF]" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-medium text-gray-800">
                        {category || "General"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            {/* Registration Card */}
            <motion.section variants={sectionSlideIn}>
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
                    <h3 className="font-medium text-gray-800">
                      Available Tickets
                    </h3>
                    {ticketTypes
                      .filter((t) => t.isActive)
                      .map((ticket) => (
                        <div
                          key={
                            ticket._id?.toString() ??
                            `ticket-${ticket.name}-${ticket.price}`
                          }
                          className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
                        >
                          <div>
                            <p className="font-medium text-gray-800">
                              {ticket.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {ticket.sold} sold
                            </p>
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

                  <motion.div whileHover={buttonHover}>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#e55f5f] hover:from-[#e55f5f] hover:to-[#FF6B6B] text-white py-6 text-lg rounded-xl font-bold"
                      size="lg"
                      onClick={() =>
                        window.open(
                          `${id}/register`,
                          "_blank",
                          "noopener=false"
                        )
                      }
                    >
                      Register Now
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.section>
          </div>
        </div>
      </main>

      {/* Footer CTA */}
      <motion.section
        variants={sectionSlideIn}
        className="bg-gradient-to-r from-[#468FAF] to-[#FF6B6B] py-16"
      >
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Join This Event?
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Register now to secure your spot and be part of this amazing
            experience.
          </p>
          <motion.div whileHover={buttonHover}>
            <Button
              type="button"
              variant="outline"
              className="bg-white text-[#FF6B6B] hover:bg-white/90 px-8 py-6 text-lg font-bold rounded-xl"
              size="lg"
              onClick={() =>
                window.open(`${id}/register`, "_blank", "noopener=false")
              }
            >
              Register Now
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
}
