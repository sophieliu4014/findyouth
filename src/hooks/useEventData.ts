
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Event, DatabaseEvent } from './types/event-types';
import { transformDatabaseEvents } from './utils/event-transform-utils';
import { filterEvents, EventFilters } from '@/utils/eventFilters';
import { isEventPassed } from '@/utils/dateUtils';

// Main hook for fetching event data
const useEventData = (
  filters: EventFilters = {
    cause: '',
    location: '',
    organization: '',
    searchKeyword: ''
  }, 
  showPassedEvents: boolean = false
) => {
  return useQuery({
    queryKey: ['events', filters, showPassedEvents],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false }); // Order by creation date, newest first

      if (error) {
        console.error('Error fetching events:', error);
        throw new Error(error.message);
      }

      // Transform database events to UI events
      const transformedEvents = await transformDatabaseEvents(data as DatabaseEvent[]);
      console.log('Events loaded before filtering:', transformedEvents.length);
      
      // Filter out passed events if showPassedEvents is false
      let filteredByDate = transformedEvents;
      if (!showPassedEvents) {
        filteredByDate = transformedEvents.filter(event => !isEventPassed(event.date, event.endDate));
        console.log('Events after date filtering:', filteredByDate.length);
      }
      
      // Apply other filters to the returned data
      const filteredEvents = filterEvents(filteredByDate, filters);
      console.log('Events after all filtering:', filteredEvents.length);
      return filteredEvents;
    },
  });
};

export default useEventData;
