
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import EventForm from '@/components/events/EventForm';
import { useAuthStore } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { checkAdminStatus, canManageEvent } from '@/hooks/utils/admin-utils';

const EditEvent = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [eventData, setEventData] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is authenticated and is the event author or an admin
  useEffect(() => {
    const checkAuthAndFetchEvent = async () => {
      if (authLoading) return;

      if (!isAuthenticated) {
        toast({
          title: "Authentication required",
          description: "Please log in to edit events",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      if (!id) return;

      // Check if the user is an admin
      if (user?.id) {
        const adminStatus = await checkAdminStatus(user.id);
        setIsAdmin(adminStatus);
      }

      setIsLoading(true);
      try {
        const { data: eventData, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (eventData) {
          // Check if current user is the event author or an admin
          const hasPermission = canManageEvent(user?.id, eventData.nonprofit_id, isAdmin);
          
          if (hasPermission) {
            setEventData(eventData);
            setIsAuthorized(true);
          } else {
            toast({
              title: "Unauthorized",
              description: "You can only edit events that you created or as an admin",
              variant: "destructive",
            });
            navigate('/find-activities');
            return;
          }
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        toast({
          title: "Error loading event",
          description: "There was a problem fetching the event details.",
          variant: "destructive",
        });
        navigate('/find-activities');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchEvent();
  }, [id, isAuthenticated, authLoading, user, navigate, toast, isAdmin]);

  if (authLoading || isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-youth-blue" />
          <span className="ml-2">Loading...</span>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit Volunteer Event | FindYOUth</title>
        <meta name="description" content="Edit your volunteer event" />
      </Helmet>
      
      <Navbar />
      
      <main className="min-h-screen bg-youth-softgray py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="glass-panel p-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-youth-charcoal mb-6">Edit Volunteer Event</h1>
            <p className="text-youth-charcoal/80 mb-8">
              Update your volunteer opportunity details using the form below.
            </p>
            
            {isAuthorized && user && eventData && (
              <EventForm 
                userId={user.id} 
                initialData={eventData}
                isEditing={true}
              />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default EditEvent;
