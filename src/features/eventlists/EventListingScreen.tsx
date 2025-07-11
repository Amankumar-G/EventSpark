"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { EventWithDetails } from "@/features/events/types/event";
import { ErrorState } from "./components/ErrorState";
import { EventSearch } from "./components/EventSearch";
import { EventFilters } from "./components/EventFilters";
import { EventTabs } from "./components/EventTabs";
import { EventSkeleton } from "./components/EventSkeleton";
import { EventCard } from "./components/EventCard";
import { CTASection } from "./components/CTASection";
import { fadeIn, stagger, slideUp } from "./utils/eventUtils";

export default function EventListingScreen() {
  const [events, setEvents] = useState<EventWithDetails[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationTypeFilter, setLocationTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [priceFilter, setPriceFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get("/api/events");
        setEvents(response.data.events);
        setFilteredEvents(response.data.events);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...events];

    if (searchTerm) {
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((event) => event.category === categoryFilter);
    }

    if (locationTypeFilter !== "all") {
      result = result.filter(
        (event) => event.location.type === locationTypeFilter
      );
    }

    if (priceFilter !== "all") {
      if (priceFilter === "free") {
        result = result.filter((event) =>
          event.ticketTypes.some(
            (ticket) => ticket.price === 0 && ticket.isActive
          )
        );
      } else if (priceFilter === "paid") {
        result = result.filter((event) =>
          event.ticketTypes.some(
            (ticket) => ticket.price > 0 && ticket.isActive
          )
        );
      } else if (priceFilter === "under-50") {
        result = result.filter((event) =>
          event.ticketTypes.some(
            (ticket) =>
              ticket.price > 0 && ticket.price <= 50 && ticket.isActive
          )
        );
      }
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter).setHours(0, 0, 0, 0);
      result = result.filter((event) => {
        const eventDate = new Date(event.startDate).setHours(0, 0, 0, 0);
        return eventDate === filterDate;
      });
    }

    if (activeTab !== "all") {
      const now = new Date();

      result = result.filter((event) => {
        const startDate = new Date(event.startDate);

        if (activeTab === "active") {
          return startDate.toDateString() === now.toDateString();
        }

        if (activeTab === "upcoming") {
          return startDate > now;
        }

        if (activeTab === "past") {
          return (
            startDate < now && startDate.toDateString() !== now.toDateString()
          );
        }

        return true;
      });
    }

    setFilteredEvents(result);
  }, [
    events,
    searchTerm,
    categoryFilter,
    locationTypeFilter,
    dateFilter,
    priceFilter,
    activeTab,
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setLocationTypeFilter("all");
    setDateFilter(undefined);
    setPriceFilter("all");
  };

  if (error) {
    return <ErrorState onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#468FAF] to-[#FF6B6B] text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Amazing Events
            </h1>
            <p className="text-lg md:text-2xl mb-8 text-gray-700 font-medium opacity-95">
              Find your next experience among thousands of events happening
              worldwide
            </p>

            <EventSearch
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
            />
          </motion.div>
        </div>
      </div>

      {/* Filter Section */}
      {showFilters && (
        <EventFilters
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          locationTypeFilter={locationTypeFilter}
          setLocationTypeFilter={setLocationTypeFilter}
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          clearFilters={clearFilters}
          events={events}
        />
      )}

      {/* Status Tabs */}
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <EventTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Events Section */}
      <div className="container mx-auto max-w-6xl px-4 py-10">
        {isLoading ? (
          <EventSkeleton />
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gradient-to-r from-[#468FAF] to-[#FF6B6B] p-1 w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center">
              <div className="bg-white w-full h-full rounded-full flex items-center justify-center">
                <svg
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
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No events found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Try adjusting your search or filter criteria to find what you're
              looking for.
            </p>
            <button
              onClick={clearFilters}
              className="bg-gradient-to-r from-[#468FAF] to-[#3a7a99] hover:from-[#3a7a99] hover:to-[#468FAF] text-white px-6 py-3 rounded-lg font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredEvents.map((event) => (
              <motion.div key={String(event._id)} variants={slideUp}>
                <EventCard event={event} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* CTA Section */}
      {/* {!isLoading && filteredEvents.length > 0 && <CTASection />} */}
    </div>
  );
}
