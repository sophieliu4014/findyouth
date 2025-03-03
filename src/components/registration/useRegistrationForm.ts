
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import { signUpWithEmail, createNonprofitProfile, uploadProfileImage } from '@/integrations/supabase/auth';
import { formSchema, FormValues } from './RegistrationTypes';

export const useRegistrationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const { toast } = useToast();
  
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

  const resetForm = () => {
    form.reset();
    setProfileImage(null);
    setIsSuccess(false);
  };

  const handleSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    if (!profileImage) {
      setImageError("Profile picture is required");
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Get a fresh reCAPTCHA token before submission
      let token = null;
      const RECAPTCHA_SITE_KEY = '6Lcsw-cqAAAAAK5mQ32_PtlyuPQkw_MKPc8fjFY7';
      
      if (window.grecaptcha) {
        try {
          token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'submit_ngo_registration' });
          setRecaptchaToken(token);
          console.log('reCAPTCHA token for submission:', token.substring(0, 10) + '...');
        } catch (recaptchaError) {
          console.error('Error getting reCAPTCHA token:', recaptchaError);
          toast({
            title: "reCAPTCHA verification failed",
            description: "Please try again or contact support if the issue persists.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }
      
      // Step 1: Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await signUpWithEmail(
        data.email,
        data.password,
        { 
          organization_name: data.organizationName,
          recaptcha_token: token // Pass the token to your backend
        }
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

  return {
    form,
    isSubmitting,
    isSuccess,
    profileImage,
    setProfileImage,
    imageError,
    setImageError,
    resetForm,
    handleSubmit: form.handleSubmit(handleSubmit)
  };
};
