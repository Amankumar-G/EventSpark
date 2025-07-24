import { useEffect, useState, useCallback } from 'react'
import { EventWithDetails, EventsApiResponse } from '@/features/events/types/event'

export function useFetchOrganizerEvents(organizerId?: string) {
  const [events, setEvents] = useState<EventWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [totalAmount, setTotalAmount] = useState(0)
  const fetchEvents = useCallback(async () => {
    if (!organizerId) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/events`)
      const data: EventsApiResponse = await response.json()
      if (data.success) {
        console.log(data)
        setEvents(data.events)
        setTotalAmount(data.totalAmount)
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

  return { events, totalAmount,isLoading, error, refetch: fetchEvents }
}
