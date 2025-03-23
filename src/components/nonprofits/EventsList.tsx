
import React from 'react';
import { Loader2 } from 'lucide-react';
import EventCard from '../EventCard';
import { Event } from '@/hooks/types/event-types';

interface EventsListProps {
  title: string;
  events: Event[];
  isLoading: boolean;
}

const EventsList = ({ title, events, isLoading }: EventsListProps) => {
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
              <EventCard {...event} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 glass-panel">
          <h3 className="text-xl font-medium text-youth-charcoal mb-2">No events found</h3>
          <p className="text-youth-charcoal/70">
            This organization hasn't published any events yet.
          </p>
        </div>
      )}
    </>
  );
};

export default EventsList;
