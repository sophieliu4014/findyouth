
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/Footer';

const OurStory = () => {
  return (
    <>
      <Helmet>
        <title>Our Story - FindYOUth</title>
        <meta name="description" content="Learn about the story and mission behind FindYOUth." />
      </Helmet>
      
      <Navbar />
      
      <main className="page-container">
        <div className="max-w-4xl mx-auto">
          <h1 className="section-title text-center mb-8 animate-fade-in">Our Story</h1>
          
          <div className="glass-panel p-8 md:p-10 rounded-2xl shadow-elevated animate-slide-up">
            <p className="text-xl leading-relaxed text-youth-charcoal/90 mb-10">
              FindYouth was founded by five students from West Point Grey Academy. Based in Vancouver, 
              we share a single goal: to make finding volunteer opportunities easier. By connecting youth 
              with meaningful causes, we aim to inspire students and educators to contribute to our community.
            </p>
            
            <div className="mt-12 flex justify-center">
              <img 
                src="/lovable-uploads/fa82e076-0772-4750-9dcf-c281180d4388.png" 
                alt="FindYouth Team" 
                className="rounded-2xl shadow-elevated max-w-full h-auto max-h-96 object-cover hover:shadow-hover transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default OurStory;
