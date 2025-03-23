
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { EventFormValues } from "./EventFormSchema";

interface AdditionalInfoSectionProps {
  control: Control<EventFormValues>;
}

const AdditionalInfoSection = ({ control }: AdditionalInfoSectionProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-youth-charcoal">Additional Information</h2>
      
      <FormField
        control={control}
        name="signupFormUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>External Signup Form URL</FormLabel>
            <FormControl>
              <Input placeholder="https://forms.example.com/signup" {...field} />
            </FormControl>
            <FormDescription>
              Optional: link to an external form if you have a custom application process
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="attachedLinks"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Links</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Add any additional relevant links (one per line)" 
                className="min-h-[80px]"
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Optional: add links to event pages, resources, or other relevant information
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AdditionalInfoSection;
