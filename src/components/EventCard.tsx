
import { useState } from 'react';
import { Calendar, MapPin, Star, ArrowRight, MoreVertical, Edit, Trash2, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from './ui/use-toast';
import { useAuthStore } from '@/lib/auth';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from '@/integrations/supabase/client';

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
  registrationLink?: string;
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
  organizationId,
  registrationLink
}: EventCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuthStore((state) => state);
  const navigate = useNavigate();

  const isEventAuthor = user?.id === organizationId;

  console.log('EventCard rendering with:', { 
    id, 
    title, 
    organization, 
    organizationId, 
    profileImage,
    registrationLink,
    isEventAuthor
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

  const handleCauseClick = (cause: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/cause/${encodeURIComponent(cause.trim())}`);
  };

  const handleProfileImageError = () => {
    console.log(`Profile image error for ${organization}`);
    setProfileImageError(true);
  };

  const handleEditEvent = () => {
    if (id) {
      navigate(`/edit-event/${id}`);
    }
  };

  const handleDeleteEvent = async () => {
    if (!id) return;

    try {
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

  const getOrgInitial = () => {
    return organization ? organization.charAt(0).toUpperCase() : '?';
  };

  const renderCauseAreas = () => {
    if (!causeArea) return null;
    
    const causes = causeArea.split(',').map(cause => cause.trim()).filter(Boolean);
    
    return causes.map((cause, index) => (
      <span key={`${id}-cause-${index}`}>
        <span 
          className="text-youth-blue cursor-pointer hover:underline"
          onClick={handleCauseClick(cause)}
        >
          {cause}
        </span>
        {index < causes.length - 1 && <span className="text-youth-charcoal/60">, </span>}
      </span>
    ));
  };

  return (
    <div 
      className="glass-panel hover:shadow-lg transition-all duration-300 overflow-hidden relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isEventAuthor && (
        <div className="absolute top-2 right-2 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 rounded-full hover:bg-gray-200 transition-colors">
                <MoreVertical className="h-5 w-5 text-youth-charcoal/70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={handleEditEvent} className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setIsDeleteDialogOpen(true)} 
                className="text-red-600 cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

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
            <span className="text-youth-charcoal/80">
              {renderCauseAreas()}
            </span>
          </div>
          
          <div className="flex flex-col gap-y-1 mt-3">
            <div className="flex items-center text-sm text-youth-charcoal/70">
              <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>{date}</span>
            </div>
            
            <div className="flex items-center text-sm text-youth-charcoal/70">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>{location}</span>
            </div>
            
            <div className="flex items-center text-sm mt-1">
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
          target="_blank"
          rel="noopener noreferrer"
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this event?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEvent}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default EventCard;
