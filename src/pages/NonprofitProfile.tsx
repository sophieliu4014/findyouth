
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Loader2, ArrowLeft } from 'lucide-react';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/Footer';
import { useOrganizationEvents } from '@/hooks';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { NonprofitHeader, NonprofitDetailsSection, EventsList } from '@/components/nonprofits';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/lib/auth';
import { ensureNonprofitProfile } from '@/integrations/supabase/auth';

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
  const { user } = useAuthStore();
  
  // Check if this is the current user's profile
  const isCurrentUserProfile = user?.id === id;

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
          
          // If this is the current user's profile, ensure nonprofit profile without showing errors
          if (isCurrentUserProfile) {
            console.log("This is the current user's profile, ensuring nonprofit profile");
            const success = await ensureNonprofitProfile();
            
            // Fetch again to see if profile was created
            const { data: refreshedData, error: refreshError } = await supabase
              .from('nonprofits')
              .select('*')
              .eq('id', id)
              .single();
              
            if (!refreshError && refreshedData) {
              nonprofitData = refreshedData;
              console.log("Successfully created and fetched nonprofit profile:", nonprofitData);
            } else {
              console.log("Falling back to user metadata");
            }
          }
          
          if (!nonprofitData && profileData) {
            // For the current user, use their metadata
            let organizationName = profileData.full_name || 'Organization';
            let description = 'No description available';
            let mission = 'No mission statement available';
            let location = 'Location not specified';
            let website = null;
            let socialMedia = '';
            let email = null;
            let phone = null;
            let profileImageUrl = profileData.avatar_url;
            
            // If this is the current user, we can use their metadata
            if (isCurrentUserProfile && user?.user_metadata) {
              const metadata = user.user_metadata;
              if (metadata.organization_name) {
                organizationName = metadata.organization_name;
              }
              
              if (metadata.nonprofit_data) {
                description = metadata.nonprofit_data.description || description;
                mission = metadata.nonprofit_data.mission || mission;
                location = metadata.nonprofit_data.location || location;
                website = metadata.nonprofit_data.website || website;
                socialMedia = metadata.nonprofit_data.socialMedia || socialMedia;
                email = user.email || email;
                phone = metadata.nonprofit_data.phone || phone;
                profileImageUrl = metadata.nonprofit_data.profileImageUrl || profileImageUrl;
              }
            }
            
            // Create a nonprofit-like object from profile data
            nonprofitData = {
              id: profileData.id,
              organization_name: organizationName,
              description: description,
              mission: mission,
              location: location,
              profile_image_url: profileImageUrl,
              website: website,
              social_media: socialMedia,
              email: email,
              phone: phone,
              created_at: profileData.updated_at || new Date().toISOString(),
              updated_at: profileData.updated_at || new Date().toISOString()
            };
            
            console.log('Created nonprofit-like object from profile data:', nonprofitData);
          }
        }
        
        if (!nonprofitData) {
          console.error('No nonprofit or profile data found for ID:', id);
          setIsLoading(false);
          return;
        }
        
        // Fetch causes if this is a real nonprofit
        let causes: string[] = [];
        if (nonprofitData) {
          // First check nonprofit_causes table
          const { data: causesData, error: causesError } = await supabase
            .from('nonprofit_causes')
            .select('causes(name)')
            .eq('nonprofit_id', id);
            
          if (causesError) {
            console.error('Error fetching causes:', causesError);
          } else if (causesData && causesData.length > 0) {
            causes = causesData.map(item => item.causes.name) || [];
          } 
          // If no causes found in table and this is current user, try to get from metadata
          else if (isCurrentUserProfile && user?.user_metadata?.nonprofit_data?.causes) {
            causes = user.user_metadata.nonprofit_data.causes || [];
            console.log("Using causes from user metadata:", causes);
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
        
        // Create a proper Nonprofit object with the correct interface
        const finalNonprofit: Nonprofit = {
          id: nonprofitData.id,
          organization_name: nonprofitData.organization_name,
          description: nonprofitData.description,
          mission: nonprofitData.mission,
          location: nonprofitData.location,
          profile_image_url: nonprofitData.profile_image_url,
          website: nonprofitData.website,
          social_media: nonprofitData.social_media,
          email: nonprofitData.email,
          phone: nonprofitData.phone,
          causes: causes,
          rating: avgRating
        };
        
        setNonprofit(finalNonprofit);
        
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
  }, [id, toast, user, isCurrentUserProfile]);

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
        <title>{nonprofit?.organization_name || 'Organization'} | FindYOUth</title>
        <meta name="description" content={nonprofit?.description?.substring(0, 160) || 'Organization profile'} />
      </Helmet>

      <Navbar />

      <main className="page-container">
        <NonprofitHeader title={nonprofit?.organization_name || 'Organization'} />
        
        {nonprofit && <NonprofitDetailsSection nonprofit={nonprofit} />}
        
        <EventsList 
          title={`Events by ${nonprofit?.organization_name || 'Organization'}`}
          events={events} 
          isLoading={eventsLoading} 
        />
      </main>

      <Footer />
    </>
  );
};

export default NonprofitProfile;
