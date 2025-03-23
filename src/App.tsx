import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from './pages/Index';
import FindActivities from './pages/FindActivities';
import Contact from './pages/Contact';
import OurStory from './pages/OurStory';
import WebsiteGuidelines from './pages/WebsiteGuidelines';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NgoLogin from './pages/NgoLogin';
import RegisterNgo from './pages/RegisterNgo';
import Profile from './pages/Profile';
import NonprofitProfile from './pages/NonprofitProfile';
import CauseEvents from './pages/CauseEvents';
import NotFound from './pages/NotFound';
import OurInstagram from './pages/OurInstagram';
import { AuthProvider } from './components/auth/AuthProvider';
import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';
import { seedEvents } from './utils/seedEvents';

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    seedEvents();
  }, []);

  return (
    <div>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="light">
            <AuthProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/find-activities" element={<FindActivities />} />
                  <Route path="/register-ngo" element={<RegisterNgo />} />
                  <Route path="/our-story" element={<OurStory />} />
                  <Route path="/our-instagram" element={<OurInstagram />} />
                  <Route path="/website-guidelines" element={<WebsiteGuidelines />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/ngo-login" element={<NgoLogin />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/nonprofit/:id" element={<NonprofitProfile />} />
                  <Route path="/cause/:causeName" element={<CauseEvents />} />
                  <Route path="/create-event" element={<CreateEvent />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </BrowserRouter>
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </div>
  );
}

export default App;
