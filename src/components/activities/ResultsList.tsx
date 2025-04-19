
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import EventCard from '../EventCard';
import { seedEvents } from '@/utils/seedEvents';
import { Event } from '@/hooks/types/event-types';
import { categorizeEvents } from '@/utils/dateUtils';

interface ResultsListProps {
  events: Event[];
  isLoading: boolean;
}

const ResultsList = ({ events, isLoading }: ResultsListProps) => {
  // Seed events if none are found
  useEffect(() => {
    if (!isLoading && events.length === 0) {
      console.log('No events found, seeding events...');
      seedEvents();
    }
  }, [events, isLoading]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-youth-blue" />
        <span className="ml-2 text-youth-charcoal">Loading events...</span>
      </div>
    );
  }

  // Categorize events into active and past
  const { activeEvents, pastEvents } = categorizeEvents(events);
  
  console.log('Active events:', activeEvents.length);
  console.log('Past events:', pastEvents.length);
  
  return (
    <div>
      <h2 className="text-2xl font-semibold text-youth-charcoal mb-6">Upcoming Events</h2>
      
      {activeEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          {activeEvents.map((event, index) => (
            <div 
              key={event.id} 
              className="animate-slide-up p-1.5" 
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <EventCard 
                id={event.id}
                title={event.title}
                organization={event.organization}
                date={event.date}
                endDate={event.endDate}
                location={event.location}
                causeArea={event.causeArea}
                rating={event.rating}
                imageUrl={event.imageUrl}
                profileImage={event.profileImage}
                organizationId={event.organizationId}
                creatorId={event.creatorId}
                registrationLink={event.registrationLink}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="col-span-2 text-center py-12 glass-panel animate-fade-in mb-10">
          <h3 className="text-xl font-medium text-youth-charcoal mb-2">No upcoming events found</h3>
          <p className="text-youth-charcoal/70">
            Check back soon for new volunteer opportunities or browse our past events below.
          </p>
        </div>
      )}

      {pastEvents.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold text-youth-charcoal mb-6">Recently Past Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
            {pastEvents.map((event, index) => (
              <div 
                key={event.id} 
                className="animate-slide-up p-1.5" 
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <EventCard 
                  id={event.id}
                  title={event.title}
                  organization={event.organization}
                  date={event.date}
                  endDate={event.endDate}
                  location={event.location}
                  causeArea={event.causeArea}
                  rating={event.rating}
                  imageUrl={event.imageUrl}
                  profileImage={event.profileImage}
                  organizationId={event.organizationId}
                  creatorId={event.creatorId}
                  registrationLink={event.registrationLink}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ResultsList;
