
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import CauseSelector from "@/components/form/CauseSelector";
import { causeAreas } from "@/components/form/filters/FilterConstants";

// Remove "All Causes" from the list of selectable causes
const profileCauseAreas = causeAreas.filter(cause => cause !== "All Causes");

// Profile edit form schema
const profileSchema = z.object({
  organization_name: z.string().min(2, { message: "Organization name must be at least 2 characters." }),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }),
  mission: z.string().min(20, { message: "Mission statement must be at least 20 characters." }),
  location: z.string().min(2, { message: "Please enter your organization's location." }),
  website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }).optional().or(z.literal("")),
  social_media: z.string().url({ message: "Please enter a valid social media URL." }).optional().or(z.literal("")),
  causes: z.array(z.string()).min(1, { message: "Please select at least one cause." }).max(3, { message: "You can select up to 3 causes." })
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileEditFormProps {
  userId: string;
  onProfileUpdated: () => void;
}

const ProfileEditForm = ({ userId, onProfileUpdated }: ProfileEditFormProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      organization_name: "",
      description: "",
      mission: "",
      location: "",
      website: "",
      phone: "",
      social_media: "",
      causes: []
    }
  });

  // Fetch current profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      try {
        // First try to get data from nonprofits table
        const { data: nonprofitData, error: nonprofitError } = await supabase
          .from('nonprofits')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (nonprofitError) {
          console.error('Error fetching nonprofit profile:', nonprofitError);
          // If no nonprofit data, fall back to user metadata
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user?.user_metadata) {
            const metadata = user.user_metadata;
            const nonprofitData = metadata.nonprofit_data || {};
            
            // Store user email for later use
            setUserEmail(user.email || "");
            
            form.reset({
              organization_name: metadata.organization_name || "",
              description: nonprofitData.description || "",
              mission: nonprofitData.mission || "",
              location: nonprofitData.location || "",
              website: nonprofitData.website || "",
              phone: nonprofitData.phone || "",
              social_media: nonprofitData.socialMedia || "",
              causes: nonprofitData.causes || []
            });
          }
        } else if (nonprofitData) {
          // Store email for later use
          setUserEmail(nonprofitData.email || "");
          
          // If we have nonprofit data, fetch the associated causes
          const { data: causesData } = await supabase
            .from('nonprofit_causes')
            .select('causes(name)')
            .eq('nonprofit_id', userId);
            
          const causes = causesData?.map(item => item.causes.name) || [];
          
          // Set form values from nonprofit data
          form.reset({
            organization_name: nonprofitData.organization_name || "",
            description: nonprofitData.description || "",
            mission: nonprofitData.mission || "",
            location: nonprofitData.location || "",
            website: nonprofitData.website || "",
            phone: nonprofitData.phone || "",
            social_media: nonprofitData.social_media || "",
            causes: causes
          });
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, [userId, form]);
  
  const onSubmit = async (values: ProfileFormValues) => {
    if (!userId) return;
    
    setIsSaving(true);
    try {
      // Update the user metadata
      const { error: userUpdateError } = await supabase.auth.updateUser({
        data: {
          organization_name: values.organization_name,
          nonprofit_data: {
            description: values.description,
            mission: values.mission,
            location: values.location,
            website: values.website,
            phone: values.phone,
            socialMedia: values.social_media,
            causes: values.causes
          }
        }
      });
      
      if (userUpdateError) throw userUpdateError;
      
      // Update the nonprofit profile in the nonprofits table
      // Important: Include the email field which is required
      const { error: nonprofitError } = await supabase
        .from('nonprofits')
        .upsert({
          id: userId,
          organization_name: values.organization_name,
          description: values.description,
          mission: values.mission,
          location: values.location,
          website: values.website,
          phone: values.phone,
          social_media: values.social_media,
          email: userEmail, // Add the required email field
          updated_at: new Date().toISOString()
        });
        
      if (nonprofitError) throw nonprofitError;
      
      // Handle cause areas
      // First, delete existing cause relationships
      await supabase
        .from('nonprofit_causes')
        .delete()
        .eq('nonprofit_id', userId);
        
      // Get the cause IDs for the selected causes
      const { data: causeData } = await supabase
        .from('causes')
        .select('id, name')
        .in('name', values.causes);
        
      if (causeData && causeData.length > 0) {
        // Create new nonprofit-cause relationships
        const causeRelations = causeData.map(cause => ({
          nonprofit_id: userId,
          cause_id: cause.id
        }));
        
        const { error: causeRelationError } = await supabase
          .from('nonprofit_causes')
          .insert(causeRelations);
          
        if (causeRelationError) {
          console.error('Error updating cause relationships:', causeRelationError);
        }
      }
      
      toast.success('Profile updated successfully');
      onProfileUpdated();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(`Failed to update profile: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-youth-blue" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="organization_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name*</FormLabel>
              <FormControl>
                <Input placeholder="Your organization name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Description*</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us about your organization..." 
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="mission"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mission Statement*</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="What is your organization's mission?" 
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location*</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Vancouver, BC" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder="https://yourwebsite.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 604-123-4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="social_media"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Social Media URL</FormLabel>
              <FormControl>
                <Input placeholder="https://instagram.com/yourorg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="causes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cause Areas*</FormLabel>
              <FormControl>
                <CauseSelector
                  selectedCauses={field.value}
                  onCauseToggle={(cause) => {
                    const currentValue = field.value || [];
                    if (currentValue.includes(cause)) {
                      field.onChange(currentValue.filter(c => c !== cause));
                    } else if (currentValue.length < 3) {
                      field.onChange([...currentValue, cause]);
                    }
                  }}
                  maxCauses={3}
                  causeOptions={profileCauseAreas}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full md:w-auto bg-youth-blue hover:bg-youth-purple transition-colors"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Changes...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Profile Changes
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileEditForm;
