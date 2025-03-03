
import { supabase } from '@/integrations/supabase/client';

// Random selection helper
const randomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
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
    
    if (count && count > 8) {
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
      'West Vancouver', 'Coquitlam', 'New Westminster'
    ];
    
    const eventTypes = [
      'Clean-up', 'Workshop', 'Fundraiser', 'Awareness Campaign', 
      'Community Event', 'Training Session', 'Support Group', 'Social Gathering'
    ];
    
    const imageUrls = [
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f8e7c4',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7',
      'https://images.unsplash.com/photo-1498836517558-503c3a06a7ca',
      'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a',
      'https://images.unsplash.com/photo-1546410531-bb4caa6b424d'
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
    
    // 4. Create example events
    const eventPromises = nonprofits.slice(0, 4).flatMap((nonprofit: SeedNonprofit) => {
      // Create 3 events for each nonprofit
      return Array(3).fill(null).map(async (_, index) => {
        const eventType = randomItem(eventTypes);
        const location = randomItem(locations);
        const date = getRandomFutureDate();
        
        const eventData = {
          title: `${eventType} in ${location}`,
          description: `Join ${nonprofit.organization_name} for a community ${eventType.toLowerCase()} event. This is a great opportunity to help our community and get involved with like-minded youth volunteers.`,
          location: location,
          date: date,
          nonprofit_id: nonprofit.id,
          image_url: randomItem(imageUrls)
        };
        
        const { data, error } = await supabase
          .from('events')
          .insert(eventData)
          .select();
          
        if (error) {
          console.error(`Error creating event for ${nonprofit.organization_name}:`, error);
          return null;
        }
        
        console.log(`Created event: ${eventData.title} for ${nonprofit.organization_name}`);
        return data;
      });
    });
    
    await Promise.all(eventPromises);
    console.log("Seeding completed successfully!");
    
  } catch (error) {
    console.error("Error in seed function:", error);
  }
};
