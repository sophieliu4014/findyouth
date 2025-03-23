
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Loader2, Mail, Globe, Phone, Star, MapPin, ExternalLink } from 'lucide-react';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/Footer';
import { useOrganizationEvents } from '@/hooks';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { NonprofitHeader, NonprofitDetailsSection, EventsList } from '@/components/nonprofits';

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

  useEffect(() => {
    const fetchNonprofitData = async () => {
      if (!id) return;
      
      try {
        // Fetch nonprofit details with all fields
        const { data: nonprofitData, error: nonprofitError } = await supabase
          .from('nonprofits')
          .select('*')
          .eq('id', id)
          .single();
          
        if (nonprofitError) {
          console.error('Error fetching nonprofit:', nonprofitError);
          return;
        }
        
        // Fetch causes
        const { data: causesData, error: causesError } = await supabase
          .from('nonprofit_causes')
          .select('causes(name)')
          .eq('nonprofit_id', id);
          
        if (causesError) {
          console.error('Error fetching causes:', causesError);
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
        
        // Extract causes
        const causes = causesData?.map(item => item.causes.name) || [];
        
        setNonprofit({
          ...nonprofitData,
          causes,
          rating: avgRating
        });
      } catch (error) {
        console.error('Error processing nonprofit data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNonprofitData();
  }, [id]);

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
        
        {/* Updated NonprofitDetailsSection with additional fields */}
        <div className="glass-panel mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image */}
            <div className="md:w-1/4">
              <div className="w-32 h-32 md:w-full md:h-64 bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={nonprofit.profile_image_url || "https://via.placeholder.com/300"} 
                  alt={nonprofit.organization_name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Contact Information */}
              <div className="mt-4 space-y-2">
                {nonprofit.email && (
                  <a 
                    href={`mailto:${nonprofit.email}`}
                    className="flex items-center text-youth-blue hover:text-youth-purple transition-colors text-sm"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    {nonprofit.email}
                  </a>
                )}
                
                {nonprofit.phone && (
                  <a 
                    href={`tel:${nonprofit.phone}`}
                    className="flex items-center text-youth-blue hover:text-youth-purple transition-colors text-sm"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {nonprofit.phone}
                  </a>
                )}
                
                {nonprofit.website && (
                  <a 
                    href={nonprofit.website} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-youth-blue hover:text-youth-purple transition-colors text-sm"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Website
                  </a>
                )}
              </div>
            </div>

            {/* Nonprofit Details */}
            <div className="md:w-3/4">
              <h1 className="text-3xl font-bold text-youth-charcoal mb-2">
                {nonprofit.organization_name}
              </h1>

              <div className="flex items-center mb-4">
                <div className="flex mr-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < nonprofit.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                
                <div className="flex items-center text-youth-charcoal/70">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{nonprofit.location}</span>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-medium text-youth-charcoal mb-2">Cause Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {nonprofit.causes.map(cause => (
                    <Link 
                      key={cause} 
                      to={`/cause/${encodeURIComponent(cause)}`}
                      className="bg-youth-blue/10 text-youth-blue py-1 px-3 rounded-full text-sm hover:bg-youth-blue/20 transition-colors"
                    >
                      {cause}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-medium text-youth-charcoal mb-2">Description</h3>
                <p className="text-youth-charcoal/80">{nonprofit.description}</p>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-medium text-youth-charcoal mb-2">Mission</h3>
                <p className="text-youth-charcoal/80">{nonprofit.mission}</p>
              </div>

              <div className="flex flex-wrap gap-4">
                {nonprofit.social_media && (
                  <a 
                    href={nonprofit.social_media} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-youth-blue hover:text-youth-purple"
                  >
                    <ExternalLink className="mr-1 h-4 w-4" />
                    Social Media
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        
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
