
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Event, DatabaseEvent, transformDatabaseEvents } from './event-types';

// Hook for fetching events by cause area
const useCauseEvents = (causeArea: string) => {
  return useQuery({
    queryKey: ['causeEvents', causeArea],
    queryFn: async () => {
      if (!causeArea) {
        return [];
      }
      
      // This is a placeholder - in a real app, you'd query by cause area
      // For now, we'll return all events and filter client-side
      const { data, error } = await supabase
        .from('events')
        .select('*');

      if (error) {
        console.error('Error fetching cause events:', error);
        throw new Error(error.message);
      }

      const transformedEvents = transformDatabaseEvents(data as DatabaseEvent[]);
      
      // Filter by cause area (simulated)
      return transformedEvents.filter(event => event.causeArea === causeArea);
    },
    enabled: !!causeArea,
  });
};

export default useCauseEvents;
