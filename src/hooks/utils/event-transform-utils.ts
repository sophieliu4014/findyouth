
import { Event, DatabaseEvent } from '../types/event-types';
import { getProfileImageForNonprofit } from './nonprofit-utils';

// Transform database format to UI format
export const transformDatabaseEvents = async (events: DatabaseEvent[]): Promise<Event[]> => {
  if (!events || events.length === 0) {
    return [];
  }

  const transformPromises = events.map(async (event) => {
    let profileImage;
    
    // Get profile image for the nonprofit if nonprofit_id is available
    if (event.nonprofit_id) {
      try {
        profileImage = await getProfileImageForNonprofit(event.nonprofit_id);
      } catch (error) {
        console.error('Error fetching nonprofit profile image:', error);
      }
    }

    const transformedEvent: Event = {
      id: event.id,
      title: event.title,
      description: event.description,
      organization: event.nonprofit_name,
      organizationId: event.nonprofit_id,
      date: event.date,
      startTime: event.start_time,
      endTime: event.end_time,
      location: event.location,
      address: event.address,
      virtual: event.is_virtual,
      causeArea: event.cause_area,
      requirements: event.requirements,
      rating: event.rating || 0,
      imageUrl: event.image_url,
      profileImage,
      registrationLink: event.registration_link,
      contactEmail: event.contact_email,
      contactPhone: event.contact_phone,
      websiteUrl: event.website_url,
      authorId: event.author_id, // Include the author ID in the transformed event
      created_at: event.created_at,
      updated_at: event.updated_at
    };

    return transformedEvent;
  });

  return Promise.all(transformPromises);
};
