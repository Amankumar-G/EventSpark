'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, MapPin, Search, Tag, XCircle, DollarSign, Filter, ChevronDown, Clock } from 'lucide-react';
import { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'; // For advanced filtering
import { cn } from '@/lib/utils'; // Assuming you have a utility for class names
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { EventWithDetails } from '@/features/events/types/event';

// --- Framer Motion Variants ---
const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
   transition: {
      duration: 0.6,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1},
  transition: { duration: 0.5, ease: "easeOut" } ,
  hover: { scale: 1.03, boxShadow: '0px 15px 40px rgba(0, 0, 0, 0.15)' },
};

const filterPanelVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0},
   transition: { duration: 0.5, ease: "easeOut" } 
};

const heroVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0},
  transition: { duration: 0.7, ease: "easeOut" } 
};

// --- Helper Functions ---
const getCheapestTicketPrice = (ticketTypes: EventWithDetails['ticketTypes']) => {
  if (!ticketTypes || ticketTypes.length === 0) return 'Free';
  const activeTickets = ticketTypes.filter(t => t.isActive);
  if (activeTickets.length === 0) return 'N/A';
  const minPrice = Math.min(...activeTickets.map(t => t.price));
  return minPrice === 0 ? 'Free' : `$${minPrice.toLocaleString()}`;
};

// Helper to determine event status based on current date
const getEventStatus = (startDate: string | Date, endDate: string | Date, eventStatus: EventWithDetails['status']): EventWithDetails['status'] => {
  if (eventStatus === 'cancelled') return 'cancelled';
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) {
    return 'active';
  } else if (now >= start && now <= end) {
    return 'active'; // Or 'live' if you have that status
  } else {
    return 'active';
  }
};

