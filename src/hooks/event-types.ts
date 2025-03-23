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
      
      // Populate the nonprofit map
      nonprofits.forEach(nonprofit => {
        nonprofitMap.set(nonprofit.id, {
          name: nonprofit.organization_name,
          profileImage: nonprofit.profile_image_url
        });
      });
    } else {
      console.log('No nonprofits found in database, will check user profiles');
    }
    
    // For any IDs not found in nonprofits table, fetch from auth.users and profiles
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
        
        // For each profile, try to get the organization_name from user metadata
        for (const profile of profiles) {
          try {
            const { data: user } = await supabase.auth.admin.getUserById(profile.id);
            const organizationName = user?.user?.user_metadata?.organization_name || profile.full_name || 'User';
            
            nonprofitMap.set(profile.id, {
              name: organizationName,
              profileImage: profile.avatar_url
            });
          } catch (error) {
            console.error(`Error fetching user metadata for ${profile.id}:`, error);
            nonprofitMap.set(profile.id, {
              name: profile.full_name || 'User',
              profileImage: profile.avatar_url
            });
          }
        }
      }
    }
  } catch (fetchError) {
    console.error('Exception while fetching organization data:', fetchError);
  }
  
  console.log('Nonprofit/Profile map has entries:', nonprofitMap.size);
  
  // Transform each event with nonprofit/user data and better fallback handling
  return dbEvents.map(event => {
    // Get organization data from our map, or use fallbacks
    const organization = nonprofitMap.get(event.nonprofit_id);
    
    // Use console.log to debug data for each event
    console.log(`Processing event ${event.id} for org/user ${event.nonprofit_id}`);
    console.log(`Organization/User data found:`, organization);
    console.log(`Event image_url:`, event.image_url);
    
    const organizationName = organization?.name || 
                          NONPROFIT_NAME_MAP[event.nonprofit_id] || 
                          'User';
                          
    // For profile image, use a more distinctive fallback pattern
    let profileImage = organization?.profileImage;
    if (!profileImage) {
      // Use a deterministic fallback based on ID
      const idNumber = parseInt(event.nonprofit_id.replace(/\D/g, '').slice(-6), 10) % 100 || 42;
      profileImage = `https://source.unsplash.com/random/300x300?profile=${idNumber}`;
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
  });
};
