
// Define the event type that maps to our database
export interface DatabaseEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  end_date?: string | null;
  nonprofit_id: string; // This is actually the creator's user ID
  image_url?: string | null;
  created_at?: string | null;
  cause_area?: string | null;
  signup_form_url?: string | null;
}

// Define the event type with additional fields for the UI
export interface Event {
  id: string;
  title: string;
  organization: string;
  organizationId: string; // The ID of the nonprofit organization
  creatorId?: string;     // The user ID who created the event
  date: string;
  location: string;
  causeArea: string;
  rating: number;
  imageUrl?: string;
  profileImage?: string;
  description?: string;
  createdAt?: string;
  registrationLink?: string;
}

// Map for hardcoded nonprofit names (for development only)
export const NONPROFIT_NAME_MAP: Record<string, string> = {
  '550e8400-e29b-41d4-a716-446655440000': 'Vancouver Youth Coalition',
  '550e8400-e29b-41d4-a716-446655440001': 'Burnaby Environmental Network',
  '550e8400-e29b-41d4-a716-446655440002': 'Richmond Youth Arts Collective',
  '550e8400-e29b-41d4-a716-446655440003': 'Surrey Community Food Bank',
  '550e8400-e29b-41d4-a716-446655440004': 'North Shore Animal Rescue',
  'e76a0e1b-6a87-4dac-8714-1c9e9052f52c': 'FindYOUth Admin' // Add admin to name map
};
