
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, MapPin, Clock, User, ExternalLink, Star, Building } from 'lucide-react';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/Footer';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { fetchNonprofitData } from '@/hooks/utils/nonprofit-utils';

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
  bannerImageUrl?: string; // Added banner image URL field
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

  const getAttachedLinks = () => {
    if (!event?.attached_links) return [];
    return event.attached_links.split('\n').filter(link => link.trim().length > 0);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date not specified';
    return dateString;
  };

  const getOrgInitial = () => {
    return organization?.name ? organization.name.charAt(0).toUpperCase() : '?';
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

            <div className="mb-8 animate-fade-in">
              {/* Display organization banner at the top if available */}
              {organization?.bannerImageUrl && (
                <div className="w-full mb-6 rounded-lg overflow-hidden h-48 md:h-64">
                  <img 
                    src={organization.bannerImageUrl} 
                    alt={`${organization.name} banner`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">About This Opportunity</h2>
                    <p className="text-youth-charcoal whitespace-pre-line">{event.description}</p>
                    
                    {event.cause_area && (
                      <div className="mt-4">
                        <Link 
                          to={`/cause/${encodeURIComponent(event.cause_area)}`}
                          className="inline-block bg-youth-blue/10 text-youth-blue px-3 py-1 rounded-full text-sm hover:bg-youth-blue/20 transition-colors"
                        >
                          {event.cause_area}
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {getAttachedLinks().length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Additional Resources</h2>
                      <ul className="space-y-2">
                        {getAttachedLinks().map((link, index) => (
                          <li key={index}>
                            <a 
                              href={link.startsWith('http') ? link : `https://${link}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-youth-blue hover:text-youth-purple flex items-center"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              {link}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
                
                {/* Moved event image to below "Additional Resources" */}
                {event.image_url && (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Event Gallery</h2>
                      <div className="w-full flex justify-center">
                        <img 
                          src={event.image_url} 
                          alt={event.title} 
                          className="max-w-full rounded-lg max-h-[500px] object-contain"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Event Details</h2>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <Calendar className="h-5 w-5 mr-3 text-youth-blue flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Date</p>
                          <p>{formatDate(event.date)}</p>
                          {event.end_date && event.end_date !== event.date && (
                            <p>to {formatDate(event.end_date)}</p>
                          )}
                        </div>
                      </li>
                      
                      {(event.start_time || event.end_time) && (
                        <li className="flex items-start">
                          <Clock className="h-5 w-5 mr-3 text-youth-blue flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Time</p>
                            <p>
                              {event.start_time && `From ${event.start_time}`}
                              {event.end_time && event.start_time && ` to ${event.end_time}`}
                              {event.end_time && !event.start_time && `Until ${event.end_time}`}
                            </p>
                          </div>
                        </li>
                      )}
                      
                      <li className="flex items-start">
                        <MapPin className="h-5 w-5 mr-3 text-youth-blue flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Location</p>
                          <p>{event.location}</p>
                          {(event.city || event.state || event.zip) && (
                            <p>
                              {event.city && `${event.city}, `}
                              {event.state}
                              {event.zip && ` ${event.zip}`}
                            </p>
                          )}
                        </div>
                      </li>
                      
                      {event.application_deadline && (
                        <li className="flex items-start">
                          <User className="h-5 w-5 mr-3 text-youth-blue flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Application Deadline</p>
                            <p>{event.application_deadline}</p>
                          </div>
                        </li>
                      )}
                      
                      {organization && (
                        <li className="flex items-start">
                          <Building className="h-5 w-5 mr-3 text-youth-blue flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Hosted by</p>
                            <Link 
                              to={`/nonprofit/${event.nonprofit_id}`}
                              className="text-youth-purple hover:underline"
                            >
                              {organization.name}
                            </Link>
                            {organization.location && (
                              <p className="text-sm text-youth-charcoal/70">
                                {organization.location}
                              </p>
                            )}
                          </div>
                        </li>
                      )}
                    </ul>
                    
                    <Separator className="my-6" />
                    
                    <Button 
                      className="w-full bg-youth-blue hover:bg-youth-purple"
                      onClick={handleApply}
                      disabled={isApplying}
                    >
                      {isApplying ? 'Processing...' : 'Apply Now'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16 glass-panel">
            <h3 className="text-xl font-medium text-youth-charcoal mb-2">Event Not Found</h3>
            <p className="text-youth-charcoal/70 mb-6">
              The event you're looking for couldn't be found or has been removed.
            </p>
            <Link to="/find-activities">
              <Button variant="default">
                Browse All Activities
              </Button>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};

export default EventDetail;
