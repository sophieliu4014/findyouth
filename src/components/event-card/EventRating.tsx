
import { Star } from 'lucide-react';

interface EventRatingProps {
  rating: number;
}

const EventRating = ({ rating }: EventRatingProps) => {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return [...Array(5)].map((_, i) => {
      if (i < fullStars) {
        return (
          <Star
            key={i}
            className="h-4 w-4 text-yellow-400 fill-yellow-400"
          />
        );
      } 
      else if (i === fullStars && hasHalfStar) {
        return (
          <div key={i} className="relative h-4 w-4">
            <Star className="absolute h-4 w-4 text-gray-300" />
            <div className="absolute h-4 w-2 overflow-hidden">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            </div>
          </div>
        );
      } 
      else {
        return (
          <Star
            key={i}
            className="h-4 w-4 text-gray-300"
          />
        );
      }
    });
  };

  return (
    <div className="flex items-center text-sm mt-1">
      {renderStars(rating)}
    </div>
  );
};

export default EventRating;
