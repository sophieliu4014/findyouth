
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
  
  // Collect all nonprofit IDs to fetch in one query
  const nonprofitIds = [...new Set(dbEvents.map(event => event.nonprofit_id))];
  console.log('Nonprofit IDs to fetch:', nonprofitIds);
  
  // Create a map for storing nonprofit data
  const nonprofitMap = new Map();
  
  try {
    // First try to fetch from nonprofits table
    const { data: nonprofits, error } = await supabase
      .from('nonprofits')
      .select('id, organization_name, profile_image_url')
      .in('id', nonprofitIds);
      
    if (error) {
      console.error('Error fetching nonprofits:', error);
    } else if (nonprofits && nonprofits.length > 0) {
      console.log('Fetched nonprofits data:', nonprofits);
      
      // Process nonprofit data and check for valid profile images
      for (const nonprofit of nonprofits) {
        let profileImage = nonprofit.profile_image_url;
        
        // If profile_image_url isn't valid, try to get from storage
        if (!isValidImageUrl(profileImage)) {
          const storageUrl = await getProfileImageFromStorage(nonprofit.id);
          if (storageUrl) {
            profileImage = storageUrl;
            console.log(`Using storage URL for ${nonprofit.organization_name}: ${profileImage}`);
          }
        }
        
        nonprofitMap.set(nonprofit.id, {
          name: nonprofit.organization_name,
          profileImage: profileImage
        });
      }
    } else {
      console.log('No nonprofits found in database, will check user profiles');
    }
    
    // For any IDs not found in nonprofits table, fetch from profiles
    const missingIds = nonprofitIds.filter(id => !nonprofitMap.has(id));
    
    if (missingIds.length > 0) {
      console.log('Fetching user profiles for missing IDs:', missingIds);
      
      // Fetch profiles data
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', missingIds);
        
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      } else if (profiles && profiles.length > 0) {
        console.log('Fetched user profiles:', profiles);
        
        // Get the current user's metadata to check for organization_name
        const { data: currentUser } = await supabase.auth.getUser();
        
        // For each profile, try to use current user's metadata if IDs match
        for (const profile of profiles) {
          const isCurrentUser = currentUser?.user?.id === profile.id;
          const organizationName = isCurrentUser && currentUser?.user?.user_metadata?.organization_name
            ? currentUser.user.user_metadata.organization_name
            : (profile.full_name || 'User');
          
          // Check if avatar_url is valid
          let profileImage = profile.avatar_url;
          
          if (!isValidImageUrl(profileImage)) {
            const storageUrl = await getProfileImageFromStorage(profile.id);
            if (storageUrl) {
              profileImage = storageUrl;
              console.log(`Using storage URL for ${organizationName}: ${profileImage}`);
            }
          }
          
          nonprofitMap.set(profile.id, {
            name: organizationName,
            profileImage: profileImage
          });
        }
      }
      
      // For any remaining missing IDs, try storage directly
      const stillMissingIds = missingIds.filter(id => !nonprofitMap.has(id));
      for (const id of stillMissingIds) {
        const storageUrl = await getProfileImageFromStorage(id);
        if (storageUrl) {
          nonprofitMap.set(id, {
            name: NONPROFIT_NAME_MAP[id] || 'User',
            profileImage: storageUrl
          });
          console.log(`Found image in storage for ID ${id}: ${storageUrl}`);
        }
      }
    }
  } catch (fetchError) {
    console.error('Exception while fetching organization data:', fetchError);
  }
  
  console.log('Nonprofit/Profile map has entries:', nonprofitMap.size);
  
  // Transform each event with nonprofit/user data and better fallback handling
  return await Promise.all(dbEvents.map(async event => {
    // Get organization data from our map, or use fallbacks
    const organization = nonprofitMap.get(event.nonprofit_id);
    
    // Use console.log to debug data for each event
    console.log(`Processing event ${event.id} for org/user ${event.nonprofit_id}`);
    console.log(`Organization/User data found:`, organization);
    console.log(`Event image_url:`, event.image_url);
    
    const organizationName = organization?.name || 
                          NONPROFIT_NAME_MAP[event.nonprofit_id] || 
                          'User';
                          
    // For profile image, first try the one from the map
    let profileImage = organization?.profileImage;
    
    // Log before validation
    console.log(`Raw profile image from DB for ${organizationName}:`, profileImage);
    
    // If no valid profileImage from the map, try to get from storage directly
    if (!profileImage || !isValidImageUrl(profileImage)) {
      const storageUrl = await getProfileImageFromStorage(event.nonprofit_id);
      if (storageUrl) {
        profileImage = storageUrl;
        console.log(`Using storage URL for ${organizationName}: ${profileImage}`);
      } else {
        // If still no valid profileImage, use fallback
        profileImage = generateFallbackImageUrl(event.nonprofit_id);
        console.log(`Using fallback profile image for ${organizationName}:`, profileImage);
      }
    } else {
      console.log(`Using valid profile image for ${organizationName}:`, profileImage);
    }
    
    return {
      id: event.id,
      title: event.title,
      organization: organizationName,
      organizationId: event.nonprofit_id,
      date: event.date,
      location: event.location,
      causeArea: event.cause_area || 'Environment',
      rating: 4, // Default value
      imageUrl: event.image_url || undefined,
      description: event.description,
      createdAt: event.created_at || undefined,
      profileImage: profileImage
    };
  }));
};
