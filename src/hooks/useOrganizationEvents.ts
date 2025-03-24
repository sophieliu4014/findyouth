
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Event, DatabaseEvent } from './types/event-types';
import { transformDatabaseEvents } from './utils/event-transform-utils';

// Hook for fetching events from a specific organization
const useOrganizationEvents = (organizationId: string) => {
  const result = useQuery({
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

      // Transform database events to UI events and await the result
      const transformedEvents = await transformDatabaseEvents(data as DatabaseEvent[]);
      console.log('Organization events fetched:', transformedEvents.length);
      return transformedEvents;
    },
    enabled: !!organizationId,
  });

  return {
    events: result.data || [],
    isLoading: result.isLoading,
    error: result.error
  };
};

export default useOrganizationEvents;
