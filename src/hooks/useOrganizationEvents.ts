
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Event, DatabaseEvent, transformDatabaseEvents } from './event-types';

// Hook for fetching events from a specific organization
const useOrganizationEvents = (organizationId: string) => {
  return useQuery({
    queryKey: ['organizationEvents', organizationId],
    queryFn: async () => {
      if (!organizationId) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('nonprofit_id', organizationId);

      if (error) {
        console.error('Error fetching organization events:', error);
        throw new Error(error.message);
      }

      // Transform database events to UI events and await the Promise
      return await transformDatabaseEvents(data as DatabaseEvent[]);
    },
    enabled: !!organizationId,
  });
};

export default useOrganizationEvents;
