
import { useState } from 'react';
import { Event } from '@/hooks/types/event-types';

// Type for filters
export interface EventFilters {
  cause: string;
  location: string;
  organization: string;
  searchKeyword?: string;
}

// Apply all filters to events list
export const filterEvents = (events: Event[], filters: EventFilters = {
  cause: '',
  location: '',
  organization: ''
}) => {
  let results = [...events];
  
  // Apply keyword search across all relevant fields
  if (filters.searchKeyword) {
    const lowerKeyword = filters.searchKeyword.toLowerCase();
    results = results.filter(event => 
      event.title.toLowerCase().includes(lowerKeyword) || 
      (event.description || '').toLowerCase().includes(lowerKeyword) || 
      (event.location || '').toLowerCase().includes(lowerKeyword) || 
      event.organization.toLowerCase().includes(lowerKeyword) ||
      event.causeArea.toLowerCase().includes(lowerKeyword)
    );
  }
  
  // Apply cause area filter - now checking if the filter cause is included in any of the event's cause areas
  if (filters.cause) {
    results = results.filter(event => {
      // Split the event's cause areas by comma and trim whitespace
      const eventCauseAreas = event.causeArea.split(',').map(cause => cause.trim());
      // Check if the filter cause matches any of the event's cause areas
      return eventCauseAreas.includes(filters.cause);
    });
  }
  
  // Fix for location filter - case insensitive partial matching
  if (filters.location) {
    const lowerLocation = filters.location.toLowerCase();
    results = results.filter(event => 
      event.location && event.location.toLowerCase().includes(lowerLocation)
    );
  }
  
  if (filters.organization) {
    results = results.filter(event => event.organization === filters.organization);
  }
  
  return results;
};
