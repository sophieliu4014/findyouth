
import { useState } from 'react';
import { Calendar, MapPin, Star, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EventCardProps {
  id: string;
  title: string;
  organization: string;
  date: string;
  location: string;
  causeArea: string;
  rating: number;
  imageUrl?: string;
  profileImage?: string;
}

const EventCard = ({
  id,
  title,
  organization,
  date,
  location,
  causeArea,
  rating,
  imageUrl,
  profileImage
}: EventCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Render 5 stars with appropriate filled/unfilled state
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div 
      className="glass-panel hover:shadow-lg transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex">
        {/* Organization profile image */}
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0 mr-4">
          <img 
            src={profileImage || "https://via.placeholder.com/50"} 
            alt={organization} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-youth-charcoal truncate transition-colors duration-300">
            {title}
          </h3>
          
          <div className="flex items-center mt-1 text-sm text-youth-charcoal/80">
            <span className="font-medium text-youth-purple">{organization}</span>
            <span className="mx-2">•</span>
            <span className="text-youth-blue">{causeArea}</span>
          </div>
          
          <div className="flex flex-wrap gap-y-1 mt-3">
            <div className="flex items-center mr-4 text-sm text-youth-charcoal/70">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{date}</span>
            </div>
            
            <div className="flex items-center mr-4 text-sm text-youth-charcoal/70">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{location}</span>
            </div>
            
            <div className="flex items-center text-sm">
              {renderStars(rating)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Optional event image */}
      {imageUrl && (
        <div className="mt-4 h-48 w-full overflow-hidden rounded-lg">
          <img 
            src={imageUrl} 
            alt={title} 
            className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : ''}`}
          />
        </div>
      )}
      
      <div className="mt-4 flex justify-between items-center">
        <Link 
          to={`/event/${id}`} 
          className="text-youth-blue hover:text-youth-purple transition-colors flex items-center text-sm font-medium"
        >
          View Details
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
        
        <button className="btn-primary py-2">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default EventCard;
