
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
              <Input placeholder="Beach Cleanup Day" {...field} />
            </FormControl>
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
                placeholder="Describe what volunteers will be doing and what impact they'll make..." 
                className="min-h-[120px]"
                {...field} 
              />
            </FormControl>
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
