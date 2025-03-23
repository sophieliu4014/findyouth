
import { supabase } from '@/integrations/supabase/client';

// Define the event type that maps to our database
export interface DatabaseEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  end_date?: string | null;
  nonprofit_id: string;
  image_url?: string | null;
  created_at?: string | null;
  cause_area?: string | null;
}

// Define the event type with additional fields for the UI
export interface Event {
  id: string;
  title: string;
  organization: string;
  organizationId: string;
  date: string;
  location: string;
  causeArea: string;
  rating: number;
  imageUrl?: string;
  profileImage?: string;
  description?: string;
  createdAt?: string;
}

// Map for hardcoded nonprofit names (for development only)
export const NONPROFIT_NAME_MAP: Record<string, string> = {
  '550e8400-e29b-41d4-a716-446655440000': 'Vancouver Youth Coalition',
  '550e8400-e29b-41d4-a716-446655440001': 'Burnaby Environmental Network',
  '550e8400-e29b-41d4-a716-446655440002': 'Richmond Youth Arts Collective',
  '550e8400-e29b-41d4-a716-446655440003': 'Surrey Community Food Bank',
  '550e8400-e29b-41d4-a716-446655440004': 'North Shore Animal Rescue',
};

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

// Check if a profile image exists in storage and get its URL
async function getProfileImageFromStorage(nonprofitId: string): Promise<string | null> {
  try {
    // Common image extensions to check
    const extensions = ['jpg', 'jpeg', 'png', 'gif'];
    
    for (const ext of extensions) {
      const { data } = supabase
        .storage
        .from('profile-images')
        .getPublicUrl(`${nonprofitId}.${ext}`);
        
      if (data && data.publicUrl) {
        // Try to fetch the URL to verify it exists
        try {
          const response = await fetch(data.publicUrl, { method: 'HEAD' });
          if (response.ok) {
            console.log(`Found profile image in storage for ${nonprofitId}: ${data.publicUrl}`);
            return data.publicUrl;
          }
        } catch (e) {
          console.log(`URL exists but image not accessible: ${data.publicUrl}`);
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error getting profile image from storage:", error);
    return null;
  }
}

// Generate a deterministic fallback image URL
function generateFallbackImageUrl(id: string): string {
  const idValue = id.slice(-6).replace(/\D/g, '');
  const idNumber = idValue ? (parseInt(idValue, 10) % 100) : 42;
  return `https://source.unsplash.com/random/300x300?profile=${idNumber}`;
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
