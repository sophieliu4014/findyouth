import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/Footer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import our components
import OrganizationInfoFields from '@/components/registration/OrganizationInfoFields';
import MissionFields from '@/components/registration/MissionFields';
import CauseSelectionField from '@/components/registration/CauseSelectionField';
import ProfileImageUpload from '@/components/registration/ProfileImageUpload';
import CaptchaVerification from '@/components/registration/CaptchaVerification';
import RegistrationSuccess from '@/components/registration/RegistrationSuccess';
import { formSchema, FormValues } from '@/components/registration/RegistrationTypes';

// Import Supabase auth functions
import { signUpWithEmail, createNonprofitProfile, uploadProfileImage } from '@/integrations/supabase/auth';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: "",
      password: "",
      email: "",
      phone: "",
      website: "",
      socialMedia: "",
      location: "",
      description: "",
      mission: "",
      causes: [],
      captchaVerified: false,
    },
  });

  useEffect(() => {
    form.reset({
      organizationName: "",
      password: "",
      email: "",
      phone: "",
      website: "",
      socialMedia: "",
      location: "",
      description: "",
      mission: "",
      causes: [],
      captchaVerified: false,
    });
  }, [form.reset]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    if (!profileImage) {
      setImageError("Profile picture is required");
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Step 1: Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await signUpWithEmail(
        data.email,
        data.password,
        { organization_name: data.organizationName }
      );
      
      if (authError) {
        throw new Error(authError.message);
      }
      
      // Step 2: Upload profile image
      const imageUrl = await uploadProfileImage(profileImage);
      
      if (!imageUrl) {
        throw new Error("Failed to upload profile image");
      }
      
      // Step 3: Create nonprofit profile
      const { nonprofit, error: profileError } = await createNonprofitProfile({
        organizationName: data.organizationName,
        email: data.email,
        phone: data.phone,
        website: data.website,
        socialMedia: data.socialMedia,
        location: data.location,
        description: data.description,
        mission: data.mission,
        profileImageUrl: imageUrl,
        causes: data.causes
      });
      
      if (profileError) {
        throw new Error(profileError.message);
      }
      
      // Success
      setIsSuccess(true);
      toast({
        title: "Registration submitted",
        description: "We'll review your information and contact you shortly.",
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    form.reset();
    setProfileImage(null);
    setIsSuccess(false);
  };

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
            <div className="glass-panel p-8 mt-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <OrganizationInfoFields control={form.control} />
                  <MissionFields control={form.control} />
                  <CauseSelectionField 
                    control={form.control} 
                    causeOptions={causeAreas} 
                  />
                  <ProfileImageUpload 
                    setProfileImage={setProfileImage} 
                    setImageError={setImageError}
                    imageError={imageError}
                  />
                  <CaptchaVerification control={form.control} />
                  
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full btn-primary hover:scale-[1.02] transition-transform"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Registration"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default RegisterNgo;
