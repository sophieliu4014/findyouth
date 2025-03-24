
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EventDescriptionProps {
  description: string;
  causeArea?: string;
}

const EventDescription = ({ description, causeArea }: EventDescriptionProps) => {
  // Function to render cause area badges
  const renderCauseAreas = () => {
    if (!causeArea) return null;
    
    // Split the cause areas by comma and trim whitespace
    const causes = causeArea.split(',').map(cause => cause.trim()).filter(Boolean);
    
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {causes.map((cause, index) => (
          <Link 
            key={`cause-badge-${index}`}
            to={`/cause/${encodeURIComponent(cause)}`}
            className="no-underline"
          >
            <Badge 
              variant="default" 
              className="bg-youth-blue/10 text-youth-blue px-3 py-1 hover:bg-youth-blue/20 transition-colors"
            >
              {cause}
            </Badge>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">About This Opportunity</h2>
        <p className="text-youth-charcoal whitespace-pre-line">{description}</p>
        
        {causeArea && renderCauseAreas()}
      </CardContent>
    </Card>
  );
};

export default EventDescription;
