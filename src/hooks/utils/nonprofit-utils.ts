
import { supabase } from '@/integrations/supabase/client';
import { NONPROFIT_NAME_MAP } from '../types/event-types';
import { isValidImageUrl, getProfileImageFromStorage, generateFallbackImageUrl } from './image-utils';

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
        const storageUrl = await getProfileImageFromStorage(nonprofitId);
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
        const storageUrl = await getProfileImageFromStorage(nonprofitId);
        if (storageUrl) {
          return {
            name: organizationName,
            profileImage: storageUrl
          };
        }
      }
    }
    
    // Try to get the image directly from storage as a last resort
    const storageUrl = await getProfileImageFromStorage(nonprofitId);
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
