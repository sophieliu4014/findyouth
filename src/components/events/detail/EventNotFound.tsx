
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const EventNotFound = () => {
  return (
    <div className="text-center py-16 glass-panel">
      <h3 className="text-xl font-medium text-youth-charcoal mb-2">Event Not Found</h3>
      <p className="text-youth-charcoal/70 mb-6">
        The event you're looking for couldn't be found or has been removed.
      </p>
      <Link to="/find-activities">
        <Button variant="default">
          Browse All Activities
        </Button>
      </Link>
    </div>
  );
};

export default EventNotFound;
