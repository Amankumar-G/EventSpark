"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";

const formattedDate = (startDate) =>
  new Date(startDate).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

// Define fallback dummy events
const dummyEvents = [
  {
    _id: "dummy-1",
    title: "Community Tech Conference",
    description:
      "Join us for a day of innovation and networking with industry leaders.",
    startDate: "July 15, 2025",
    slug: "tech-conference",
  },
  {
    _id: "dummy-2",
    title: "Health & Wellness Fair",
    description:
      "Explore health resources and enjoy fun activities with your family.",
    startDate: "August 5, 2025",
    slug: "wellness-fair",
  },
  {
    _id: "dummy-3",
    title: "Startup Pitch Night",
    description:
      "Watch top startups pitch their ideas to investors and mentors.",
    startDate: "August 20, 2025",
    slug: "pitch-night",
  },
];

export function FeaturedEvents() {
  const [events, setEvents] = useState(dummyEvents);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events"); // Your custom endpoint
        const data = await res.json();
        console.log(data);
        if (data?.events && Array.isArray(data.events)) {
          // Use fetched + dummy to ensure at least 3
          const finalEvents = [...data.events];

          if (finalEvents.length < 3) {
            const needed = 3 - finalEvents.length;
            finalEvents.push(...dummyEvents.slice(0, needed));
          }

          setEvents(finalEvents);
        }
      } catch (err) {
        console.error("Failed to load featured events:", err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-900">
          Upcoming <span className="text-[#FF6B6B]">Featured</span> Events
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Discover what's happening in your community
        </p>

        <motion.div
          className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 },
            },
          }}
        >
          {events.slice(0, 3).map((event) => (
            <motion.div
              key={event._id}
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
              whileHover={{ y: -5 }}
            >
              <Card className="hover:shadow-lg transition">
                <CardHeader className="p-0">
                  <div className="h-48 rounded-lg overflow-hidden relative">
                    {event.bannerUrl ? (
                      <img
                        src={event.bannerUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-[#468FAF] to-[#FF6B6B]" />
                    )}
                    {/* Optional overlay gradient */}
                    <div className="absolute inset-0 bg-black/10" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {event.description}
                  </CardDescription>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-[#468FAF]">
                      {formattedDate(event.startDate)}
                    </span>
                    <Button
                      variant="link"
                      className="text-[#FF6B6B] p-0 h-auto"
                    >
                      <Link href={`/events/${event.slug}`}>View details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12">
          <Button className="bg-[#FF6B6B] hover:bg-[#e55f5f] text-white">
            <Link href={`/events`}>View All Events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
