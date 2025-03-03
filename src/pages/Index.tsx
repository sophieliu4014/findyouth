
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/navbar/Navbar';
import Hero from '../components/home/Hero';
import CauseAreas from '../components/home/CauseAreas';
import HowItWorks from '../components/home/HowItWorks';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>FindYOUth - Connect Youth with Volunteer Opportunities</title>
        <meta name="description" content="FindYOUth connects youth-led nonprofits with passionate volunteers across Greater Vancouver." />
      </Helmet>
      
      <Navbar />
      
      <main>
        <Hero />
        <CauseAreas />
        <HowItWorks />
      </main>
      
      <Footer />
    </>
  );
};

export default Index;
