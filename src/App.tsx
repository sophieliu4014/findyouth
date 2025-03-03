
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import AuthProvider from "@/components/auth/AuthProvider";

import Index from "./pages/Index";
import FindActivities from "./pages/FindActivities";
import NgoLogin from "./pages/NgoLogin";
import WebsiteGuidelines from "./pages/WebsiteGuidelines";
import RegisterNgo from "./pages/RegisterNgo";
import OurStory from "./pages/OurStory";
import OurInstagram from "./pages/OurInstagram";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/find-activities" element={<FindActivities />} />
              <Route path="/ngo-login" element={<NgoLogin />} />
              <Route path="/website-guidelines" element={<WebsiteGuidelines />} />
              <Route path="/find-volunteers" element={<RegisterNgo />} />
              <Route path="/register-ngo" element={<RegisterNgo />} />
              <Route path="/our-story" element={<OurStory />} />
              <Route path="/our-instagram" element={<OurInstagram />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