export default function EventListingScreen() {
  const [allEvents, setAllEvents] = useState<EventWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const [openCategoryFilter, setOpenCategoryFilter] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/events');
        const fetchedEvents: EventWithDetails[] = response.data.events.map((event: any) => ({
          ...event,
          status: getEventStatus(event.startDate, event.endDate, event.status), // Dynamically determine status
        }));
        setAllEvents(fetchedEvents);

        // Extract unique categories
        const categories = Array.from(new Set(fetchedEvents.map(event => event.category)))
          .filter((c): c is string => typeof c === 'string')
          .sort();
        if (typeof categories !== 'undefined') {
            setUniqueCategories(categories);
        } 

      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    let currentEvents = [...allEvents];

    // Filter by search term
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      currentEvents = currentEvents.filter(event =>
        event.title.toLowerCase().includes(lowercasedSearchTerm) ||
        event.description.toLowerCase().includes(lowercasedSearchTerm) ||
        event.location.address.toLowerCase().includes(lowercasedSearchTerm) ||
        (event.category && event.category.toLowerCase().includes(lowercasedSearchTerm)) ||
        event.organizer.name?.toLowerCase().includes(lowercasedSearchTerm)
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      currentEvents = currentEvents.filter(event => event.category === selectedCategory);
    }

    // Filter by date
    if (selectedDate) {
      currentEvents = currentEvents.filter(event => {
        const eventDate = new Date(event.startDate);
        return eventDate.toDateString() === selectedDate.toDateString();
      });
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      currentEvents = currentEvents.filter(event => event.status === selectedStatus);
    }

    return currentEvents;
  }, [allEvents, searchTerm, selectedCategory, selectedDate, selectedStatus]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedDate(undefined);
    setSelectedStatus('upcoming'); // Default to upcoming
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  if (error) {
    return <div className="text-red-600 p-8 text-center text-xl font-semibold">Error loading events: {error.message}. Please try refreshing the page.</div>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="bg-gradient-to-br from-gray-50 to-white min-h-screen py-12"
    >
      {/* Hero Section */}
      <motion.div variants={heroVariants} className="text-center mb-16 px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
          Unleash Your Next Experience
        </h1>
        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
          Explore, discover, and join a vibrant community of events. Your next adventure awaits!
        </p>
      </motion.div>

      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter / Sidebar */}
        <motion.aside variants={filterPanelVariants} className="lg:col-span-1 p-6 bg-white rounded-xl shadow-lg border border-gray-100 h-fit sticky top-28">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Filter className="h-6 w-6 mr-3 text-[#f97316]" /> Filters
          </h2>

          <div className="space-y-6">
            {/* Search Input */}
            <div>
              <Label htmlFor="search" className="mb-2 block text-md font-medium text-gray-700">Search Events</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Search by title, location..."
                  className="pl-10 pr-4 py-2 rounded-lg border focus-visible:ring-offset-0 focus-visible:ring-[#f97316]/50"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                    onClick={() => setSearchTerm('')}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <Separator />

            {/* Category Filter */}
            <div>
              <Label className="mb-2 block text-md font-medium text-gray-700">Category</Label>
              <Popover open={openCategoryFilter} onOpenChange={setOpenCategoryFilter}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCategoryFilter}
                    className="w-full justify-between px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {selectedCategory
                      ? uniqueCategories.find((category) => category === selectedCategory) || "Select category..."
                      : "Select category..."}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                  <Command>
                    <CommandInput placeholder="Search category..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all"
                          onSelect={() => {
                            setSelectedCategory(null);
                            setOpenCategoryFilter(false);
                          }}
                          className={cn("cursor-pointer", !selectedCategory && "bg-gray-100 font-semibold")}
                        >
                          All Categories
                        </CommandItem>
                        {uniqueCategories.map((category) => (
                          <CommandItem
                            key={category}
                            value={category}
                            onSelect={() => {
                              setSelectedCategory(category);
                              setOpenCategoryFilter(false);
                            }}
                            className={cn("cursor-pointer", selectedCategory === category && "bg-gray-100 font-semibold")}
                          >
                            {category}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <Separator />

            {/* Date Filter */}
            <div>
              <Label className="mb-2 block text-md font-medium text-gray-700">Filter by Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal py-2.5 rounded-lg transition-colors",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className="[&_.rdp-caption_button]:text-[#f97316] [&_.rdp-day_--rdp-day-selected]:bg-[#f97316] [&_.rdp-day_--rdp-day-selected]:text-white"
                  />
                </PopoverContent>
              </Popover>
              {selectedDate && (
                <Button
                  variant="ghost"
                  onClick={() => setSelectedDate(undefined)}
                  className="mt-2 w-full text-sm text-red-500 hover:text-red-700 flex items-center justify-center gap-1"
                >
                  <XCircle className="h-4 w-4" /> Clear Date
                </Button>
              )}
            </div>

            <Separator />

            {/* Status Filter (Radio Group) */}
            <div>
              <Label className="mb-3 block text-md font-medium text-gray-700">Event Status</Label>
              <RadioGroup value={selectedStatus} onValueChange={(value: typeof selectedStatus) => setSelectedStatus(value)} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upcoming" id="status-upcoming" className="text-[#f97316]" />
                  <Label htmlFor="status-upcoming" className="text-gray-700">Upcoming</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="past" id="status-past" className="text-[#f97316]" />
                  <Label htmlFor="status-past" className="text-gray-700">Past</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cancelled" id="status-cancelled" className="text-[#f97316]" />
                  <Label htmlFor="status-cancelled" className="text-gray-700">Cancelled</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="status-all" className="text-[#f97316]" />
                  <Label htmlFor="status-all" className="text-gray-700">All</Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            {/* Clear Filters Button */}
            <Button
              onClick={handleClearFilters}
              className="w-full bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 transition-colors py-2.5 rounded-lg shadow-sm font-semibold"
            >
              <XCircle className="h-5 w-5 mr-2" /> Clear All Filters
            </Button>
          </div>
        </motion.aside>

        {/* Event Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-[380px] w-full rounded-xl" />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center text-gray-600 py-20 px-4 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center min-h-[400px]"
            >
              <Search className="h-20 w-20 text-gray-300 mb-6" />
              <h3 className="text-2xl font-bold mb-3">No Events Found</h3>
              <p className="text-lg mb-6">Your current filters or search query did not yield any results.</p>
              <Button
                onClick={handleClearFilters}
                className="bg-[#f97316] hover:bg-[#e06b12] text-white px-6 py-3 rounded-xl shadow-md transition-all transform hover:scale-105"
              >
                Clear Filters
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }} // Quicker stagger for grid items
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
            >
              {filteredEvents.map(event => (
                <motion.div key={typeof event._id === 'string' ? event._id : event._id.toString()} variants={cardVariants} whileHover="hover">
                  <Link href={`/events/${event.slug}`} className="block h-full">
                    <Card className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col border border-gray-100 transform hover:-translate-y-1">
                      <div className="relative w-full h-52 bg-gray-100 flex items-center justify-center">
                        {event.bannerUrl ? (
                          <Image
                            src={event.bannerUrl}
                            alt={event.title}
                            layout="fill"
                            objectFit="cover"
                            className="object-center"
                            priority={false} // Adjust priority based on your page structure
                          />
                        ) : (
                          <div className="text-gray-400 text-base font-medium">No Image Available</div>
                        )}
                        <Badge
                          className={cn(
                            "absolute top-3 left-3 px-3 py-1 text-sm font-semibold rounded-full",
                            event.status === 'active' && "bg-green-500 text-white",
                            event.status === 'pending' && "bg-gray-500 text-white",
                            event.status === 'cancelled' && "bg-red-500 text-white"
                          )}
                        >
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </Badge>
                      </div>
                      <CardContent className="p-5 flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
                            {event.title}
                          </h3>
                          <Badge variant="secondary" className="mb-3 text-xs px-2 py-0.5 bg-blue-100 text-blue-800 font-medium">
                            <Tag className="h-3 w-3 mr-1" /> {event.category}
                          </Badge>
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <CalendarDays className="h-4 w-4 mr-2 text-[#468FAF]" />
                            <span>
                              {new Date(event.startDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                              {new Date(event.startDate).toDateString() !== new Date(event.endDate).toDateString() &&
                                ` - ${new Date(event.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mb-3">
                            <MapPin className="h-4 w-4 mr-2 text-[#FF6B6B]" />
                            <span className="truncate">{event.location.address}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                          <span className="text-lg font-bold text-gray-900 flex items-center">
                            <DollarSign className="h-5 w-5 mr-1 text-green-600" />
                            {getCheapestTicketPrice(event.ticketTypes)}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(event.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}