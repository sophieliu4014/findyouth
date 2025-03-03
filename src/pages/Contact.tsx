
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/Footer';
import { Mail } from 'lucide-react';

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us - FindYOUth</title>
        <meta name="description" content="Contact FindYOUth for inquiries and questions." />
      </Helmet>
      
      <Navbar />
      
      <main className="page-container">
        <div className="max-w-4xl mx-auto">
          <h1 className="section-title text-center mb-10">Contact Us</h1>
          
          <div className="glass-panel p-8 rounded-xl text-center">
            <div className="flex flex-col items-center justify-center mb-6">
              <Mail className="h-16 w-16 text-youth-blue mb-4" />
              <p className="text-xl leading-relaxed text-youth-charcoal/90">
                For inquiries and questions, contact{' '}
                <a 
                  href="mailto:findyouthbc@gmail.com" 
                  className="text-youth-blue hover:text-youth-purple transition-colors font-medium"
                >
                  findyouthbc@gmail.com
                </a>
              </p>
            </div>
            
            <div className="mt-12 p-6 bg-youth-softgray rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-youth-charcoal">Response Time</h2>
              <p className="text-youth-charcoal/80">
                We strive to respond to all inquiries within 48 hours during regular business days.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Contact;
