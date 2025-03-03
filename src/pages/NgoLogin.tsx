
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/Footer';
import NgoLoginForm from '@/components/auth/NgoLoginForm';

const NgoLogin = () => {
  return (
    <>
      <Helmet>
        <title>NGO Login | FindYOUth</title>
        <meta name="description" content="Log in to your youth-led nonprofit organization account to post volunteer opportunities." />
      </Helmet>
      
      <Navbar />
      
      <main className="min-h-screen flex items-center justify-center bg-youth-softgray py-16">
        <div className="max-w-md w-full mx-auto px-4 sm:px-6">
          <NgoLoginForm />
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default NgoLogin;
