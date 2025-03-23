
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Event, DatabaseEvent, transformDatabaseEvents } from './event-types';
import { filterEvents, EventFilters } from '@/utils/eventFilters';

// Main hook for fetching event data
export const useEventData = (filters: EventFilters = {
  cause: '',
  location: '',
  organization: '',
  searchKeyword: ''
}) => {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false }); // Order by creation date, newest first

      if (error) {
        console.error('Error fetching events:', error);
        throw new Error(error.message);
      }

      // Transform database events to UI events and await the Promise
      const transformedEvents = await transformDatabaseEvents(data as DatabaseEvent[]);
      
      // Apply filters to the returned data
      return filterEvents(transformedEvents, filters);
    },
  });
};

export default useEventData;
