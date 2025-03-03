
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Event } from './event-types';
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

      // Apply filters to the returned data
      return filterEvents(data as Event[], filters);
    },
  });
};

export default useEventData;
