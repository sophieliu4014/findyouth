
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

// Transform database events to UI events
export const transformDatabaseEvents = async (dbEvents: DatabaseEvent[]): Promise<Event[]> => {
  // Collect all nonprofit IDs to fetch in one query
  const nonprofitIds = [...new Set(dbEvents.map(event => event.nonprofit_id))];
  
  // Fetch nonprofit data in a single query
  const { data: nonprofits } = await supabase
    .from('nonprofits')
    .select('id, organization_name, profile_image_url')
    .in('id', nonprofitIds);
  
  // Create a map for quick lookups
  const nonprofitMap = new Map();
  if (nonprofits) {
    nonprofits.forEach(nonprofit => {
      nonprofitMap.set(nonprofit.id, {
        name: nonprofit.organization_name,
        profileImage: nonprofit.profile_image_url
      });
    });
  }

  return dbEvents.map(event => {
    // Get nonprofit data from our map, or use fallbacks
    const nonprofit = nonprofitMap.get(event.nonprofit_id);
    const organizationName = nonprofit?.name || 
                             NONPROFIT_NAME_MAP[event.nonprofit_id] || 
                             'Unknown Organization';
    const profileImage = nonprofit?.profileImage || 
                         `https://images.unsplash.com/photo-${1550000000000 + parseInt(event.nonprofit_id.slice(-4), 16) % 1000000}`;
    
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
