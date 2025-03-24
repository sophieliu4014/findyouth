
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Event, DatabaseEvent } from './types/event-types';
import { transformDatabaseEvents } from './utils/event-transform-utils';

// Hook for fetching events by cause
const useCauseEvents = (causeSlug: string) => {
  const decodedCause = decodeURIComponent(causeSlug);

  return useQuery({
    queryKey: ['cause-events', decodedCause],
    queryFn: async (): Promise<Event[]> => {
      if (!decodedCause) {
        return [];
      }

      // Fetch events with the specified cause
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .ilike('cause_area', `%${decodedCause}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cause events:', error);
        throw new Error(error.message);
      }

      // Add the missing properties for DatabaseEvent
      const databaseEvents = data.map(item => ({
        ...item,
        nonprofit_name: item.nonprofit_id || 'Unknown Organization',
        is_virtual: item.is_virtual || false
      })) as DatabaseEvent[];

      // Transform the database events to UI events
      return transformDatabaseEvents(databaseEvents);
    },
    enabled: !!decodedCause,
  });
};

export default useCauseEvents;
