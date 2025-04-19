
import { Calendar, MapPin } from 'lucide-react';

interface EventDetailsProps {
  date: string;
  endDate?: string;
  location: string;
}

const EventDetails = ({ date, endDate, location }: EventDetailsProps) => {
  const formatDateDisplay = () => {
    if (endDate && endDate !== date) {
      const startFormatted = new Date(date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      const endFormatted = new Date(endDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      return `${startFormatted} to ${endFormatted}`;
    }
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="flex flex-col gap-y-1 mt-3">
      <div className="flex items-center text-sm text-youth-charcoal/70">
        <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
        <span>{formatDateDisplay()}</span>
      </div>
      
      <div className="flex items-center text-sm text-youth-charcoal/70">
        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
        <span>{location}</span>
      </div>
    </div>
  );
};

export default EventDetails;
