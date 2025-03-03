
import { Check } from 'lucide-react';

const HowItWorks = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title text-center">How The Website Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-12">
          <div className="space-y-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-youth-purple text-white">
                  <Check className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-youth-charcoal">For Youth-Led Nonprofits</h3>
                <ul className="mt-2 text-youth-charcoal/80 space-y-2">
                  <li className="flex items-start">
                    <span className="text-youth-blue mr-2">•</span>
                    <span>Create an account and get verified</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-youth-blue mr-2">•</span>
                    <span>Post volunteer opportunities with detailed information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-youth-blue mr-2">•</span>
                    <span>Connect with passionate volunteers in your area</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-youth-blue mr-2">•</span>
                    <span>Build your organization's profile and credibility</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-youth-blue text-white">
                  <Check className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-youth-charcoal">For Volunteers</h3>
                <ul className="mt-2 text-youth-charcoal/80 space-y-2">
                  <li className="flex items-start">
                    <span className="text-youth-purple mr-2">•</span>
                    <span>Browse opportunities by cause area, location, or organization</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-youth-purple mr-2">•</span>
                    <span>Apply directly through the platform</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-youth-purple mr-2">•</span>
                    <span>Rate your volunteer experiences</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-youth-purple mr-2">•</span>
                    <span>Discover youth-led organizations making a difference</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="glass-panel p-8 h-full">
            <h3 className="text-xl font-semibold text-youth-charcoal mb-4">Event Posting Details</h3>
            <div className="space-y-4 text-youth-charcoal/80">
              <p>Each volunteer opportunity post includes:</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-youth-blue mr-2">•</span>
                  <span>Event title</span>
                </li>
                <li className="flex items-start">
                  <span className="text-youth-blue mr-2">•</span>
                  <span>Date, time, and location details</span>
                </li>
                <li className="flex items-start">
                  <span className="text-youth-blue mr-2">•</span>
                  <span>Application deadline</span>
                </li>
                <li className="flex items-start">
                  <span className="text-youth-blue mr-2">•</span>
                  <span>Cause area (e.g., education, environment)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-youth-blue mr-2">•</span>
                  <span>Event description (up to 300 words)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-youth-blue mr-2">•</span>
                  <span>Photos, social media links, and other resources</span>
                </li>
                <li className="flex items-start">
                  <span className="text-youth-blue mr-2">•</span>
                  <span>One-click "Apply Now" button</span>
                </li>
              </ul>
              <p className="mt-4">Organizations can also receive ratings from volunteers, helping build credibility and trust within the community.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
