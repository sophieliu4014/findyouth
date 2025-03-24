
// Types related to events
export interface Event {
  id: string;
  title: string;
  description: string;
  organization: string;
  organizationId?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location: string;
  address?: string;
  virtual?: boolean;
  causeArea: string;
  requirements?: string;
  rating: number;
  imageUrl?: string;
  profileImage?: string;
  registrationLink?: string;
  authorId?: string; // Add authorId to identify who created the event
  contactEmail?: string;
  contactPhone?: string;
  websiteUrl?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DatabaseEvent {
  id: string;
  title: string;
  description: string;
  nonprofit_id: string;
  nonprofit_name: string;
  date: string;
  start_time?: string;
  end_time?: string;
  location: string;
  address?: string;
  is_virtual: boolean;
  cause_area: string;
  requirements?: string;
  rating?: number;
  image_url?: string;
  registration_link?: string;
  author_id?: string; // Add author_id to match the database field
  contact_email?: string;
  contact_phone?: string;
  website_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Define and export the NONPROFIT_NAME_MAP constant
export const NONPROFIT_NAME_MAP: Record<string, string> = {
  // Default mapping of nonprofit IDs to names
  "e76a0e1b-6a87-4dac-8714-1c9e9052f52c": "Find Youth"
};

// EventFilters interface for filtering events
export interface EventFilters {
  cause: string;
  location: string;
  organization: string;
  searchKeyword: string;
}
