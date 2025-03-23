
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/Footer';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { fetchNonprofitData } from '@/hooks/utils/nonprofit-utils';
import {
  EventHeader,
  EventDescription,
  EventResources,
  EventImage,
  EventDetails,
  EventNotFound
} from '@/components/events/detail';

interface EventDetails {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  start_time?: string;
  end_time?: string;
  end_date?: string;
  cause_area?: string;
  image_url?: string;
  signup_form_url?: string;
  attached_links?: string;
  city?: string;
  state?: string;
  zip?: string;
  application_deadline?: string;
  nonprofit_id: string;
  created_at?: string;
}

interface OrganizationInfo {
  name: string;
  profileImage?: string;
  description?: string;
  location?: string;
  bannerImageUrl?: string;
}

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [organization, setOrganization] = useState<OrganizationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEventData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const { data: eventData, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        if (eventData) {
          setEvent(eventData);
          
          if (eventData.nonprofit_id) {
            try {
              const orgData = await fetchNonprofitData(eventData.nonprofit_id);
              setOrganization(orgData);
            } catch (orgError) {
              console.error('Error fetching organization data:', orgError);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        toast({
          title: "Error loading event",
          description: "There was a problem fetching the event details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEventData();
  }, [id, toast]);

  const handleApply = () => {
    setIsApplying(true);
    
    if (event?.signup_form_url) {
      window.open(event.signup_form_url, '_blank', 'noopener,noreferrer');
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

  return (
    <>
      <Helmet>
        <title>{event?.title || 'Event Details'} | FindYOUth</title>
        <meta 
          name="description" 
          content={event?.description?.substring(0, 160) || 'View details about this volunteer opportunity'} 
        />
      </Helmet>

      <Navbar />

      <main className="page-container max-w-5xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="h-8 w-8 border-4 border-youth-blue border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-youth-charcoal">Loading event details...</span>
          </div>
        ) : event ? (
          <>
            <div className="mb-8">
              <Link 
                to="/find-activities" 
                className="inline-flex items-center text-youth-blue hover:text-youth-purple"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Activities
              </Link>
            </div>

            <EventHeader event={event} organization={organization} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="md:col-span-2 space-y-6">
                <EventDescription 
                  description={event.description} 
                  causeArea={event.cause_area} 
                />
                
                <EventResources attachedLinks={event.attached_links} />
                
                {/* Event image component at the bottom */}
                <EventImage imageUrl={event.image_url} title={event.title} />
              </div>
              
              <div className="space-y-6">
                <EventDetails 
                  event={event}
                  organization={organization}
                  onApply={handleApply}
                  isApplying={isApplying}
                />
              </div>
            </div>
          </>
        ) : (
          <EventNotFound />
        )}
      </main>

      <Footer />
    </>
  );
};

export default EventDetail;
