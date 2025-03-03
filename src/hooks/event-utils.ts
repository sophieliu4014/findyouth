
import { supabase } from '@/integrations/supabase/client';
import { Event, NONPROFIT_NAME_MAP } from './event-types';

// Check if the events table has a cause_area column
export async function checkCauseAreaColumn(): Promise<boolean> {
  try {
    // Using updated function that returns column_name and data_type
    const { data, error } = await supabase
      .rpc('get_columns_for_table', { table_name: 'events' });
      
    if (error) {
      console.error("Error checking for columns:", error);
      return false;
    } else if (data && Array.isArray(data)) {
      // Look for cause_area column in the returned data
      const hasCauseArea = data.some((col: { column_name: string, data_type: string }) => 
        col.column_name === 'cause_area'
      );
      console.log("Column detection data:", data);
      console.log("Events table has cause_area column:", hasCauseArea);
      return hasCauseArea;
    }
  } catch (err) {
    console.error("Error checking for cause_area column:", err);
  }
  
  return false;
}

// Format date for display
export function formatEventDate(dateString: string): string {
  const eventDate = new Date(dateString);
  return eventDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

// Calculate average rating from reviews
export function calculateAverageRating(reviewsData: any[] | null): number {
  const defaultRating = 4;
  
  if (!reviewsData || reviewsData.length === 0) {
    return defaultRating;
  }
  
  const sum = reviewsData.reduce((acc, review) => acc + review.rating, 0);
  return Math.round(sum / reviewsData.length);
}

// Transform event data from API format to application format
export function transformEventData(
  event: any, 
  organizationId: string, 
  causeArea: string, 
  rating: number
): Event {
  const organizationName = NONPROFIT_NAME_MAP[organizationId] || 'Unknown Organization';
  
  // Format date
  const formattedDate = formatEventDate(event.date);

  return {
    id: event.id,
    title: event.title,
    organization: organizationName,
    organizationId: organizationId,
    date: formattedDate,
    location: event.location,
    causeArea: causeArea,
    rating: rating,
    imageUrl: event.image_url,
    profileImage: `https://images.unsplash.com/photo-${1550000000000 + parseInt(organizationId.slice(-4), 16) % 1000000}`
  };
}
