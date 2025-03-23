
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import EventCard from '../EventCard';
import { seedEvents } from '@/utils/seedEvents';
import { Event } from '@/hooks/event-types';

interface ResultsListProps {
  events: Event[];
  isLoading: boolean;
}

const ResultsList = ({ events, isLoading }: ResultsListProps) => {
  // Seed events if none are found
  useEffect(() => {
    if (!isLoading && events.length === 0) {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      {events && events.length > 0 ? (
        events.map((event, index) => (
          <div 
            key={event.id} 
            className="animate-slide-up" 
            style={{ animationDelay: `${(index + 1) * 100}ms` }}
          >
            <EventCard {...event} />
          </div>
        ))
      ) : (
        <div className="col-span-2 text-center py-12 glass-panel animate-fade-in">
          <h3 className="text-xl font-medium text-youth-charcoal mb-2">No events found</h3>
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
  );
};

export default ResultsList;
