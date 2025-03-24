
import React from 'react';
import { Loader2 } from 'lucide-react';
import EventCard from '../EventCard';
import { Event } from '@/hooks/types/event-types';
import { useToast } from '@/components/ui/use-toast';

interface EventsListProps {
  title: string;
  events: Event[];
  isLoading: boolean;
  emptyMessage?: string;
}

const EventsList = ({ title, events, isLoading, emptyMessage }: EventsListProps) => {
  const { toast } = useToast();
  
  // Check for events with missing data and toast a warning
  React.useEffect(() => {
    if (!isLoading && events.length > 0) {
      const hasIncompleteData = events.some(
        event => !event.organization || !event.title || !event.date
      );
      
      if (hasIncompleteData) {
        toast({
          title: "Some event data may be incomplete",
          description: "Not all events could be fully loaded. Please refresh to try again.",
          variant: "destructive" // Changed from "warning" to "destructive" to match allowed variants
        });
      }
    }
  }, [events, isLoading, toast]);
  
  return (
    <>
      <h2 className="text-2xl font-bold text-youth-charcoal mb-6">
        {title}
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-youth-blue" />
          <span className="ml-2">Loading events...</span>
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {events.map((event, index) => (
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
          ))}
        </div>
      ) : (
        <div className="text-center py-12 glass-panel">
          <h3 className="text-xl font-medium text-youth-charcoal mb-2">No events found</h3>
          <p className="text-youth-charcoal/70">
            {emptyMessage || "This organization hasn't published any events yet."}
          </p>
        </div>
      )}
    </>
  );
};

export default EventsList;
