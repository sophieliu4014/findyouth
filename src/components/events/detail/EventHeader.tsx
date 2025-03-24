
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { generateDynamicGradient } from '@/hooks/utils/image-utils';

interface EventHeaderProps {
  event: {
    title: string;
    nonprofit_id: string;
  };
  organization: {
    name: string;
    profileImage?: string;
    bannerImageUrl?: string;
  } | null;
  goBack?: () => void;
}

const EventHeader = ({ event, organization, goBack }: EventHeaderProps) => {
  // Helper function to get organization initial for avatar fallback
  const getOrgInitial = () => {
    return organization?.name ? organization.name.charAt(0).toUpperCase() : '?';
  };

  // Get the dynamic gradient based on profile image or nonprofit ID
  const gradientClasses = generateDynamicGradient(
    organization?.profileImage || null, 
    event.nonprofit_id
  );

  return (
    <div className="mb-8 animate-fade-in">
      {/* Display organization banner at the top if available, otherwise use gradient */}
      <div className="w-full mb-6 rounded-lg overflow-hidden h-48 md:h-64">
        {organization?.bannerImageUrl ? (
          <img 
            src={organization.bannerImageUrl} 
            alt={`${organization.name} banner`} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full ${gradientClasses}`}></div>
        )}
      </div>
      
      <div className="flex items-start">
        {organization && (
          <Avatar 
            className="h-16 w-16 border-2 border-white shadow-sm flex-shrink-0 mr-4"
          >
            {organization.profileImage ? (
              <AvatarImage 
                src={organization.profileImage}
                alt={organization.name}
              />
            ) : (
              <AvatarFallback className="bg-youth-blue/10 text-youth-blue font-bold text-xl">
                {getOrgInitial()}
              </AvatarFallback>
            )}
          </Avatar>
        )}
        
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-youth-charcoal">{event.title}</h1>
          {organization && (
            <Link 
              to={`/nonprofit/${event.nonprofit_id}`}
              className="text-lg text-youth-purple hover:underline mt-1 inline-block"
            >
              {organization.name}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventHeader;
