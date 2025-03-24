
import { supabase } from '@/integrations/supabase/client';
import { DatabaseEvent, Event, NONPROFIT_NAME_MAP } from '../types/event-types';
import { isValidImageUrl, getProfileImageFromStorage, generateFallbackImageUrl } from './image-utils';
import { formatEventDate } from './date-utils';
import { fetchNonprofitData } from './nonprofit-utils';
import { calculateAverageRating } from './rating-utils';

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
  
  // Pre-fetch ratings for all nonprofits
  const nonprofitRatingsMap = new Map<string, number>();
  
  // Fetch all ratings at once to minimize database calls
  const { data: allReviews, error: reviewsError } = await supabase
    .from('reviews')
    .select('nonprofit_id, rating');
    
  if (reviewsError) {
    console.error('Error fetching reviews:', reviewsError);
  } else if (allReviews) {
    // Group reviews by nonprofit_id and calculate average rating for each
    const reviewsByNonprofit: Record<string, any[]> = {};
    
    allReviews.forEach(review => {
      if (review.nonprofit_id) {
        if (!reviewsByNonprofit[review.nonprofit_id]) {
          reviewsByNonprofit[review.nonprofit_id] = [];
        }
        reviewsByNonprofit[review.nonprofit_id].push(review);
      }
    });
    
    // Calculate average rating for each nonprofit using our standardized function
    // Use decimal precision (false param) to show the same ratings as on profiles
    Object.entries(reviewsByNonprofit).forEach(([nonprofitId, ratings]) => {
      console.log(`Calculating rating for ${nonprofitId} from ${ratings.length} reviews`);
      const avgRating = calculateAverageRating(ratings, false);
      console.log(`Average rating for ${nonprofitId}: ${avgRating}`);
      nonprofitRatingsMap.set(nonprofitId, avgRating);
    });
  }
  
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
        
        // Get the nonprofit rating from pre-fetched data or use default
        // Important: Use the same calculation method as in profile
        const nonprofitRating = nonprofitRatingsMap.get(event.nonprofit_id) || 4;
        console.log(`Using rating ${nonprofitRating} for event ${event.id} by nonprofit ${event.nonprofit_id}`);
        
        const eventObj = {
          id: event.id,
          title: event.title,
          organization: orgData.name,
          organizationId: event.nonprofit_id,
          date: event.date,
          location: event.location,
          causeArea: event.cause_area || 'Environment',
          rating: nonprofitRating, // Use the nonprofit's actual rating with consistent calculation
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
          rating: nonprofitRatingsMap.get(event.nonprofit_id) || 4, // Use pre-fetched rating or default
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
