
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

// Validate image URL format
function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  
  try {
    // Check if it's a URL with http or https protocol, or a Supabase storage URL
    return url.startsWith('http://') || 
           url.startsWith('https://') || 
           url.includes('supabase.co/storage/v1/object/public/');
  } catch (e) {
    return false;
  }
}

// Check if a profile image exists in storage
async function checkProfileImageInStorage(nonprofitId: string): Promise<string | null> {
  try {
    // Common image extensions to check
    const extensions = ['jpg', 'jpeg', 'png', 'gif'];
    
    for (const ext of extensions) {
      const { data, error } = await supabase
        .storage
        .from('profile-images')
        .getPublicUrl(`${nonprofitId}.${ext}`);
        
      if (!error && data && data.publicUrl) {
        console.log(`Found profile image in storage for ${nonprofitId}: ${data.publicUrl}`);
        return data.publicUrl;
      }
    }
    
    console.log(`No profile image found in storage for ${nonprofitId}`);
    return null;
  } catch (error) {
    console.error("Error checking profile image in storage:", error);
    return null;
  }
}

// Improved function to fetch nonprofit or user data for an event
export async function fetchNonprofitData(nonprofitId: string): Promise<{name: string, profileImage: string}> {
  try {
    console.log(`Fetching data for nonprofit/user ID: ${nonprofitId}`);
    
    // First try to get from nonprofits table
    const { data: nonprofit, error: nonprofitError } = await supabase
      .from('nonprofits')
      .select('organization_name, profile_image_url')
      .eq('id', nonprofitId)
      .single();
    
    if (nonprofitError) {
      console.log(`No nonprofit found with ID ${nonprofitId}, error:`, nonprofitError);
    }
    
    if (nonprofit) {
      console.log(`Found nonprofit: ${nonprofit.organization_name}, image: ${nonprofit.profile_image_url}`);
      
      // Check if the profile image URL is valid
      if (isValidImageUrl(nonprofit.profile_image_url)) {
        return {
          name: nonprofit.organization_name,
          profileImage: nonprofit.profile_image_url
        };
      } else {
        // Try to get the image from storage
        const storageUrl = await checkProfileImageInStorage(nonprofitId);
        if (storageUrl) {
          return {
            name: nonprofit.organization_name,
            profileImage: storageUrl
          };
        }
        
        console.log(`Found nonprofit ${nonprofit.organization_name}, but image URL is invalid or missing`);
        return {
          name: nonprofit.organization_name,
          profileImage: generateFallbackImageUrl(nonprofitId)
        };
      }
    }
    
    // Then try to get from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('id', nonprofitId)
      .single();
      
    if (profileError) {
      console.log(`No profile found with ID ${nonprofitId}, error:`, profileError);
    }
      
    if (profile) {
      // Try to get user metadata through a public function call instead of admin API
      const { data: userMetadata } = await supabase.auth.getUser();
      
      // Only use current user's metadata if the IDs match
      const isCurrentUser = userMetadata?.user?.id === nonprofitId;
      const organizationName = isCurrentUser && userMetadata?.user?.user_metadata?.organization_name
        ? userMetadata.user.user_metadata.organization_name
        : (profile.full_name || 'User');
      
      console.log(`Found profile for ${organizationName}, avatar: ${profile.avatar_url}`);
      
      // Check if avatar_url is valid
      if (profile.avatar_url && isValidImageUrl(profile.avatar_url)) {
        return {
          name: organizationName,
          profileImage: profile.avatar_url
        };
      } else {
        // Try to get the image from storage
        const storageUrl = await checkProfileImageInStorage(nonprofitId);
        if (storageUrl) {
          return {
            name: organizationName,
            profileImage: storageUrl
          };
        }
      }
    }
    
    // Try to get the image directly from storage as a last resort
    const storageUrl = await checkProfileImageInStorage(nonprofitId);
    if (storageUrl) {
      return {
        name: NONPROFIT_NAME_MAP[nonprofitId] || 'User',
        profileImage: storageUrl
      };
    }
  } catch (error) {
    console.error("Error fetching organization/user data:", error);
  }
  
  // Fallback case - use hardcoded map or generate consistent placeholder
  console.log(`Using fallback for ${nonprofitId}`);
  return {
    name: NONPROFIT_NAME_MAP[nonprofitId] || 'User',
    profileImage: generateFallbackImageUrl(nonprofitId)
  };
}

// Helper function to generate a deterministic fallback image URL
function generateFallbackImageUrl(id: string): string {
  // Extract a numeric value from the ID for deterministic image selection
  // First try to get last 6 characters and remove non-digits, then convert to number
  const idValue = id.slice(-6).replace(/\D/g, '');
  // If we got digits, use them modulo 100, otherwise use 42 as fallback
  const idNumber = idValue ? (parseInt(idValue, 10) % 100) : 42;
  // Use a consistent URL format with the numeric value to get different but consistent images
  return `https://source.unsplash.com/random/300x300?profile=${idNumber}`;
}

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
