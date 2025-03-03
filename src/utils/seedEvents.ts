
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
    
    // 1. Check for nonprofits and create some if none exist
    const { data: existingNonprofits, error: nonprofitsCheckError } = await supabase
      .from('nonprofits')
      .select('id, organization_name');
      
    if (nonprofitsCheckError) {
      console.error("Error checking nonprofits:", nonprofitsCheckError);
      return;
    }
    
    let nonprofits = existingNonprofits || [];
    
    // If no nonprofits exist, create sample nonprofits
    if (nonprofits.length === 0) {
      console.log("No nonprofits found. Creating sample nonprofits...");
      
      const sampleNonprofits = [
        {
          organization_name: "Vancouver Youth Coalition",
          email: "info@vancouveryouth.org",
          phone: "604-555-1234",
          social_media: "instagram.com/vancouveryouth",
          website: "https://vancouveryouth.org",
          location: "Vancouver",
          description: "Dedicated to empowering youth through community engagement and leadership opportunities.",
          mission: "To create a supportive environment where youth can develop skills, confidence, and a sense of community belonging.",
          profile_image_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a"
        },
        {
          organization_name: "Burnaby Environmental Network",
          email: "contact@burnabyenv.org",
          phone: "604-555-2345",
          social_media: "instagram.com/burnabyenv",
          website: "https://burnabyenv.org",
          location: "Burnaby",
          description: "Working to protect and enhance Burnaby's natural environment through community action.",
          mission: "To foster environmental stewardship and sustainable practices in our community.",
          profile_image_url: "https://images.unsplash.com/photo-1552084117-56a987666449"
        },
        {
          organization_name: "Richmond Youth Arts Collective",
          email: "arts@richmondyouth.org",
          phone: "604-555-3456",
          social_media: "instagram.com/richmondarts",
          website: "https://richmondyoutharts.org",
          location: "Richmond",
          description: "Providing creative outlets and arts education for youth in Richmond.",
          mission: "To nurture creativity and self-expression through accessible arts programming.",
          profile_image_url: "https://images.unsplash.com/photo-1547153760-18fc86324498"
        },
        {
          organization_name: "Surrey Community Food Bank",
          email: "help@surreyfoodbank.org",
          phone: "604-555-4567",
          social_media: "instagram.com/surreyfoodbank",
          website: "https://surreyfoodbank.org",
          location: "Surrey",
          description: "Addressing food insecurity in Surrey through community-based initiatives.",
          mission: "To ensure that no one in our community goes hungry by providing dignified access to food and resources.",
          profile_image_url: "https://images.unsplash.com/photo-1593113646773-028c9a82fde1"
        },
        {
          organization_name: "North Shore Animal Rescue",
          email: "rescue@northshoreanimals.org",
          phone: "604-555-5678",
          social_media: "instagram.com/northshorerescue",
          website: "https://northshoreanimals.org",
          location: "North Vancouver",
          description: "Rescuing and rehoming animals in need across the North Shore.",
          mission: "To provide care, shelter, and loving homes for abandoned and mistreated animals.",
          profile_image_url: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b"
        }
      ];
      
      // Insert the sample nonprofits
      for (const nonprofit of sampleNonprofits) {
        const { data, error } = await supabase
          .from('nonprofits')
          .insert(nonprofit)
          .select('id, organization_name');
          
        if (error) {
          console.error(`Error creating nonprofit ${nonprofit.organization_name}:`, error);
        } else if (data) {
          console.log(`Created nonprofit: ${nonprofit.organization_name}`);
          nonprofits.push(...data);
        }
      }
      
      if (nonprofits.length === 0) {
        console.error("Failed to create any nonprofits. Cannot proceed with event creation.");
        return;
      }
      
      console.log(`Successfully created ${nonprofits.length} nonprofits.`);
    } else {
      console.log(`Found ${nonprofits.length} existing nonprofits.`);
    }
    
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
    
    // 4. Create example events
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
