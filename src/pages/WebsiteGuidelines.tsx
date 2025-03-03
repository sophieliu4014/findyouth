
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/Footer';
import { Check, Info, AlertTriangle, X } from 'lucide-react';

const WebsiteGuidelines = () => {
  return (
    <>
      <Helmet>
        <title>Website Guidelines - FindYOUth</title>
        <meta name="description" content="Guidelines for using the FindYOUth platform to post volunteer opportunities." />
      </Helmet>
      
      <Navbar />
      
      <main className="page-container">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-youth-charcoal mb-16">Website Guidelines</h1>
          
          <div className="space-y-10">
            <div className="glass-panel p-6">
              <div className="flex items-start">
                <div className="bg-youth-purple/20 p-3 rounded-full mr-4">
                  <Check className="h-6 w-6 text-youth-purple" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-youth-charcoal">Eligibility to Post:</h2>
                  <p className="text-lg text-youth-charcoal/80 mt-1">Students, teachers or organizations must be verified in order to ensure legitimacy</p>
                </div>
              </div>
            </div>
            
            <div className="glass-panel p-6">
              <div className="flex items-start">
                <div className="bg-youth-blue/20 p-3 rounded-full mr-4">
                  <Info className="h-6 w-6 text-youth-blue" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-youth-charcoal">Accuracy of Information:</h2>
                  <p className="text-lg text-youth-charcoal/80 mt-1">All posts must include relevant information, including but not limited to:</p>
                  <ul className="mt-3 space-y-1 text-lg text-youth-charcoal/80 list-disc list-inside ml-4">
                    <li>Title (e.g. description of event)</li>
                    <li>Date (Starting Time & End Time)</li>
                    <li>Location</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="glass-panel p-6">
              <div className="flex items-start">
                <div className="bg-youth-purple/20 p-3 rounded-full mr-4">
                  <AlertTriangle className="h-6 w-6 text-youth-purple" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-youth-charcoal">Unpaid Opportunities:</h2>
                  <p className="text-lg text-youth-charcoal/80 mt-1">Monetary compensation for volunteer activities is strictly prohibited</p>
                </div>
              </div>
            </div>
            
            <div className="glass-panel p-6">
              <div className="flex items-start">
                <div className="bg-red-500/20 p-3 rounded-full mr-4">
                  <X className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-youth-charcoal">No Spamming:</h2>
                  <p className="text-lg text-youth-charcoal/80 mt-1">Duplicate and irrelevant posts are forbidden</p>
                </div>
              </div>
            </div>
            
            <div className="glass-panel p-6">
              <div className="flex items-start">
                <div className="bg-youth-blue/20 p-3 rounded-full mr-4">
                  <Info className="h-6 w-6 text-youth-blue" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-youth-charcoal">Be Honest:</h2>
                  <p className="text-lg text-youth-charcoal/80 mt-1">All users must provide truthful and accurate information – misleading info can be reported</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default WebsiteGuidelines;
