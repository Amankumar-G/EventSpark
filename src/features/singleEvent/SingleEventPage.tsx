'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useFetchEvent } from './hooks/useFetchEvent';
import { EventDetailsCard } from './components/EventDetailsCard';
import { EventGallery } from './components/EventGallery';
import { EventLocation } from './components/EventLocation';
import { EventSidebar } from './components/EventSidebar';

const pageFadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const sectionSlideIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

export default function SingleEventPage() {
  const { id } = useParams() as { id: string };
  const searchParams = useSearchParams();
  const isSuccess = searchParams?.get('success') === 'true';
  const [showSuccess, setShowSuccess] = useState(false);

  const { event, isLoading, error, registered } = useFetchEvent(id);

  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!event) return <NotFoundState />;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageFadeIn}
      className="bg-gradient-to-b from-gray-50 to-white min-h-screen"
    >
      {showSuccess && <SuccessNotification />}

      <Header title={event.title} category={event.category ?? ''} registered={registered} />

      <main className="container mx-auto px-4 pt-16 pb-16 max-w-5xl">
        <EventHero
          title={event.title}
          bannerUrl={event.bannerUrl ?? ''}
          startDate={event.startDate}
          endDate={event.endDate}
          location={event.location}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-10">
            <EventDetailsCard description={event.description} />

            {event.speakerImages?.length > 0 && (
              <EventGallery speakerImages={event.speakerImages} />
            )}

            <EventLocation location={event.location} />
          </div>

          <div className="lg:col-span-1 space-y-8">
            <EventSidebar
              startDate={event.startDate}
              endDate={event.endDate}
              location={event.location}
              organizer={event.organizer}
             category={event.category ?? ''}
              ticketTypes={event.ticketTypes}
              registered={registered}
              eventId={id}
            />
          </div>
        </div>
      </main>

      {!registered && <FooterCTA eventId={id} />}
    </motion.div>
  );
}

const LoadingState = () => (
  <div className="container mx-auto px-4 py-8 max-w-5xl">
    <Skeleton className="h-10 w-48 mb-8" />
    <Skeleton className="w-full h-[400px] rounded-2xl mb-10" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-64 w-full" />
      </div>
      <div className="space-y-8">
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-52 w-full" />
      </div>
    </div>
  </div>
);

const ErrorState = ({ error }: { error: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
    <div className="bg-gradient-to-r from-[#FF6B6B] to-[#468FAF] p-1 w-24 h-24 rounded-full flex items-center justify-center mb-6">
      <div className="bg-white w-full h-full rounded-full flex items-center justify-center">
        <svg className="h-12 w-12 text-[#FF6B6B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong.</h2>
    <p className="text-gray-600 mb-8">{error}</p>
    <Link href="/" passHref>
      <Button>Go to Homepage</Button>
    </Link>
  </div>
);

const NotFoundState = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
    <div className="bg-gradient-to-r from-[#468FAF] to-[#FF6B6B] p-1 w-24 h-24 rounded-full flex items-center justify-center mb-6">
      <div className="bg-white w-full h-full rounded-full flex items-center justify-center">
        <svg className="h-12 w-12 text-[#468FAF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
    <p className="text-gray-600 mb-8">This event does not exist or has been removed.</p>
    <Link href="/" passHref>
      <Button>Go to Homepage</Button>
    </Link>
  </div>
);

const SuccessNotification = () => (
  <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-300 text-green-700 px-6 py-4 rounded-xl shadow-md z-50">
    <div className="flex items-center gap-2">
      <CheckCircle className="w-5 h-5" />
      <span>🎉 Registration successful!</span>
    </div>
  </div>
);

const Header = ({
  title,
  category,
  registered,
}: {
  title: string;
  category: string;
  registered: boolean;
}) => (
  <motion.header
    variants={sectionSlideIn}
    className="z-50 bg-white/90 backdrop-blur-sm py-4 px-4 sm:px-6 shadow-sm"
  >
    <div className="container mx-auto max-w-5xl flex items-center justify-between">
      <Link href="/events" passHref>
        <Button variant="ghost" className="flex items-center gap-2 text-gray-700">
          <ArrowLeft className="h-5 w-5" />
          <span className="hidden sm:inline">Back to Events</span>
        </Button>
      </Link>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate max-w-[calc(100%-160px)]">
        {title}
      </h1>
      {registered ? (
        <Badge className="bg-green-100 text-green-700 border border-green-400 ml-4">You're Registered</Badge>
      ) : (
        <Badge variant="outline" className="border-[#468FAF] text-[#468FAF]">{category || 'Event'}</Badge>
      )}
    </div>
  </motion.header>
);

const EventHero = ({
  title,
  bannerUrl,
  startDate,
  endDate,
  location,
}: {
  title: string;
  bannerUrl: string;
  startDate: string | Date;
  endDate: string | Date;
  location: { address: string };
}) => {
  const formatDateRange = (start: string | Date, end: string | Date) => {
    const s = new Date(start).toLocaleDateString();
    const e = new Date(end).toLocaleDateString();
    return s === e ? s : `${s} - ${e}`;
  };

  return (
    <motion.div
      variants={sectionSlideIn}
      className="mb-10 relative w-full h-[30vh] md:h-[40vh] lg:h-[50vh] rounded-2xl overflow-hidden shadow-xl border-8 border-white"
    >
      {bannerUrl ? (
        <Image src={bannerUrl} alt={title} fill className="object-cover object-center" />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gradient-to-r from-[#468FAF] to-[#FF6B6B] text-white text-xl">
          {title}
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 pt-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">{title}</h1>
        <div className="flex items-center gap-3 mt-2 text-white/90 text-sm">
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-1" />
            {formatDateRange(startDate, endDate)}
          </div>
          <div className="w-1 h-1 bg-white/50 rounded-full"></div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {location?.address}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FooterCTA = ({ eventId }: { eventId: string }) => (
  <motion.section
    variants={sectionSlideIn}
    className="bg-gradient-to-r from-[#468FAF] to-[#FF6B6B] py-16"
  >
    <div className="container mx-auto max-w-5xl px-4 text-center">
      <h2 className="text-3xl font-bold text-white mb-4">Ready to Join This Event?</h2>
      <p className="text-white/90 max-w-2xl mx-auto mb-8">
        Register now to secure your spot and be part of this amazing experience.
      </p>
      <motion.div whileHover={{ scale: 1.03 }}>
        <Button
          type="button"
          variant="outline"
          className="bg-white text-[#FF6B6B] hover:bg-white/90 px-8 py-6 text-lg font-bold rounded-xl"
          size="lg"
          onClick={() => window.open(`/events/${eventId}/register`, '_blank')}
        >
          Register Now
        </Button>
      </motion.div>
    </div>
  </motion.section>
);
