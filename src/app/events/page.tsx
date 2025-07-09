"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  MapPin,
  Filter,
  Search,
  X,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { EventWithDetails } from "@/features/events/types/event";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function EventListingScreen() {
  const [events, setEvents] = useState<EventWithDetails[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationTypeFilter, setLocationTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [priceFilter, setPriceFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  // Filter visibility
  const [showFilters, setShowFilters] = useState(false);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // In a real app, this would be your actual API endpoint
        const response = await axios.get("/api/events");
        console.log(response)
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

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter((event) => event.category === categoryFilter);
    }

    // Apply location type filter
    if (locationTypeFilter !== "all") {
      result = result.filter(
        (event) => event.location.type === locationTypeFilter
      );
    }

    // Apply price filter
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

    // Apply date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter).setHours(0, 0, 0, 0);
      result = result.filter((event) => {
        const eventDate = new Date(event.startDate).setHours(0, 0, 0, 0);
        return eventDate === filterDate;
      });
    }

    // Apply status filter (tabs)
    if (activeTab !== "all") {
      result = result.filter((event) => event.status === activeTab);
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

  // Get cheapest ticket price
  const getCheapestTicketPrice = (
    ticketTypes: EventWithDetails["ticketTypes"]
  ) => {
    if (!ticketTypes || ticketTypes.length === 0) return "Free";
    const activeTickets = ticketTypes.filter((t) => t.isActive);
    if (activeTickets.length === 0) return "N/A";
    const minPrice = Math.min(...activeTickets.map((t) => t.price));
    return minPrice === 0 ? "Free" : `$${minPrice.toLocaleString()}`;
  };

  // Format date
  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setLocationTypeFilter("all");
    setDateFilter(undefined);
    setPriceFilter("all");
  };

  // Get unique categories
  const uniqueCategories = Array.from(
    new Set(events.map((event) => event.category || "Uncategorized"))
  ).filter(Boolean);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-8 max-w-md">
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
            Error Loading Events
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't load the events. Please try again later.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-[#468FAF] to-[#3a7a99] hover:from-[#3a7a99] hover:to-[#468FAF] text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    );
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

            <div className="relative max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-4">
              <Search className="absolute left-4 top-1/2 ml-1 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search events by name, location, or category..."
                className="pl-12 pr-4 py-5 text-base md:text-lg bg-white text-gray-800 rounded-xl placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-none border-none"
              />

              <Button
                onClick={() => setShowFilters(!showFilters)}
                className="mr-2 absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-lg px-4 py-2 shadow-none"
              >
                <Filter className="h-5 w-5 mr-2" /> Filters
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filter Section */}
      {showFilters && (
        <div
          className={cn(
            "transition-all duration-500 ease-in-out overflow-hidden bg-white border-b shadow-sm",
            showFilters
              ? "max-h-[1000px] opacity-100 py-6"
              : "max-h-0 opacity-0 py-0"
          )}
        >
          <div className="container mx-auto max-w-6xl px-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-700">Filter by:</h3>
                <Button
                  onClick={clearFilters}
                  variant="ghost"
                  className="text-[#FF6B6B] hover:bg-[#FF6B6B]/10"
                >
                  <X className="h-4 w-4 mr-1" /> Clear all
                </Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <span className="text-gray-500 mr-2">Category:</span>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {uniqueCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={locationTypeFilter}
                  onValueChange={setLocationTypeFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <span className="text-gray-500 mr-2">Location:</span>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="offline">In-person</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger className="w-[180px]">
                    <span className="text-gray-500 mr-2">Price:</span>
                    <SelectValue placeholder="All Prices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="free">Free Events</SelectItem>
                    <SelectItem value="paid">Paid Events</SelectItem>
                    <SelectItem value="under-50">Under $50</SelectItem>
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !dateFilter && "text-muted-foreground"
                      )}
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {dateFilter ? (
                        format(dateFilter, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFilter}
                      onSelect={setDateFilter}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Tabs */}
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <div className="overflow-x-auto">
            <TabsList className="inline-flex gap-4 bg-transparent w-full">
              {["all", "active", "upcoming", "past"].map((status) => (
                <TabsTrigger
                  key={status}
                  value={status}
                  className="relative flex-1 pb-2 text-sm md:text-base text-gray-800 font-medium transition-colors
                    after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0
                    after:bg-orange-500 after:transition-all after:duration-300
                    data-[state=active]:after:w-full data-[state=active]:text-black"
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>
      </div>

      {/* Events Section */}
      <div className="container mx-auto max-w-6xl px-4 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card
                key={i}
                className="border-0 shadow-sm rounded-2xl overflow-hidden"
              >
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-6 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
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
            <Button
              onClick={clearFilters}
              className="bg-gradient-to-r from-[#468FAF] to-[#3a7a99] hover:from-[#3a7a99] hover:to-[#468FAF] text-white"
            >
              Clear all filters
            </Button>
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
                <Card className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow h-full flex flex-col">
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
                    <Badge className="absolute top-3 right-3 bg-white text-gray-800 shadow-sm">
                      {event.status.charAt(0).toUpperCase() +
                        event.status.slice(1)}
                    </Badge>
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
                        <span className="truncate">
                          {event.location.address}
                        </span>
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
                        {event.location.type === "offline"
                          ? "In-person"
                          : "Online"}
                      </Badge>
                      <span className="font-bold text-gray-800">
                        {getCheapestTicketPrice(event.ticketTypes)}
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
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* CTA Section */}
      {!isLoading && filteredEvents.length > 0 && (
        <div className="container mx-auto max-w-6xl px-4 py-12">
          <Card className="bg-gradient-to-r from-[#468FAF] to-[#FF6B6B] text-white border-0 rounded-2xl overflow-hidden">
            <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h3 className="text-2xl font-bold mb-2">
                  Can’t find what you’re looking for?
                </h3>
                <p className="opacity-90 max-w-md">
                  Create your own event and share it with thousands of potential
                  attendees.
                </p>
              </div>
              <Button className="bg-white text-[#FF6B6B] hover:bg-white/90 px-8 py-6 text-lg font-bold rounded-xl">
                Create an Event
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
``;
