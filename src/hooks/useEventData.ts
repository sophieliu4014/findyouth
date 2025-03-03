
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Event, DatabaseEvent, transformDatabaseEvents } from './event-types';
import { filterEvents } from '@/utils/eventFilters';

// Main hook for fetching event data
export const useEventData = (filters = {}) => {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*');

      if (error) {
        console.error('Error fetching events:', error);
        throw new Error(error.message);
      }

      // Transform database events to UI events
      const transformedEvents = transformDatabaseEvents(data as DatabaseEvent[]);
      
      // Apply filters to the returned data
      return filterEvents(transformedEvents, filters);
    },
  });
};

export default useEventData;
