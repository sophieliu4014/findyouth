
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Event } from './event-types';
import { filterEvents } from '@/utils/eventFilters';

export const useOrganizationEvents = (organizationId: string) => {
  return useQuery({
    queryKey: ['events', 'organization', organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('organizationId', organizationId);

      if (error) {
        console.error('Error fetching organization events:', error);
        throw new Error(error.message);
      }

      // Apply any additional filtering if needed
      return filterEvents(data as Event[]);
    },
  });
};
