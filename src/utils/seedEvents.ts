
import { supabase } from '@/integrations/supabase/client';
import { checkCauseAreaColumn } from '@/hooks/event-utils';

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
    const { count: eventCount, error: countError } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      console.error("Error checking events count:", countError);
      return;
    }
    
    if (eventCount && eventCount >= 10) {
      console.log(`Database already has ${eventCount} events. No need to seed more.`);
      return;
    }
    
    // First, let's check if we have any nonprofits in the database
    const { data: existingNonprofits, error: nonprofitsError } = await supabase
      .from('nonprofits')
      .select('id, organization_name');
      
    if (nonprofitsError) {
      console.error("Error checking nonprofits:", nonprofitsError);
    }
    
    let nonprofits: SeedNonprofit[] = [];
    
    // If we have nonprofits in the database, use them
    if (existingNonprofits && existingNonprofits.length > 0) {
      console.log(`Found ${existingNonprofits.length} nonprofits in database.`);
      nonprofits = existingNonprofits as SeedNonprofit[];
    } else {
      // Otherwise use hardcoded sample nonprofits
      console.log("No nonprofits found in database. Creating sample nonprofits.");
      
      // Sample nonprofits for local development
      const sampleNonprofits: SeedNonprofit[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          organization_name: "Vancouver Youth Coalition"
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          organization_name: "Burnaby Environmental Network"
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          organization_name: "Richmond Youth Arts Collective"
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          organization_name: "Surrey Community Food Bank"
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440004',
          organization_name: "North Shore Animal Rescue"
        }
      ];
      
      // Try to insert sample nonprofits into the database
      for (const nonprofit of sampleNonprofits) {
        const { error: insertError } = await supabase
          .from('nonprofits')
          .insert({
            id: nonprofit.id,
            organization_name: nonprofit.organization_name,
            description: `${nonprofit.organization_name} is a youth-led nonprofit organization.`,
            mission: `Our mission is to empower youth and make a positive impact in our community.`,
            location: 'Greater Vancouver, BC',
            social_media: 'https://instagram.com/sample',
            email: `info@${nonprofit.organization_name.toLowerCase().replace(/\s+/g, '')}.org`,
            profile_image_url: `https://source.unsplash.com/random/300x300?nonprofit=${nonprofit.id.slice(-2)}`
          });
          
        if (insertError) {
          console.log(`Could not insert nonprofit ${nonprofit.organization_name}: ${insertError.message}`);
        } else {
          console.log(`Created nonprofit: ${nonprofit.organization_name}`);
        }
      }
      
      // Use sample nonprofits for the events
      nonprofits = sampleNonprofits;
    }
    
    console.log(`Using ${nonprofits.length} nonprofits to create events.`);
    
    if (nonprofits.length === 0) {
      console.error("No nonprofits available for creating events.");
      return;
    }
    
    // Prepare some example events
    const locations = [
      'Vancouver', 'Burnaby', 'Richmond', 'Surrey', 'North Vancouver', 
      'West Vancouver', 'Coquitlam', 'New Westminster', 'Delta', 'Langley'
    ];
    
    const eventTypes = [
      'Clean-up', 'Workshop', 'Fundraiser', 'Awareness Campaign', 
      'Community Event', 'Training Session', 'Support Group', 'Social Gathering',
      'Food Drive', 'Mentorship', 'Conference', 'Sport Event'
    ];
    
    // Check if the events table has cause_area column
    const hasCauseArea = await checkCauseAreaColumn();
    
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
    
    // Generate random future dates in the next 3 months
    const getRandomFutureDate = () => {
      const now = new Date();
      const futureDate = new Date();
      const daysToAdd = Math.floor(Math.random() * 90) + 1; // 1 to 90 days in the future
      futureDate.setDate(now.getDate() + daysToAdd);
      futureDate.setHours(Math.floor(Math.random() * 12) + 8, 0, 0); // Between 8am and 8pm
      return futureDate.toISOString();
    };
    
    // Create example events
    const eventPromises = [];
    
    for (let i = 0; i < 10; i++) {
      const nonprofit = randomItem(nonprofits);
      const eventType = randomItem(eventTypes);
      const location = randomItem(locations);
      const date = getRandomFutureDate();
      
      // Create event data object with base fields
      const eventData: any = {
        title: `${eventType} in ${location}`,
        description: `Join ${nonprofit.organization_name} for a community ${eventType.toLowerCase()} event. This is a great opportunity to help our community and get involved with like-minded youth volunteers. We need your support to make this event a success!`,
        location: location,
        date: date,
        nonprofit_id: nonprofit.id,
        image_url: randomItem(imageUrls),
        slots_available: randomInt(5, 30),
        duration_hours: randomInt(2, 8)
      };
      
      // Only add cause_area if the column exists
      if (hasCauseArea) {
        eventData.cause_area = randomItem(causeAreas);
      }
      
      console.log(`Creating event for nonprofit ID: ${nonprofit.id}, name: ${nonprofit.organization_name}`);
      
      const promise = supabase
        .from('events')
        .insert(eventData)
        .then(({ data, error }) => {
          if (error) {
            console.error(`Error creating event for nonprofit ID: ${nonprofit.id}, name: ${nonprofit.organization_name}:`, error);
            return null;
          }
          
          console.log(`Created event: ${eventData.title} for nonprofit ID: ${nonprofit.id}, name: ${nonprofit.organization_name}`);
          return data;
        });
      
      eventPromises.push(promise);
    }
    
    await Promise.all(eventPromises);
    console.log("Seeding completed successfully! Created example events.");
    
  } catch (error) {
    console.error("Error in seed function:", error);
  }
};
