
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
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
  CreateEvent
} from './pages';
import EventDetail from './pages/EventDetail';
import { initializeAuthListener } from './lib/auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';

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
    path: "/cause/:cause",
    element: <CauseEvents />,
  },
  {
    path: "/nonprofit/:id",
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
        <RouterProvider router={router} />
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
