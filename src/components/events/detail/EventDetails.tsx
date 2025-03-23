
import { Calendar, Clock, MapPin, User, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface EventDetailsProps {
  event: {
    date: string;
    end_date?: string;
    start_time?: string;
    end_time?: string;
    location: string;
    city?: string;
    state?: string;
    zip?: string;
    application_deadline?: string;
    nonprofit_id: string;
  };
  organization: {
    name: string;
    location?: string;
  } | null;
  onApply: () => void;
  isApplying: boolean;
}

const EventDetails = ({ event, organization, onApply, isApplying }: EventDetailsProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date not specified';
    return dateString;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Event Details</h2>
        <ul className="space-y-4">
          <li className="flex items-start">
            <Calendar className="h-5 w-5 mr-3 text-youth-blue flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Date</p>
              <p>{formatDate(event.date)}</p>
              {event.end_date && event.end_date !== event.date && (
                <p>to {formatDate(event.end_date)}</p>
              )}
            </div>
          </li>
          
          {(event.start_time || event.end_time) && (
            <li className="flex items-start">
              <Clock className="h-5 w-5 mr-3 text-youth-blue flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Time</p>
                <p>
                  {event.start_time && `From ${event.start_time}`}
                  {event.end_time && event.start_time && ` to ${event.end_time}`}
                  {event.end_time && !event.start_time && `Until ${event.end_time}`}
                </p>
              </div>
            </li>
          )}
          
          <li className="flex items-start">
            <MapPin className="h-5 w-5 mr-3 text-youth-blue flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Location</p>
              <p>{event.location}</p>
              {(event.city || event.state || event.zip) && (
                <p>
                  {event.city && `${event.city}, `}
                  {event.state}
                  {event.zip && ` ${event.zip}`}
                </p>
              )}
            </div>
          </li>
          
          {event.application_deadline && (
            <li className="flex items-start">
              <User className="h-5 w-5 mr-3 text-youth-blue flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Application Deadline</p>
                <p>{event.application_deadline}</p>
              </div>
            </li>
          )}
          
          {organization && (
            <li className="flex items-start">
              <Building className="h-5 w-5 mr-3 text-youth-blue flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Hosted by</p>
                <Link 
                  to={`/nonprofit/${event.nonprofit_id}`}
                  className="text-youth-purple hover:underline"
                >
                  {organization.name}
                </Link>
                {organization.location && (
                  <p className="text-sm text-youth-charcoal/70">
                    {organization.location}
                  </p>
                )}
              </div>
            </li>
          )}
        </ul>
        
        <Separator className="my-6" />
        
        <Button 
          className="w-full bg-youth-blue hover:bg-youth-purple"
          onClick={onApply}
          disabled={isApplying}
        >
          {isApplying ? 'Processing...' : 'Apply Now'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventDetails;
