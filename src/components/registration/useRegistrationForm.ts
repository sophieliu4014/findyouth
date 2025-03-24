
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import { signUpWithEmail, createNonprofitProfile, uploadProfileImage, uploadBannerImage } from '@/integrations/supabase/auth';
import { formSchema, FormValues } from './RegistrationTypes';
import { supabase } from '@/integrations/supabase/client';

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

  // Function to check if an organization with the same name or email already exists
  const checkForExistingOrganization = async (organizationName: string, email: string) => {
    try {
      // First check the nonprofits table
      const { data: existingNonprofit, error: nonprofitError } = await supabase
        .from('nonprofits')
        .select('id, organization_name, email')
        .or(`organization_name.ilike."${organizationName}",email.ilike."${email}"`)
        .limit(1);
      
      if (nonprofitError) {
        console.error("Error checking nonprofit table:", nonprofitError);
        throw new Error("Error checking for existing organizations");
      }
      
      if (existingNonprofit && existingNonprofit.length > 0) {
        const matchedOrg = existingNonprofit[0];
        if (matchedOrg.organization_name.toLowerCase() === organizationName.toLowerCase()) {
          return { exists: true, message: "An organization with this name already exists" };
        } else {
          return { exists: true, message: "An account with this email already exists" };
        }
      }
      
      // Also check the auth users metadata for organization name
      // This catches cases where a user has registered but hasn't created a nonprofit profile yet
      const { data: { users }, error: authError } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1000 // Adjust as needed based on expected number of users
      });
      
      if (authError) {
        // This might fail due to permissions, which is expected in client-side code
        // Just log it and continue
        console.log("Unable to check auth users (expected):", authError);
        return { exists: false };
      }
      
      if (users) {
        for (const user of users) {
          if (user.email?.toLowerCase() === email.toLowerCase()) {
            return { exists: true, message: "An account with this email already exists" };
          }
          
          const metadata = user.user_metadata;
          if (metadata && 
              metadata.organization_name && 
              metadata.organization_name.toLowerCase() === organizationName.toLowerCase()) {
            return { exists: true, message: "An organization with this name already exists" };
          }
        }
      }
      
      return { exists: false };
    } catch (error) {
      console.error("Error checking for existing organization:", error);
      // If there's an error, we'll proceed with registration but log the error
      return { exists: false };
    }
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
      
      // Check if organization with same name or email already exists
      const existingCheck = await checkForExistingOrganization(data.organizationName, data.email);
      if (existingCheck.exists) {
        toast({
          title: "Registration Failed",
          description: existingCheck.message,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
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
