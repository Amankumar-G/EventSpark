'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin } from 'lucide-react';
import Image from 'next/image';

// Assuming you have this type defined in '@/types/globals'
import { EventWithDetails } from '@/types/globals';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';

// Animation variants for cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover: { scale: 1.02, boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.08)' },
};

export default function EventListingScreen() {
  const [events, setEvents] = useState<EventWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Use the provided API response structure directly for demonstration
        // In a real app, you'd fetch from an actual endpoint:
        const response = await axios.get('/api/events');
        setEvents(response.data.events);

      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getCheapestTicketPrice = (ticketTypes: EventWithDetails['ticketTypes']) => {
    if (!ticketTypes || ticketTypes.length === 0) return 'Free';
    const activeTickets = ticketTypes.filter(t => t.isActive);
    if (activeTickets.length === 0) return 'N/A'; // No active tickets
    const minPrice = Math.min(...activeTickets.map(t => t.price));
    return minPrice === 0 ? 'Free' : `$${minPrice.toLocaleString()}`;
  };

  if (error) {
    return <div className="text-red-500 p-4 text-center">Error loading events: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-white min-h-screen">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants} // Use general variant for initial animation of the container
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-extrabold text-[#333333] tracking-tight sm:text-5xl">
          Discover Your Next Event
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore a variety of events, from tech conferences to community gatherings.
        </p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-[350px] w-full rounded-xl" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center text-muted-foreground py-20">
          No events available at the moment. Please check back later!
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {events.map(event => (
            <motion.div key={typeof event._id === 'string' ? event._id : event._id.toString()} variants={cardVariants} whileHover="hover">
              <Link href={`/events/${event.slug}`} className="block h-full">
                <Card className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col border-gray-200">
                  <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
                    {event.bannerUrl ? (
                      <Image
                        src={event.bannerUrl}
                        alt={event.title}
                        layout="fill"
                        objectFit="cover"
                        className="object-center"
                      />
                    ) : (
                      <div className="text-gray-400 text-sm">No Image</div>
                    )}
                  </div>
                  <CardContent className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-[#333333] leading-tight mb-2 truncate">
                        {event.title}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground mb-1">
                        <CalendarDays className="h-4 w-4 mr-2 text-[#468FAF]" />
                        <span>
                          {new Date(event.startDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <MapPin className="h-4 w-4 mr-2 text-[#FF6B6B]" />
                        <span>{event.location.address}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <Badge variant="secondary" className="text-xs">
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </Badge>
                      <span className="text-lg font-bold text-[#333333]">
                        {getCheapestTicketPrice(event.ticketTypes)}
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
  );
}