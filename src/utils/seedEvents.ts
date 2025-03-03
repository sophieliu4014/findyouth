
import { supabase } from '@/integrations/supabase/client';

// Random selection helper
const randomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Random integer helper
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

interface SeedNonprofit {
  id: string;
  organization_name: string;
}

export const seedEvents = async () => {
  try {
    console.log("Starting to seed events...");
    
    // Check if we already have enough events
    const { count, error: countError } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      console.error("Error checking events count:", countError);
      return;
    }
    
    if (count && count >= 10) {
      console.log(`Database already has ${count} events. No need to seed more.`);
      return;
    }
    
    // 1. Get nonprofits that we can attach events to
    const { data: nonprofits, error: nonprofitsError } = await supabase
      .from('nonprofits')
      .select('id, organization_name');
      
    if (nonprofitsError || !nonprofits || nonprofits.length === 0) {
      console.error("Error fetching nonprofits:", nonprofitsError);
      return;
    }
    
    console.log(`Found ${nonprofits.length} nonprofits to seed events for`);
    
    // 2. Prepare some example events
    const locations = [
      'Vancouver', 'Burnaby', 'Richmond', 'Surrey', 'North Vancouver', 
      'West Vancouver', 'Coquitlam', 'New Westminster', 'Delta', 'Langley'
    ];
    
    const eventTypes = [
      'Clean-up', 'Workshop', 'Fundraiser', 'Awareness Campaign', 
      'Community Event', 'Training Session', 'Support Group', 'Social Gathering',
      'Food Drive', 'Mentorship', 'Conference', 'Sport Event'
    ];
    
    const causeAreas = [
      'Advocacy & Human Rights', 'Education', 'Sports', 'Health', 
      'Arts & Culture', 'Environment', 'Homeless', 'Animals', 
      'Youth', 'Seniors', 'Religion'
    ];
    
    const imageUrls = [
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f8e7c4',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7',
      'https://images.unsplash.com/photo-1498836517558-503c3a06a7ca',
      'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a',
      'https://images.unsplash.com/photo-1546410531-bb4caa6b424d',
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a',
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18',
      'https://images.unsplash.com/photo-1542810634-71277d95dcbb'
    ];
    
    // 3. Generate random future dates in the next 3 months
    const getRandomFutureDate = () => {
      const now = new Date();
      const futureDate = new Date();
      const daysToAdd = Math.floor(Math.random() * 90) + 1; // 1 to 90 days in the future
      futureDate.setDate(now.getDate() + daysToAdd);
      futureDate.setHours(Math.floor(Math.random() * 12) + 8, 0, 0); // Between 8am and 8pm
      return futureDate.toISOString();
    };
    
    // 4. Create 10 example events
    const eventPromises = [];
    
    for (let i = 0; i < 10; i++) {
      const nonprofit = randomItem(nonprofits);
      const eventType = randomItem(eventTypes);
      const location = randomItem(locations);
      const date = getRandomFutureDate();
      const causeArea = randomItem(causeAreas);
      
      const eventData = {
        title: `${eventType} in ${location}`,
        description: `Join ${nonprofit.organization_name} for a community ${eventType.toLowerCase()} event. This is a great opportunity to help our community and get involved with like-minded youth volunteers. We need your support to make this event a success!`,
        location: location,
        date: date,
        nonprofit_id: nonprofit.id,
        image_url: randomItem(imageUrls),
        cause_area: causeArea,
        slots_available: randomInt(5, 30),
        duration_hours: randomInt(2, 8)
      };
      
      const promise = supabase
        .from('events')
        .insert(eventData)
        .select()
        .then(({ data, error }) => {
          if (error) {
            console.error(`Error creating event for ${nonprofit.organization_name}:`, error);
            return null;
          }
          
          console.log(`Created event: ${eventData.title} for ${nonprofit.organization_name}`);
          return data;
        });
      
      eventPromises.push(promise);
    }
    
    await Promise.all(eventPromises);
    console.log("Seeding completed successfully! Created 10 example events.");
    
  } catch (error) {
    console.error("Error in seed function:", error);
  }
};
