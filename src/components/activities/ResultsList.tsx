
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import EventCard from '../EventCard';
import { seedEvents } from '@/utils/seedEvents';
import { Event } from '@/hooks/types/event-types'; // Import from correct location
import { useAuthStore } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';
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

interface ResultsListProps {
  events: Event[];
  isLoading: boolean;
  onEventDeleted?: () => void;
}

const ResultsList = ({ events, isLoading, onEventDeleted }: ResultsListProps) => {
  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Seed events if none are found
  useEffect(() => {
    if (!isLoading && events.length === 0) {
      console.log('No events found, seeding events...');
      seedEvents();
    }
  }, [events, isLoading]);

  const handleDeleteEvent = async (eventId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to delete an event",
        variant: "destructive",
      });
      return;
    }

    // Store the ID and open the confirmation dialog
    setEventToDelete(eventId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventToDelete)
        .eq('author_id', user?.id); // Security check to ensure only author can delete

      if (error) {
        throw error;
      }

      toast({
        title: "Event deleted",
        description: "The event has been successfully deleted",
      });

      // Call the onEventDeleted callback to refresh the list
      if (onEventDeleted) {
        onEventDeleted();
      }
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast({
        title: "Delete failed",
        description: `There was an error deleting the event: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-youth-blue" />
        <span className="ml-2 text-youth-charcoal">Loading events...</span>
      </div>
    );
  }
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {events && events.length > 0 ? (
          events.map((event, index) => (
            <div 
              key={event.id} 
              className="animate-slide-up" 
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <EventCard 
                id={event.id}
                title={event.title}
                organization={event.organization}
                date={event.date}
                location={event.location}
                causeArea={event.causeArea}
                rating={event.rating}
                imageUrl={event.imageUrl}
                profileImage={event.profileImage}
                organizationId={event.organizationId}
                registrationLink={event.registrationLink}
                authorId={event.authorId}
                onDelete={handleDeleteEvent}
              />
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-12 glass-panel animate-fade-in">
            <h3 className="text-xl font-medium text-youth-charcoal mb-2">No events found</h3>
            <p className="text-youth-charcoal/70">
              Try adjusting your filters or search criteria to find volunteer opportunities.
            </p>
            <button 
              className="mt-4 px-4 py-2 bg-youth-purple text-white rounded-md hover:bg-youth-purple/90 transition-colors"
              onClick={() => seedEvents().then(() => window.location.reload())}
            >
              Generate Sample Data
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this event?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The event will be permanently removed from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ResultsList;
