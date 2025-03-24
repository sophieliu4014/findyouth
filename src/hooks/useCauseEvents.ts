
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Event, DatabaseEvent } from './types/event-types';
import { transformDatabaseEvents } from './utils/event-transform-utils';

// Hook for fetching events by cause area
const useCauseEvents = (causeArea: string) => {
  const result = useQuery({
    queryKey: ['causeEvents', causeArea],
    queryFn: async () => {
      if (!causeArea) {
        return [];
      }
      
      // Query events, sorted by creation date (newest first)
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cause events:', error);
        throw new Error(error.message);
      }

      // Transform database events to UI events
      const transformedEvents = await transformDatabaseEvents(data as DatabaseEvent[]);
      console.log('All events fetched for filtering by cause:', transformedEvents.length);
      
      // Filter by cause area - include events where the cause area contains the selected cause
      // This handles both single cause areas and comma-separated lists
      const filteredEvents = transformedEvents.filter(event => {
        if (!event.causeArea) return false;
        
        // Split the event's cause areas and check if any match the selected cause
        const eventCauses = event.causeArea.split(',').map(c => c.trim());
        return eventCauses.includes(causeArea);
      });
      
      console.log('Events after filtering by cause area:', filteredEvents.length);
      return filteredEvents;
    },
    enabled: !!causeArea,
  });

  return {
    events: result.data || [],
    isLoading: result.isLoading,
    error: result.error
  };
};

export default useCauseEvents;
