
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/Footer';
import { ActivitySearch } from '../components/activities';

const FindActivities = () => {
  const location = useLocation();
  const initialState = {
    address: '',
    keyword: '',
    location: '',
    cause: ''
  };

  // Extract search params from location state
  if (location.state) {
    if (location.state.address) {
      initialState.address = location.state.address;
    }
    if (location.state.keyword) {
      initialState.keyword = location.state.keyword;
    }
    if (location.state.location) {
      initialState.location = location.state.location;
    }
    if (location.state.cause) {
      initialState.cause = location.state.cause;
    }
  }

  return (
    <>
      <Helmet>
        <title>Find Activities | FindYOUth</title>
        <meta name="description" content="Discover volunteer opportunities with youth-led nonprofits across Greater Vancouver." />
      </Helmet>
      
      <Navbar />
      
      <main className="page-container">
        <ActivitySearch 
          initialAddress={initialState.address}
          initialKeyword={initialState.keyword}
          initialLocation={initialState.location}
          initialCause={initialState.cause}
        />
      </main>
      
      <Footer />
    </>
  );
};

export default FindActivities;
