
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import { signUpWithEmail, createNonprofitProfile, uploadProfileImage, uploadBannerImage } from '@/integrations/supabase/auth';
import { formSchema, FormValues } from './RegistrationTypes';

export const useRegistrationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerImageError, setBannerImageError] = useState<string | null>(null);
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
    setBannerImage(null);
    setIsSuccess(false);
  };

  const handleSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setImageError(null);
    setBannerImageError(null);
    console.log("Starting registration submission process");
    
    if (!profileImage) {
      setImageError("Profile picture is required");
      setIsSubmitting(false);
      console.error("Profile picture is required but none was provided");
      return;
    }
    
    try {
      console.log("Form data ready for submission:", data.organizationName, data.email);
      
      // Upload the profile image first
      console.log("Step 1: Uploading profile image");
      let imageUrl;
      try {
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
        throw imageUploadError;
      }
      
      // Upload banner image if provided
      let bannerImageUrl = null;
      if (bannerImage) {
        console.log("Step 1b: Uploading banner image");
        try {
          const identifier = `banner-${data.organizationName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
          bannerImageUrl = await uploadBannerImage(bannerImage, identifier);
          
          if (!bannerImageUrl) {
            console.error("No banner image URL returned after upload");
            throw new Error("Failed to get a valid banner image URL after upload");
          }
          console.log("Banner image uploaded successfully:", bannerImageUrl);
        } catch (bannerUploadError: any) {
          console.error("Banner image upload error:", bannerUploadError);
          toast({
            title: "Banner image upload failed",
            description: bannerUploadError.message || "Failed to upload banner image",
            variant: "destructive",
          });
          // Continue with registration even if banner upload fails
          bannerImageUrl = null;
        }
      }
      
      console.log("Step 2: Creating user account with Supabase Auth");
      // Store the image URLs in the nonprofit_data object
      const nonprofitData = {
        phone: data.phone,
        website: data.website,
        socialMedia: data.socialMedia,
        location: data.location,
        description: data.description,
        mission: data.mission,
        causes: data.causes,
        profileImageUrl: imageUrl,
        bannerImageUrl: bannerImageUrl
      };
      
      console.log("Nonprofit data with images:", nonprofitData);
      
      const { data: authData, error: authError } = await signUpWithEmail(
        data.email,
        data.password,
        { 
          organization_name: data.organizationName,
          nonprofit_data: nonprofitData
        }
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
      console.log("User metadata saved:", authData.user.user_metadata);
      
      setIsSuccess(true);
      toast({
        title: "Registration submitted",
        description: "Please check your email to confirm your account. Once confirmed, you can log in to complete your profile.",
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
    bannerImage,
    setBannerImage,
    bannerImageError,
    setBannerImageError,
    resetForm,
    handleSubmit: form.handleSubmit(handleSubmit)
  };
};
