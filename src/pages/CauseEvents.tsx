
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/Footer';
import { useCauseEvents } from '@/hooks';
import EventCard from '@/components/EventCard';
import { Button } from '@/components/ui/button';

const CauseEvents = () => {
  const { cause } = useParams<{ cause: string }>();
  const decodedCause = cause ? decodeURIComponent(cause) : '';
  const { events, isLoading } = useCauseEvents(decodedCause);

  return (
    <>
      <Helmet>
        <title>{decodedCause} Volunteer Activities | FindYOUth</title>
        <meta 
          name="description" 
          content={`Discover volunteer opportunities in ${decodedCause} with youth-led nonprofits across Greater Vancouver.`} 
        />
      </Helmet>

      <Navbar />

      <main className="page-container">
        <div className="mb-8">
          <Link 
            to="/find-activities" 
            className="inline-flex items-center text-youth-blue hover:text-youth-purple"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Activities
          </Link>
        </div>

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-youth-charcoal mb-4 animate-fade-in">
            {decodedCause} Volunteer Activities
          </h1>
          <p className="text-youth-charcoal/80 max-w-3xl mx-auto mb-8 animate-fade-in">
            Browse volunteer opportunities related to {decodedCause.toLowerCase()} causes with youth-led nonprofits
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="h-8 w-8 border-4 border-youth-blue border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-youth-charcoal">Loading events...</span>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {events.map((event, index) => (
              <div 
                key={event.id} 
                className="animate-slide-up" 
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <EventCard {...event} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass-panel">
            <h3 className="text-xl font-medium text-youth-charcoal mb-2">No events found</h3>
            <p className="text-youth-charcoal/70 mb-6">
              There are currently no activities for {decodedCause.toLowerCase()} causes.
            </p>
            <Link to="/find-activities">
              <Button variant="default">
                View All Activities
              </Button>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};

export default CauseEvents;
