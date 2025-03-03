
import { useState, useEffect } from 'react';
import { Event } from './event-types';
import { useEventData } from './useEventData';

// Helper function to fetch events by cause area
export const useCauseEvents = (causeArea: string) => {
  const { events: allEvents, isLoading } = useEventData();
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (!isLoading && causeArea) {
      const filtered = allEvents.filter(event => 
        event.causeArea.toLowerCase() === causeArea.toLowerCase()
      );
      setFilteredEvents(filtered);
    }
  }, [allEvents, causeArea, isLoading]);

  return { events: filteredEvents, isLoading };
};
