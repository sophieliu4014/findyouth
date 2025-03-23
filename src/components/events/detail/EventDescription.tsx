
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

interface EventDescriptionProps {
  description: string;
  causeArea?: string;
}

const EventDescription = ({ description, causeArea }: EventDescriptionProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">About This Opportunity</h2>
        <p className="text-youth-charcoal whitespace-pre-line">{description}</p>
        
        {causeArea && (
          <div className="mt-4">
            <Link 
              to={`/cause/${encodeURIComponent(causeArea)}`}
              className="inline-block bg-youth-blue/10 text-youth-blue px-3 py-1 rounded-full text-sm hover:bg-youth-blue/20 transition-colors"
            >
              {causeArea}
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventDescription;
