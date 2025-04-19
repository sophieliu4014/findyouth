
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ui/use-toast';
import { useAuthStore } from '@/lib/auth';
import { checkAdminStatus, canManageEvent } from '@/hooks/utils/admin-utils';
import { supabase } from '@/integrations/supabase/client';
import type { EventCardProps } from './types';
import EventHeader from './EventHeader';
import EventDetails from './EventDetails';
import EventRating from './EventRating';
import EventActions from './EventActions';
import EventManagement from './EventManagement';

const EventCard = ({
  id,
  title,
  organization,
  date,
  endDate,
  location,
  causeArea,
  rating,
  imageUrl,
  profileImage,
  organizationId,
  creatorId,
  registrationLink
}: EventCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [canUserManageEvent, setCanUserManageEvent] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const checkPermissions = async () => {
      if (user?.id) {
        const adminStatus = await checkAdminStatus(user.id);
        setIsAdmin(adminStatus);
        
        const canManage = canManageEvent(user.id, creatorId, adminStatus);
        setCanUserManageEvent(canManage);
      } else {
        setIsAdmin(false);
        setCanUserManageEvent(false);
      }
    };
    
    checkPermissions();
  }, [user, creatorId]);

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
    
    if (registrationLink) {
      window.open(registrationLink, '_blank', 'noopener,noreferrer');
      setIsApplying(false);
    } else {
      setTimeout(() => {
        toast({
          title: "Application submitted",
          description: "The organization has been notified of your interest",
        });
        setIsApplying(false);
      }, 1000);
    }
  };

  const handleOrganizationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (organizationId) {
      navigate(`/nonprofit/${organizationId}`);
    } else {
      toast({
        title: "Navigation error",
        description: "Cannot navigate to organization profile because the ID is missing",
        variant: "destructive",
      });
    }
  };

  const handleCauseClick = (cause: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/cause/${encodeURIComponent(cause.trim())}`);
  };

  const handleEditEvent = () => {
    if (id) {
      navigate(`/edit-event/${id}`);
    }
  };

  const handleDeleteEvent = async () => {
    if (!id) return;

    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to delete events.",
          variant: "destructive",
        });
        return;
      }

      if (!canUserManageEvent) {
        toast({
          title: "Permission denied",
          description: "You don't have permission to delete this event.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Event deleted",
        description: "The event has been successfully deleted.",
      });
      
      window.location.reload();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error deleting event",
        description: "There was a problem deleting the event.",
        variant: "destructive",
      });
    }
  };

  return (
    <div 
      className="glass-panel hover:shadow-lg transition-all duration-300 overflow-hidden relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {canUserManageEvent && (
        <EventManagement
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
        />
      )}

      <EventHeader
        title={title}
        organization={organization}
        profileImage={profileImage}
        organizationId={organizationId}
        causeArea={causeArea}
        onOrganizationClick={handleOrganizationClick}
        onCauseClick={handleCauseClick}
        onProfileImageError={() => setProfileImageError(true)}
      />
      
      <EventDetails
        date={date}
        endDate={endDate}
        location={location}
      />
      
      <EventRating rating={rating} />
      
      {imageUrl && typeof imageUrl === 'string' && (
        <div className="mt-4 h-48 w-full overflow-hidden rounded-lg">
          <img 
            src={imageUrl} 
            alt={title} 
            className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : ''}`}
          />
        </div>
      )}
      
      <EventActions
        id={id}
        onApply={handleApplyNow}
        isApplying={isApplying}
      />
    </div>
  );
};

export default EventCard;
