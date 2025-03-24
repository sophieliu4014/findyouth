
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Event, DatabaseEvent } from './types/event-types';
import { transformDatabaseEvents } from './utils/event-transform-utils';

// Hook for fetching events by organization
const useOrganizationEvents = (organizationId: string) => {
  const query = useQuery({
    queryKey: ['organization-events', organizationId],
    queryFn: async (): Promise<Event[]> => {
      if (!organizationId) {
        return [];
      }

      // Fetch events for the specified organization
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('nonprofit_id', organizationId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching organization events:', error);
        throw new Error(error.message);
      }

      // Add the missing properties for DatabaseEvent
      const databaseEvents = data.map(item => ({
        ...item,
        nonprofit_name: item.nonprofit_name || item.nonprofit_id || 'Unknown Organization',
        is_virtual: item.is_virtual !== undefined ? item.is_virtual : false
      })) as DatabaseEvent[];

      // Transform the database events to UI events
      return transformDatabaseEvents(databaseEvents);
    },
    enabled: !!organizationId,
  });

  return {
    events: query.data || [],
    isLoading: query.isLoading,
    error: query.error
  };
};

export default useOrganizationEvents;
