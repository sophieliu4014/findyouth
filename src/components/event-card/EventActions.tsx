
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface EventActionsProps {
  id: string;
  onApply: () => void;
  isApplying: boolean;
}

const EventActions = ({ id, onApply, isApplying }: EventActionsProps) => {
  return (
    <div className="mt-4 flex justify-between items-center">
      <Link 
        to={`/event/${id}`} 
        className="text-youth-blue hover:text-youth-purple transition-colors flex items-center text-sm font-medium"
        target="_blank"
        rel="noopener noreferrer"
      >
        View Details
        <ArrowRight className="ml-1 h-4 w-4" />
      </Link>
      
      <button 
        className="btn-primary py-2 disabled:opacity-70"
        onClick={onApply}
        disabled={isApplying}
      >
        {isApplying ? 'Applying...' : 'Apply Now'}
      </button>
    </div>
  );
};

export default EventActions;
