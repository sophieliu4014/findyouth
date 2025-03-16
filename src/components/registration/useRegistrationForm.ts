
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
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
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
    },
  });

  const resetForm = () => {
    form.reset();
    setProfileImage(null);
    setCaptchaToken(null);
    setIsSuccess(false);
  };

  const handleCaptchaChange = (token: string | null) => {
    console.log("Captcha token received:", token ? "Token received" : "No token");
    setCaptchaToken(token);
    setCaptchaError(token ? null : "Please complete the captcha verification");
  };

  const handleSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    console.log("Starting registration submission process");
    
    // Check for required image
    if (!profileImage) {
      setImageError("Profile picture is required");
      setIsSubmitting(false);
      console.error("Profile picture is required but none was provided");
      return;
    }
    
    // Note: We're no longer checking for captcha token
    // It might be present if the user completes it, but we won't require it
    
    try {
      console.log("Form data ready for submission:", data.organizationName, data.email);
      
      // Step 1: Sign up the user with Supabase Auth
      console.log("Step 1: Creating user account with Supabase Auth");
      const { data: authData, error: authError } = await signUpWithEmail(
        data.email,
        data.password,
        { organization_name: data.organizationName },
        captchaToken // This is now optional in the auth.ts file
      );
      
      if (authError) {
        console.error("Auth error:", authError);
        throw new Error(authError.message);
      }
      
      if (!authData?.user?.id) {
        console.error("No user ID returned from auth signup");
        throw new Error("Failed to create user account - no user ID returned");
      }
      
      console.log("User created successfully with ID:", authData.user.id);
      
      // Step 2: Upload profile image with a unique identifier
      console.log("Step 2: Uploading profile image");
      let imageUrl;
      try {
        // Use organization name and timestamp as a unique identifier
        const identifier = `${data.organizationName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
        imageUrl = await uploadProfileImage(profileImage, identifier);
        
        if (!imageUrl) {
          console.error("No image URL returned after upload");
          throw new Error("Failed to get a valid image URL after upload");
        }
        console.log("Profile image uploaded successfully:", imageUrl);
      } catch (imageUploadError: any) {
        console.error("Profile image upload error:", imageUploadError);
        toast({
          title: "Profile image upload failed",
          description: imageUploadError.message || "Failed to upload profile image",
          variant: "destructive",
        });
        throw new Error("Failed to upload profile image: " + (imageUploadError.message || "Unknown error"));
      }
      
      // Step 3: Create nonprofit profile
      console.log("Step 3: Creating nonprofit profile");
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
        console.error("Profile creation error:", profileError);
        throw new Error(profileError.message);
      }
      
      console.log("Nonprofit profile created successfully:", nonprofit);
      
      // Success
      setIsSuccess(true);
      toast({
        title: "Registration submitted",
        description: "We'll review your information and contact you shortly.",
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      console.log("Registration submission process complete");
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
    captchaToken,
    captchaError,
    handleCaptchaChange,
    resetForm,
    handleSubmit: form.handleSubmit(handleSubmit)
  };
};
