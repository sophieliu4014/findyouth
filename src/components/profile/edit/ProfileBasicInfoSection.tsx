
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "./useProfileEditForm";

interface ProfileBasicInfoSectionProps {
  form: UseFormReturn<ProfileFormValues>;
}

const ProfileBasicInfoSection = ({ form }: ProfileBasicInfoSectionProps) => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default ProfileBasicInfoSection;
