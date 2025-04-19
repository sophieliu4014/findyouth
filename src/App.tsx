
import React, { useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import './App.css';
import { 
  Index as Home,
  FindActivities,
  RegisterNgo,
  OurStory,
  OurInstagram,
  WebsiteGuidelines,
  Contact,
  Login,
  Signup,
  Profile,
  NonprofitProfile,
  CauseEvents,
  NotFound,
  CreateEvent,
  ForgotPassword,
  ResetPassword
} from './pages';
import EventDetail from './pages/EventDetail';
import EditEvent from './pages/EditEvent';
import { initializeAuthListener } from './lib/auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';

// Create a wrapper component that handles scrolling
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/find-activities",
    element: <FindActivities />,
  },
  {
    path: "/register-ngo",
    element: <RegisterNgo />,
  },
  {
    path: "/website-guidelines",
    element: <WebsiteGuidelines />,
  },
  {
    path: "/our-story",
    element: <OurStory />,
  },
  {
    path: "/our-instagram",
    element: <OurInstagram />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/create-event",
    element: <CreateEvent />,
  },
  {
    path: "/edit-event/:id",
    element: <EditEvent />,
  },
  {
    path: "/cause/:cause",
    element: <CauseEvents />,
  },
  {
    path: "/nonprofit/:id",
    element: <NonprofitProfile />,
  },
  {
    path: "/organization/:name",
    element: <NonprofitProfile />,
  },
  {
    path: "/event/:id",
    element: <EventDetail />,
  },
  {
    path: "*",
    element: <NotFound />,
  }
]);

const queryClient = new QueryClient();

function App() {
  initializeAuthListener();

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider 
          router={router} 
          // Add this to ensure ScrollToTop is used
          fallbackElement={<ScrollToTop />}
        />
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
