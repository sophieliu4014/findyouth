
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { EventFormValues } from "./EventFormSchema";
import EventImageUpload from "./EventImageUpload";
import { CAUSE_AREAS } from "./EventFormSchema";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Info } from "lucide-react";
import CauseSelector from "@/components/form/CauseSelector";

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
              Summarize your event in one concise, engaging sentence (maximum 10 words).
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
            <div className="flex items-center gap-2">
              <FormLabel>Event Description*</FormLabel>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Info className="h-4 w-4 text-youth-charcoal/70 cursor-help" />
                </HoverCardTrigger>
                <HoverCardContent className="w-80 p-4">
                  <p className="text-sm">
                    <strong>Example:</strong> Our beach cleanup event aims to remove plastic waste from Ocean Beach, protecting marine life and ecosystem health. Volunteers will work in teams from 9 AM to 1 PM, equipped with gloves and collection bags. No prior experience needed. We'll provide safety briefing, assign cleanup zones, and track total waste collected. This event directly contributes to environmental conservation efforts.
                  </p>
                </HoverCardContent>
              </HoverCard>
            </div>
            <FormControl>
              <Textarea 
                placeholder="Provide details about your volunteer event including:
                
• Detailed event schedule and timeline
• Specific volunteer roles and responsibilities
• What volunteers will learn or accomplish
• Required skills or equipment
• Impact of the volunteer work
• Any training or orientation provided
• Specific location details and meeting points" 
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
        name="causeAreas"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cause Areas*</FormLabel>
            <FormControl>
              <CauseSelector
                selectedCauses={field.value || []}
                onCauseToggle={(cause) => {
                  const currentValue = field.value || [];
                  if (currentValue.includes(cause)) {
                    field.onChange(currentValue.filter(c => c !== cause));
                  } else if (currentValue.length < 3) {
                    field.onChange([...currentValue, cause]);
                  }
                }}
                maxCauses={3}
                causeOptions={CAUSE_AREAS}
              />
            </FormControl>
            <FormDescription>
              Select up to 3 cause areas that best represent this volunteer activity
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div>
        <div className="mb-2">
          <FormLabel>Event Image*</FormLabel>
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
