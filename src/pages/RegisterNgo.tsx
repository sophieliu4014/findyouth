
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/Footer';
import RegistrationSuccess from '@/components/registration/RegistrationSuccess';
import RegistrationForm from '@/components/registration/RegistrationForm';
import { useRegistrationForm } from '@/components/registration/useRegistrationForm';

// List of supported cause areas
const causeAreas = [
  "Advocacy & Human Rights",
  "Education",
  "Sports",
  "Health",
  "Arts & Culture",
  "Environment",
  "Homeless",
  "Animals",
  "Youth",
  "Seniors",
  "Religion"
];

const RegisterNgo = () => {
  const {
    form,
    isSubmitting,
    isSuccess,
    profileImage,
    setProfileImage,
    imageError,
    setImageError,
    resetForm,
    handleSubmit
  } = useRegistrationForm();

  return (
    <>
      <Helmet>
        <title>Register Your NGO - FindYOUth</title>
        <meta name="description" content="Register your youth-led nonprofit organization with FindYOUth to connect with passionate volunteers." />
      </Helmet>
      
      <Navbar />
      
      <main className="page-container">
        <div className="max-w-3xl mx-auto">
          <h1 className="section-title text-center">Register Your NGO</h1>
          <p className="section-subtitle text-center">Join our community of youth-led nonprofit organizations making a difference across Greater Vancouver.</p>
          
          {isSuccess ? (
            <RegistrationSuccess resetForm={resetForm} />
          ) : (
            <RegistrationForm
              form={form}
              isSubmitting={isSubmitting}
              profileImage={profileImage}
              setProfileImage={setProfileImage}
              imageError={imageError}
              setImageError={setImageError}
              bannerImage={null}
              setBannerImage={() => {}}
              bannerImageError={null}
              setBannerImageError={() => {}}
              onSubmit={handleSubmit}
              causeAreas={causeAreas}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default RegisterNgo;
