import { supabase } from '@/integrations/supabase/client';
import { Event, NONPROFIT_NAME_MAP, transformDatabaseEvents } from './event-types';

// Check if the events table has a cause_area column
export async function checkCauseAreaColumn(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .rpc('get_columns_for_table', { table_name: 'events' });
      
    if (error) {
      console.error("Error checking for columns:", error);
      return false;
    } else if (data && Array.isArray(data)) {
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

// Improved function to fetch nonprofit or user data for an event
export async function fetchNonprofitData(nonprofitId: string): Promise<{name: string, profileImage: string}> {
  try {
    // First try to get from nonprofits table
    const { data: nonprofit } = await supabase
      .from('nonprofits')
      .select('organization_name, profile_image_url')
      .eq('id', nonprofitId)
      .single();
    
    if (nonprofit) {
      return {
        name: nonprofit.organization_name,
        profileImage: nonprofit.profile_image_url || generateFallbackImageUrl(nonprofitId)
      };
    }
    
    // Then try to get from profiles table and user metadata
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('id', nonprofitId)
      .single();
      
    if (profile) {
      // Get the user's metadata to check for organization_name
      const { data: user } = await supabase.auth.admin.getUserById(nonprofitId);
      
      const organizationName = user?.user?.user_metadata?.organization_name || profile.full_name || 'User';
      
      return {
        name: organizationName,
        profileImage: profile.avatar_url || generateFallbackImageUrl(nonprofitId)
      };
    }
  } catch (error) {
    console.error("Error fetching organization/user data:", error);
  }
  
  // Fallback case
  return {
    name: NONPROFIT_NAME_MAP[nonprofitId] || 'User',
    profileImage: generateFallbackImageUrl(nonprofitId)
  };
}

// Helper function to generate a deterministic fallback image URL
function generateFallbackImageUrl(id: string): string {
  const idNumber = parseInt(id.slice(-6).replace(/\D/g, ''), 16) % 1000 || 42;
  return `https://source.unsplash.com/random/300x300?profile=${idNumber}`;
}

// Transform event data from API format to application format - Now an async function
export async function transformEventData(
  event: any, 
  organizationId: string, 
  causeArea: string, 
  rating: number
): Promise<Event> {
  const { name: organizationName, profileImage } = await fetchNonprofitData(organizationId);
  
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
    profileImage: profileImage
  };
}
