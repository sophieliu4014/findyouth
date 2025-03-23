
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './App.css';
import Home from './pages/Index'; // Updated import path
import FindActivities from './pages/FindActivities';
import About from './pages/OurStory'; // Updated import path
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import CreateEvent from './pages/CreateEvent';
import CauseEvents from './pages/CauseEvents';
import NonprofitProfile from './pages/NonprofitProfile';
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
    path: "/about",
    element: <About />,
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
