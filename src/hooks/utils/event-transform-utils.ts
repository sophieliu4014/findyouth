
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
    profileImage: orgData.profileImage,
    registrationLink: event.signup_form_url
  };
}

// Transform database events to UI events with improved organization data fetching
export const transformDatabaseEvents = async (dbEvents: DatabaseEvent[]): Promise<Event[]> => {
  if (!dbEvents || dbEvents.length === 0) {
    console.log('No events to transform');
    return [];
  }
  
  console.log(`Transforming ${dbEvents.length} events`);
  console.log('Sample event data:', dbEvents[0]);
  
  // Process events in batches to optimize performance
  const batchSize = 5;
  const results: Event[] = [];
  
  // Get unique nonprofit IDs to fetch data once for each organization
  const nonprofitIds = [...new Set(dbEvents.map(event => event.nonprofit_id))];
  
  // Pre-fetch nonprofit data for all unique organizations
  const nonprofitDataMap = new Map<string, {name: string, profileImage: string}>();
  
  await Promise.all(
    nonprofitIds.map(async (id) => {
      try {
        const data = await fetchNonprofitData(id);
        nonprofitDataMap.set(id, data);
      } catch (error) {
        console.error(`Error pre-fetching data for nonprofit ${id}:`, error);
        nonprofitDataMap.set(id, {
          name: NONPROFIT_NAME_MAP[id] || 'Organization',
          profileImage: generateFallbackImageUrl(id)
        });
      }
    })
  );
  
  // Process events in batches using pre-fetched org data
  for (let i = 0; i < dbEvents.length; i += batchSize) {
    const batch = dbEvents.slice(i, i + batchSize);
    
    const batchResults = await Promise.all(batch.map(async event => {
      try {
        // Get org data from our pre-fetched map
        const orgData = nonprofitDataMap.get(event.nonprofit_id) || {
          name: NONPROFIT_NAME_MAP[event.nonprofit_id] || 'Organization',
          profileImage: generateFallbackImageUrl(event.nonprofit_id)
        };
        
        const eventObj = {
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
          profileImage: orgData.profileImage,
          registrationLink: event.signup_form_url || undefined
        };
        
        console.log(`Event ${event.id} registration link:`, event.signup_form_url);
        return eventObj;
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
          profileImage: generateFallbackImageUrl(event.nonprofit_id),
          registrationLink: event.signup_form_url || undefined
        };
      }
    }));
    
    results.push(...batchResults);
  }
  
  return results;
};
