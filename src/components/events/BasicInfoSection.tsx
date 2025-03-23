
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { EventFormValues } from "./EventFormSchema";
import EventImageUpload from "./EventImageUpload";
import { CAUSE_AREAS } from "./EventFormSchema";

interface BasicInfoSectionProps {
  control: Control<EventFormValues>;
  onImageSelect: (file: File | null) => void;
}

const BasicInfoSection = ({ control, onImageSelect }: BasicInfoSectionProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-youth-charcoal">Basic Information</h2>
      
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Title*</FormLabel>
            <FormControl>
              <Input 
                placeholder="Ocean Beach Cleanup: Protecting Marine Ecosystems" 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Summarize your event in one concise, engaging sentence that captures the essence of the volunteer activity.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Description*</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Provide a comprehensive overview of your volunteer event. Include:
- Detailed event schedule and timeline
- Specific volunteer roles and responsibilities
- What volunteers will learn or accomplish
- Required skills or equipment
- Impact of the volunteer work on the community or environment
- Any training or orientation provided
- Specific location details and meeting points

Example: Our beach cleanup event aims to remove plastic waste from Ocean Beach, protecting marine life and ecosystem health. Volunteers will work in teams from 9 AM to 1 PM, equipped with gloves and collection bags. No prior experience needed. We'll provide safety briefing, assign cleanup zones, and track total waste collected. This event directly contributes to environmental conservation efforts." 
                className="min-h-[200px]"
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Describe your event in detail. Your description must be at least 25 words long to provide comprehensive information for potential volunteers.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="causeArea"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cause Area*</FormLabel>
            <FormControl>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                {...field}
              >
                <option value="">Select a cause area</option>
                {CAUSE_AREAS.map((cause) => (
                  <option key={cause} value={cause}>
                    {cause}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormDescription>
              Select the primary focus area of this volunteer activity
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div>
        <div className="mb-2">
          <FormLabel>Event Image</FormLabel>
        </div>
        <EventImageUpload
          onImageSelect={onImageSelect}
        />
        <p className="text-xs text-youth-charcoal/70 mt-2">
          Upload an image that represents your event. Maximum size 2MB.
        </p>
      </div>
    </div>
  );
};

export default BasicInfoSection;
