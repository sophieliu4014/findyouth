
import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface EventResourcesProps {
  attachedLinks?: string;
}

const EventResources = ({ attachedLinks }: EventResourcesProps) => {
  // Parse attached links from string to array
  const getAttachedLinks = () => {
    if (!attachedLinks) return [];
    return attachedLinks.split('\n').filter(link => link.trim().length > 0);
  };

  const links = getAttachedLinks();
  
  if (links.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Additional Resources</h2>
        <ul className="space-y-2">
          {links.map((link, index) => (
            <li key={index}>
              <a 
                href={link.startsWith('http') ? link : `https://${link}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-youth-blue hover:text-youth-purple flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {link}
              </a>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default EventResources;
