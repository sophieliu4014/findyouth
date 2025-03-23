
import { supabase } from '@/integrations/supabase/client';
import { DatabaseEvent, Event, NONPROFIT_NAME_MAP } from '../types/event-types';
import { isValidImageUrl, getProfileImageFromStorage, generateFallbackImageUrl } from './image-utils';
import { formatEventDate } from './date-utils';
import { fetchNonprofitData } from './nonprofit-utils';

// Transform event data from API format to application format
export async function transformEventData(
  event: any, 
  organizationId: string, 
  causeArea: string, 
  rating: number
): Promise<Event> {
  const orgData = await fetchNonprofitData(organizationId);
  
  const formattedDate = formatEventDate(event.date);

  return {
    id: event.id,
    title: event.title,
    organization: orgData.name,
    organizationId: organizationId,
    date: formattedDate,
    location: event.location,
    causeArea: causeArea,
    rating: rating,
    imageUrl: event.image_url,
    profileImage: orgData.profileImage
  };
}

// Transform database events to UI events with improved organization data fetching
export const transformDatabaseEvents = async (dbEvents: DatabaseEvent[]): Promise<Event[]> => {
  if (!dbEvents || dbEvents.length === 0) {
    console.log('No events to transform');
    return [];
  }
  
  console.log(`Transforming ${dbEvents.length} events`);
  
  // Process each event individually to ensure we get proper organization data
  return await Promise.all(dbEvents.map(async event => {
    try {
      const orgData = await fetchNonprofitData(event.nonprofit_id);
      
      console.log(`Processed event ${event.id} for organization ${orgData.name}`);
      
      return {
        id: event.id,
        title: event.title,
        organization: orgData.name,
        organizationId: event.nonprofit_id,
        date: event.date,
        location: event.location,
        causeArea: event.cause_area || 'Environment',
        rating: 4, // Default value
        imageUrl: event.image_url || undefined,
        description: event.description,
        createdAt: event.created_at || undefined,
        profileImage: orgData.profileImage
      };
    } catch (error) {
      console.error(`Error transforming event ${event.id}:`, error);
      
      // Return a fallback event with basic information
      return {
        id: event.id,
        title: event.title,
        organization: NONPROFIT_NAME_MAP[event.nonprofit_id] || 'Organization',
        organizationId: event.nonprofit_id,
        date: event.date,
        location: event.location,
        causeArea: event.cause_area || 'Environment',
        rating: 4,
        imageUrl: event.image_url || undefined,
        description: event.description,
        profileImage: generateFallbackImageUrl(event.nonprofit_id)
      };
    }
  }));
};
