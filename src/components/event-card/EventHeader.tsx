
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';

interface EventHeaderProps {
  title: string;
  organization: string;
  profileImage?: string;
  organizationId?: string;
  causeArea: string;
  onOrganizationClick: (e: React.MouseEvent) => void;
  onCauseClick: (cause: string) => (e: React.MouseEvent) => void;
  onProfileImageError: () => void;
}

const EventHeader = ({
  title,
  organization,
  profileImage,
  organizationId,
  causeArea,
  onOrganizationClick,
  onCauseClick,
  onProfileImageError
}: EventHeaderProps) => {
  const getOrgInitial = () => {
    return organization ? organization.charAt(0).toUpperCase() : '?';
  };

  const renderCauseAreas = () => {
    if (!causeArea) return null;
    
    const causes = causeArea.split(',').map(cause => cause.trim()).filter(Boolean);
    
    return causes.map((cause, index) => (
      <span key={`${organizationId}-cause-${index}`}>
        <span 
          className="text-youth-blue cursor-pointer hover:underline"
          onClick={onCauseClick(cause)}
        >
          {cause}
        </span>
        {index < causes.length - 1 && <span className="text-youth-charcoal/60">, </span>}
      </span>
    ));
  };

  return (
    <div className="flex">
      <Avatar 
        className="h-16 w-16 border-2 border-white shadow-sm flex-shrink-0 mr-4 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={onOrganizationClick}
      >
        {profileImage ? (
          <AvatarImage 
            src={profileImage}
            alt={organization}
            onError={onProfileImageError}
          />
        ) : (
          <AvatarFallback className="bg-youth-blue/10 text-youth-blue font-bold text-xl">
            {getOrgInitial()}
          </AvatarFallback>
        )}
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-xl font-semibold text-youth-charcoal truncate transition-colors duration-300 max-w-full">
          {title}
        </h3>
        
        <div className="flex items-center mt-1 text-sm text-youth-charcoal/80">
          <span 
            className="font-medium text-youth-purple cursor-pointer hover:underline"
            onClick={onOrganizationClick}
          >
            {organization}
          </span>
          <span className="mx-2">•</span>
          <span className="text-youth-charcoal/80">
            {renderCauseAreas()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventHeader;
