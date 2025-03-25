import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Loader2, ArrowLeft } from 'lucide-react';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/Footer';
import { useOrganizationEvents } from '@/hooks';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { NonprofitHeader, NonprofitDetailsSection } from '@/components/nonprofits';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/lib/auth';
import { ensureNonprofitProfile } from '@/integrations/supabase/auth';
import { fetchNonprofitData } from '@/hooks/utils/nonprofit-utils';
import { categorizeEvents } from '@/utils/dateUtils';
import EventsList from '@/components/nonprofits/EventsList';

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
  banner_image_url?: string | null;
}

const NonprofitProfile = () => {
  const { id, name } = useParams<{ id?: string; name?: string }>();
  const [nonprofitId, setNonprofitId] = useState<string | null>(id || null);
  const [nonprofit, setNonprofit] = useState<Nonprofit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { events, isLoading: eventsLoading } = useOrganizationEvents(nonprofitId || '');
  const { toast } = useToast();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadNonprofitByName = async () => {
      if (!name) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('nonprofits')
          .select('id')
          .ilike('organization_name', name.replace(/-/g, ' '))
          .single();
          
        if (error || !data) {
          console.error('Error looking up nonprofit by name:', error);
          setError(`Nonprofit "${name.replace(/-/g, ' ')}" not found`);
          setIsLoading(false);
          return;
        }
        
        setNonprofitId(data.id);
      } catch (error) {
        console.error('Error in name lookup:', error);
        setError("Failed to find nonprofit by name");
        setIsLoading(false);
      }
    };
    
    if (name && !id) {
      loadNonprofitByName();
    }
  }, [name, id]);
  
  const isCurrentUserProfile = user?.id === nonprofitId;

  const { activeEvents, pastEvents } = categorizeEvents(events || []);

  useEffect(() => {
    const fetchData = async () => {
      if (!nonprofitId) {
        if (!name) {
          setError("No nonprofit identifier provided");
          setIsLoading(false);
        }
        return;
      }
      
      console.log(`Fetching nonprofit data for ID: ${nonprofitId}`);
      setIsLoading(true);
      
      try {
        const simplifiedData = await fetchNonprofitData(nonprofitId);
        
        if (simplifiedData) {
          let { data: nonprofitData, error: nonprofitError } = await supabase
            .from('nonprofits')
            .select('*')
            .eq('id', nonprofitId)
            .single();
            
          if (nonprofitError) {
            console.log(`No nonprofit found in nonprofits table with ID ${nonprofitId}, error:`, nonprofitError.message);
            
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', nonprofitId)
              .single();
              
            if (profileError) {
              console.log('Error fetching profile:', profileError.message);
            }
            
            if (isCurrentUserProfile) {
              console.log("This is the current user's profile, ensuring nonprofit profile");
              try {
                const success = await ensureNonprofitProfile();
                
                const { data: refreshedData, error: refreshError } = await supabase
                  .from('nonprofits')
                  .select('*')
                  .eq('id', nonprofitId)
                  .single();
                  
                if (!refreshError && refreshedData) {
                  nonprofitData = refreshedData;
                  console.log("Successfully created and fetched nonprofit profile:", nonprofitData);
                } else {
                  console.log("Falling back to user metadata");
                }
              } catch (ensureError) {
                console.error("Error ensuring nonprofit profile:", ensureError);
              }
            }
            
            if (!nonprofitData && profileData) {
              let organizationName = profileData.full_name || 'Organization';
              let description = 'No description available';
              let mission = 'No mission statement available';
              let location = 'Location not specified';
              let website = null;
              let socialMedia = '';
              let email = null;
              let phone = null;
              let profileImageUrl = profileData.avatar_url;
              let bannerImageUrl = null;
              
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
                  bannerImageUrl = metadata.nonprofit_data.bannerImageUrl || bannerImageUrl;
                }
              }
              
              nonprofitData = {
                id: profileData.id,
                organization_name: organizationName,
                description: description,
                mission: mission,
                location: location,
                profile_image_url: profileImageUrl,
                banner_image_url: bannerImageUrl,
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
            console.warn('No nonprofit or profile data found for ID:', nonprofitId);
            nonprofitData = {
              id: nonprofitId,
              organization_name: simplifiedData.name,
              description: simplifiedData.description,
              mission: "Mission not available",
              location: simplifiedData.location,
              profile_image_url: simplifiedData.profileImage,
              banner_image_url: simplifiedData.bannerImageUrl,
              website: null,
              social_media: "",
              email: null,
              phone: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
          }
          
          let causes: string[] = [];
          try {
            const { data: causesData, error: causesError } = await supabase
              .from('nonprofit_causes')
              .select('causes(name)')
              .eq('nonprofit_id', nonprofitId);
              
            if (causesError) {
              console.error('Error fetching causes:', causesError.message);
            } else if (causesData && causesData.length > 0) {
              causes = causesData.map(item => item.causes?.name).filter(Boolean) || [];
            } 
            else if (isCurrentUserProfile && user?.user_metadata?.nonprofit_data?.causes) {
              causes = user.user_metadata.nonprofit_data.causes || [];
              console.log("Using causes from user metadata:", causes);
            }
          } catch (causesError) {
            console.error('Error processing causes:', causesError);
          }
          
          let avgRating = 4;
          try {
            const { data: reviewsData, error: reviewsError } = await supabase
              .from('reviews')
              .select('rating')
              .eq('nonprofit_id', nonprofitId);
              
            if (reviewsError) {
              console.error('Error fetching reviews:', reviewsError.message);
            } else if (reviewsData && reviewsData.length > 0) {
              const sum = reviewsData.reduce((acc, review) => acc + review.rating, 0);
              avgRating = Math.round(sum / reviewsData.length);
            }
          } catch (reviewsError) {
            console.error('Error processing reviews:', reviewsError);
          }
          
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
            rating: avgRating,
            banner_image_url: nonprofitData.banner_image_url
          };
          
          setNonprofit(finalNonprofit);
          
          if (id && !name && nonprofitData.organization_name) {
            const nameSlug = nonprofitData.organization_name.toLowerCase().replace(/\s+/g, '-');
            navigate(`/organization/${nameSlug}`, { replace: true });
          }
          
          toast({
            title: "Profile loaded",
            description: `Viewing profile for ${nonprofitData.organization_name}`,
          });
        }
      } catch (error) {
        console.error('Error processing nonprofit data:', error);
        setError("Failed to load nonprofit data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [nonprofitId, toast, user, isCurrentUserProfile, name, navigate]);

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

  if (error) {
    return (
      <>
        <Navbar />
        <main className="page-container">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-youth-charcoal mb-4">Error Loading Profile</h2>
            <p className="mb-6">{error}</p>
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
        <NonprofitHeader 
          title={nonprofit?.organization_name || 'Organization'} 
          bannerImageUrl={nonprofit?.banner_image_url}
          nonprofitId={nonprofit?.id}
        />
        
        {nonprofit && <NonprofitDetailsSection nonprofit={nonprofit} />}
        
        <EventsList 
          title={`Ongoing Events by ${nonprofit?.organization_name || 'Organization'}`}
          events={activeEvents} 
          isLoading={eventsLoading} 
          emptyMessage="This organization doesn't have any upcoming events."
        />
        
        <div className="mt-10">
          <EventsList 
            title={`Past Events by ${nonprofit?.organization_name || 'Organization'}`}
            events={pastEvents} 
            isLoading={eventsLoading} 
            emptyMessage="This organization doesn't have any past events."
          />
        </div>
      </main>

      <Footer />
    </>
  );
};

export default NonprofitProfile;
