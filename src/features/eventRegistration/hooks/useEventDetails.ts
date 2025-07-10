import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface EventDetails {
  eventName: string;
  eventId: string;
  eventSlug: string;
  jsonStringConfig: string;
  ticketTypes: any[];
  loading: boolean;
}

export const useEventDetails = (): EventDetails => {
  const params = useParams();
  const id = params.id;
  const [state, setState] = useState<EventDetails>({
    eventName: "",
    eventId: "",
    eventSlug: "",
    jsonStringConfig: "",
    ticketTypes: [],
    loading: true,
  });

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        const data = await res.json();
        const event = data.event;

        // Filter only active tickets
        const activeTickets = (event.ticketTypes || []).filter(
          (ticket: any) => ticket.isActive
        );

        let finalConfig = event?.formConfig || "";
        if (finalConfig && typeof finalConfig === "string") {
          finalConfig = JSON.stringify(JSON.parse(finalConfig), null, 4);
        }

        setState({
          eventName: event.title,
          eventId: event._id,
          eventSlug: event.slug,
          jsonStringConfig: finalConfig,
          ticketTypes: activeTickets,
          loading: false,
        });
      } catch (err) {
        console.error("Failed to fetch event:", err);
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    fetchEvent();
  }, [id]);

  return state;
};