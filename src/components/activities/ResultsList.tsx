
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import EventCard from '../EventCard';
import { seedEvents } from '@/utils/seedEvents';
import { Event } from '@/hooks/types/event-types';

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

  console.log('Rendering events with registration links:', events.map(e => ({ 
    id: e.id, 
    title: e.title, 
    registrationLink: e.registrationLink 
  })));
  
  return (
    <div>
      <p className="text-sm text-youth-charcoal/70 mb-4 italic">
        Note: Only showing upcoming events. Past events can be viewed on organization profiles.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {events && events.length > 0 ? (
          events.map((event, index) => (
            <div 
              key={event.id} 
              className="animate-slide-up" 
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <EventCard 
                id={event.id}
                title={event.title}
                organization={event.organization}
                date={event.date}
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
          ))
        ) : (
          <div className="col-span-2 text-center py-12 glass-panel animate-fade-in">
            <h3 className="text-xl font-medium text-youth-charcoal mb-2">No upcoming events found</h3>
            <p className="text-youth-charcoal/70">
              Try adjusting your filters or search criteria to find volunteer opportunities.
            </p>
            <button 
              className="mt-4 px-4 py-2 bg-youth-purple text-white rounded-md hover:bg-youth-purple/90 transition-colors"
              onClick={() => seedEvents().then(() => window.location.reload())}
            >
              Generate Sample Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsList;
