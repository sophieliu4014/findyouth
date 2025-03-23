
import { Card, CardContent } from '@/components/ui/card';

interface EventImageProps {
  imageUrl?: string;
  title: string;
}

const EventImage = ({ imageUrl, title }: EventImageProps) => {
  if (!imageUrl) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Event Gallery</h2>
        <div className="w-full flex justify-center">
          <img 
            src={imageUrl} 
            alt={title} 
            className="max-w-full rounded-lg max-h-[500px] object-contain"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EventImage;
