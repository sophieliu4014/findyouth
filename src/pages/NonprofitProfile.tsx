
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Loader2 } from 'lucide-react';
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
        // Fetch nonprofit details
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
