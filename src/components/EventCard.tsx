
import { useState } from 'react';
import { Calendar, MapPin, Star, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from './ui/use-toast';
import { useAuthStore } from '@/lib/auth';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

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
  organizationId?: string;
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
  profileImage,
  organizationId
}: EventCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);
  const { toast } = useToast();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  console.log('EventCard rendering with:', { 
    id, 
    title, 
    organization, 
    organizationId, 
    profileImage 
  });

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const handleApplyNow = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to apply for volunteer opportunities",
        variant: "destructive",
      });
      return;
    }

    setIsApplying(true);
    
    setTimeout(() => {
      toast({
        title: "Application submitted",
        description: "The organization has been notified of your interest",
      });
      setIsApplying(false);
    }, 1000);
  };

  const handleOrganizationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log(`Navigating to nonprofit profile with ID: ${organizationId}`);
    if (organizationId) {
      navigate(`/nonprofit/${organizationId}`);
    } else {
      console.error('No organization ID available for navigation');
      toast({
        title: "Navigation error",
        description: "Cannot navigate to organization profile because the ID is missing",
        variant: "destructive",
      });
    }
  };

  const handleCauseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/cause/${encodeURIComponent(causeArea)}`);
  };

  const handleProfileImageError = () => {
    console.log(`Profile image error for ${organization}`);
    setProfileImageError(true);
  };

  const getOrgInitial = () => {
    return organization ? organization.charAt(0).toUpperCase() : '?';
  };

  return (
    <div 
      className="glass-panel hover:shadow-lg transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex">
        <Avatar 
          className="h-16 w-16 border-2 border-white shadow-sm flex-shrink-0 mr-4 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleOrganizationClick}
        >
          {profileImage && !profileImageError ? (
            <AvatarImage 
              src={profileImage}
              alt={organization}
              onError={handleProfileImageError}
            />
          ) : (
            <AvatarFallback className="bg-youth-blue/10 text-youth-blue font-bold text-xl">
              {getOrgInitial()}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-youth-charcoal truncate transition-colors duration-300">
            {title}
          </h3>
          
          <div className="flex items-center mt-1 text-sm text-youth-charcoal/80">
            <span 
              className="font-medium text-youth-purple cursor-pointer hover:underline"
              onClick={handleOrganizationClick}
            >
              {organization}
            </span>
            <span className="mx-2">•</span>
            <span 
              className="text-youth-blue cursor-pointer hover:underline"
              onClick={handleCauseClick}
            >
              {causeArea}
            </span>
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
      
      {imageUrl && typeof imageUrl === 'string' && (
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
        
        <button 
          className="btn-primary py-2 disabled:opacity-70"
          onClick={handleApplyNow}
          disabled={isApplying}
        >
          {isApplying ? 'Applying...' : 'Apply Now'}
        </button>
      </div>
    </div>
  );
}

export default EventCard;
