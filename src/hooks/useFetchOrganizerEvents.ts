import { useEffect, useState, useCallback } from 'react'
import { EventWithDetails, EventsApiResponse } from '@/types/globals'

export function useFetchOrganizerEvents(organizerId?: string) {
  const [events, setEvents] = useState<EventWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchEvents = useCallback(async () => {
    if (!organizerId) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/events`)
      const data: EventsApiResponse = await response.json()
      if (data.success) {
        setEvents(data.events)
        setError(null)
      } else {
        throw new Error('Failed to fetch events')
      }
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }, [organizerId])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  return { events, isLoading, error, refetch: fetchEvents }
}
