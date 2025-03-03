
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Event } from './event-types';
import { filterEvents } from '@/utils/eventFilters';

export const useCauseEvents = (causeArea: string) => {
  return useQuery({
    queryKey: ['events', 'cause', causeArea],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('causeArea', causeArea);

      if (error) {
        console.error('Error fetching events by cause:', error);
        throw new Error(error.message);
      }

      // Apply any additional filtering if needed
      return filterEvents(data as Event[]);
    },
  });
};
