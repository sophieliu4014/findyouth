
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import EventForm from '@/components/events/EventForm';
import { useAuthStore } from '@/lib/auth';

const CreateEvent = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Create Volunteer Event | FindYOUth</title>
        <meta name="description" content="Create a new volunteer event for your organization" />
      </Helmet>
      
      <Navbar />
      
      <main className="min-h-screen bg-youth-softgray py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="glass-panel p-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-youth-charcoal mb-6">Create Volunteer Event</h1>
            <p className="text-youth-charcoal/80 mb-8">
              Share your volunteer opportunity with the community! Fill out the form below to create a new event.
            </p>
            
            {user && <EventForm userId={user.id} />}
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default CreateEvent;
