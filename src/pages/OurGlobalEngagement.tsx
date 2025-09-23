import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/Footer';
import { supabase } from '@/integrations/supabase/client';

const OurGlobalEngagement = () => {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const getImageUrl = async () => {
      const { data } = supabase.storage
        .from('FindYouth Website Images')
        .getPublicUrl('Screenshot 2025-09-23 at 12.38.17 PM.png');
      setImageUrl(data.publicUrl);
    };
    getImageUrl();
  }, []);

  return (
    <>
      <Helmet>
        <title>Our Global Engagement - FindYOUth</title>
        <meta name="description" content="Learn about FindYouth's global engagement initiatives and youth empowerment framework." />
      </Helmet>
      
      <Navbar />
      
      <main className="page-container">
        <div className="max-w-4xl mx-auto">
          <h1 className="section-title text-center mb-8 animate-fade-in">Our Global Engagement</h1>
          
          <div className="glass-panel p-8 md:p-10 rounded-2xl shadow-elevated animate-slide-up space-y-10">
            {/* UN HLPF Section */}
            <section>
              <h2 className="text-2xl font-bold text-youth-charcoal mb-4">
                Representing Youth Voices at UN HLPF 2025
              </h2>
              <p className="text-lg leading-relaxed text-youth-charcoal/90">
                In July 2025, Sophie Liu, the founder of FindYouth was invited to attend the United Nations High-Level Political Forum (HLPF) New York City, joining global leaders, youth delegates, and changemakers to advance the 2030 Agenda.
              </p>
            </section>

            {/* Framework Image */}
            <div className="flex justify-center">
              {imageUrl && (
                <img 
                  src={imageUrl} 
                  alt="FindYouth Framework: 80 Ways Youth Can Maximize Their Potential from Passion to Productivity showing statistics: 5+ Think Tanks, 21.2K+ Impressions, 450+ Youth, 3+ Universities, 37 Countries, 3+ Partners" 
                  className="rounded-2xl shadow-elevated max-w-full h-auto hover:shadow-hover transition-all duration-300"
                />
              )}
            </div>

            {/* Framework Section */}
            <section>
              <h2 className="text-2xl font-bold text-youth-charcoal mb-4">
                The FindYouth Framework: 8 Pillars of Youth Empowerment
              </h2>
              <p className="text-lg font-medium text-youth-purple mb-6 italic">
                "Empowering Youth to Rise—One Pillar at a Time."
              </p>
              
              <div className="space-y-6 text-lg leading-relaxed text-youth-charcoal/90">
                <p>
                  At FindYouth, we believe that leadership isn't just a title—it's a mindset that grows through community, creativity, and connection. That's why we've developed the FindYouth Framework, built on 8 core "P" Pillars that guide how youth can explore impact, purpose, and growth.
                </p>
                
                <p>
                  From Passion to Productivity, each pillar is paired with 10 actionable ideas—designed to help young people take initiative, lead authentically, and build real-world skills that last. Whether you're just getting started or looking for your next step, this framework is a practical launchpad for youth-led change.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default OurGlobalEngagement;