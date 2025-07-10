import { useState, useEffect } from "react";
import axios from "axios";
import { EventWithDetails } from "@/features/events/types/event";

export const useFetchEvent = (id: string) => {
  const [event, setEvent] = useState<EventWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState<boolean>(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/events/${id}`);
        setEvent(response.data.event);
        setRegistered(response.data.event.registered);
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Failed to load event details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  return { event, isLoading, error, registered };
};