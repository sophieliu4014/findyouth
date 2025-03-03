
import { Event } from '@/hooks/useEventData';

// Type for filters
export interface EventFilters {
  cause: string;
  location: string;
  organization: string;
}

// Apply all filters to events list
export const filterEvents = (
  events: Event[],
  filters: EventFilters,
  searchKeyword: string
): Event[] => {
  let results = [...events];
  
  // Apply keyword search
  if (searchKeyword) {
    const lowerKeyword = searchKeyword.toLowerCase();
    results = results.filter(event => 
      event.title.toLowerCase().includes(lowerKeyword) || 
      event.organization.toLowerCase().includes(lowerKeyword) ||
      event.causeArea.toLowerCase().includes(lowerKeyword)
    );
  }
  
  // Apply category filters
  if (filters.cause) {
    results = results.filter(event => event.causeArea === filters.cause);
  }
  
  if (filters.location) {
    results = results.filter(event => event.location === filters.location);
  }
  
  if (filters.organization) {
    results = results.filter(event => event.organization === filters.organization);
  }
  
  return results;
};
