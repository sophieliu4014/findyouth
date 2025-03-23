
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Loader2, Mail, Globe, Phone, Star, MapPin, ExternalLink, ArrowLeft } from 'lucide-react';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/Footer';
import { useOrganizationEvents } from '@/hooks';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { NonprofitHeader, NonprofitDetailsSection, EventsList } from '@/components/nonprofits';
import { useToast } from '@/components/ui/use-toast';

interface Nonprofit {
  id: string;
  organization_name: string;
  description: string;
  mission: string;
  location: string;
  profile_image_url: string | null;
  website: string | null;
  social_media: string;
  causes: string[];
  rating: number;
  email: string | null;
  phone: string | null;
}

const NonprofitProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [nonprofit, setNonprofit] = useState<Nonprofit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { events, isLoading: eventsLoading } = useOrganizationEvents(id || '');
  const { toast } = useToast();

  useEffect(() => {
    const fetchNonprofitData = async () => {
      if (!id) return;
      
      console.log(`Fetching nonprofit data for ID: ${id}`);
      setIsLoading(true);
      
      try {
        // First try to fetch from nonprofits table
        let { data: nonprofitData, error: nonprofitError } = await supabase
          .from('nonprofits')
          .select('*')
          .eq('id', id)
          .single();
          
        if (nonprofitError) {
          console.log(`No nonprofit found in nonprofits table with ID ${id}, error:`, nonprofitError);
          
          // If not found in nonprofits table, check if it's a user acting as organization
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();
            
          if (profileError) {
            console.error('Error fetching profile:', profileError);
            setIsLoading(false);
            return;
          }
          
          if (profileData) {
            // Get user metadata if available
            const { data: userMetadata } = await supabase.auth.getUser();
            
            // Use metadata if this is current user, otherwise use profile data
            const isCurrentUser = userMetadata?.user?.id === id;
            const organizationName = isCurrentUser && userMetadata?.user?.user_metadata?.organization_name
              ? userMetadata.user.user_metadata.organization_name
              : (profileData.full_name || 'Organization');
            
            // Create a nonprofit-like object from profile data
            // We explicitly set each property to ensure type correctness
            nonprofitData = {
              id: profileData.id,
              organization_name: organizationName,
              description: userMetadata?.user?.user_metadata?.description || 'No description available',
              mission: userMetadata?.user?.user_metadata?.mission || 'No mission statement available',
              location: userMetadata?.user?.user_metadata?.location || 'Location not specified',
              profile_image_url: profileData.avatar_url,
              website: userMetadata?.user?.user_metadata?.website || null,
              social_media: userMetadata?.user?.user_metadata?.social_media || '',
              email: userMetadata?.user?.email || null,
              phone: userMetadata?.user?.user_metadata?.phone || null,
              // Initialize with empty array, will be populated if needed
              causes: [],
              rating: 4 // Default rating
            };
            
            console.log('Created nonprofit-like object from profile data:', nonprofitData);
          }
        } else {
          // If this is a real nonprofit from the nonprofits table, 
          // we need to initialize the causes array to match our Nonprofit interface
          nonprofitData = {
            ...nonprofitData,
            causes: [] // Initialize with empty array
          };
        }
        
        if (!nonprofitData) {
          console.error('No nonprofit or profile data found for ID:', id);
          setIsLoading(false);
          return;
        }
        
        // Fetch causes if this is a real nonprofit
        let causes: string[] = [];
        if (nonprofitData && nonprofitData.organization_name !== 'Organization') {
          const { data: causesData, error: causesError } = await supabase
            .from('nonprofit_causes')
            .select('causes(name)')
            .eq('nonprofit_id', id);
            
          if (causesError) {
            console.error('Error fetching causes:', causesError);
          } else if (causesData) {
            causes = causesData.map(item => item.causes.name) || [];
          }
        }
        
        // Fetch ratings
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('rating')
          .eq('nonprofit_id', id);
          
        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError);
        }
        
        // Calculate average rating
        let avgRating = 4; // Default rating
        if (reviewsData && reviewsData.length > 0) {
          const sum = reviewsData.reduce((acc, review) => acc + review.rating, 0);
          avgRating = Math.round(sum / reviewsData.length);
        }
        
        // Create the final nonprofit object with all the required fields
        setNonprofit({
          ...nonprofitData,
          causes,
          rating: avgRating
        });
        
        toast({
          title: "Profile loaded",
          description: `Viewing profile for ${nonprofitData.organization_name}`,
        });
      } catch (error) {
        console.error('Error processing nonprofit data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNonprofitData();
  }, [id, toast]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="page-container">
          <div className="flex justify-center items-center min-h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-youth-blue" />
            <span className="ml-2 text-youth-charcoal">Loading nonprofit details...</span>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!nonprofit) {
    return (
      <>
        <Navbar />
        <main className="page-container">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-youth-charcoal mb-4">Nonprofit not found</h2>
            <p className="mb-6">The nonprofit you're looking for doesn't exist or has been removed.</p>
            <Link to="/find-activities">
              <Button variant="default">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Activities
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{nonprofit.organization_name} | FindYOUth</title>
        <meta name="description" content={nonprofit.description.substring(0, 160)} />
      </Helmet>

      <Navbar />

      <main className="page-container">
        <NonprofitHeader title={nonprofit.organization_name} />
        
        <NonprofitDetailsSection nonprofit={nonprofit} />
        
        <EventsList 
          title={`Events by ${nonprofit.organization_name}`}
          events={events} 
          isLoading={eventsLoading} 
        />
      </main>

      <Footer />
    </>
  );
};

export default NonprofitProfile;
