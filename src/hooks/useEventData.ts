
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Event, DatabaseEvent, transformDatabaseEvents } from './event-types';
import { filterEvents, EventFilters } from '@/utils/eventFilters';

// Main hook for fetching event data
export const useEventData = (filters: EventFilters = {
  cause: '',
  location: '',
  organization: ''
}) => {
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

// Hook for fetching events for a specific cause
export const useCauseEvents = (cause: string) => {
  const { data, isLoading, error } = useEventData({ 
    cause, 
    location: '', 
    organization: '' 
  });

  return {
    events: data || [],
    isLoading,
    error
  };
};

// Hook for fetching events for a specific organization
export const useOrganizationEvents = (organizationId: string) => {
  const { data, isLoading, error } = useEventData();
  
  const filteredEvents = data?.filter(event => 
    event.organizationId === organizationId
  ) || [];

  return {
    events: filteredEvents,
    isLoading,
    error
  };
};

export default useEventData;
