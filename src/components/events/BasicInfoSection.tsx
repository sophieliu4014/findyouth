import { useState, useEffect } from 'react';
import { Control } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import EventImageUpload from './EventImageUpload';
import CauseSelector from '../form/CauseSelector';
import { EventFormValues } from './EventFormSchema';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { HelpCircle } from 'lucide-react';

interface BasicInfoSectionProps {
  control: Control<EventFormValues>;
  onImageSelect: (file: File) => void;
  onAdditionalImagesSelect?: (files: File[]) => void;
  existingImageUrl?: string | null;
  existingAdditionalImageUrls?: string[];
}

const BasicInfoSection = ({ 
  control, 
  onImageSelect, 
  onAdditionalImagesSelect,
  existingImageUrl,
  existingAdditionalImageUrls 
}: BasicInfoSectionProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [additionalPreviewUrls, setAdditionalPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    if (existingImageUrl) {
      setPreviewUrl(existingImageUrl);
    }
    if (existingAdditionalImageUrls?.length) {
      setAdditionalPreviewUrls(existingAdditionalImageUrls);
    }
  }, [existingImageUrl, existingAdditionalImageUrls]);
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-youth-charcoal">Basic Information</h2>
      
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Title</FormLabel>
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
              <FormLabel>Event Description</FormLabel>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </HoverCardTrigger>
                <HoverCardContent className="w-80 p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Example:</h4>
                    <p className="text-sm text-muted-foreground">
                      Our beach cleanup event aims to remove plastic waste from Ocean Beach, 
                      protecting marine life and ecosystem health. Volunteers will work in teams from 9 AM to 1 
                      PM, equipped with gloves and collection bags. No prior experience needed. We'll 
                      provide safety briefing, assign cleanup zones, and track total waste collected. This event 
                      directly contributes to environmental conservation efforts.
                    </p>
                  </div>
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
                className="min-h-[150px]"
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
            <FormLabel>Cause Areas</FormLabel>
            <FormControl>
              <CauseSelector 
                selectedCauses={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormDescription>
              Select cause areas that relate to your volunteer opportunity.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div>
        <FormLabel>Event Images</FormLabel>
        <EventImageUpload 
          onImageSelect={onImageSelect}
          onAdditionalImagesSelect={onAdditionalImagesSelect}
          previewUrl={previewUrl}
          additionalPreviewUrls={additionalPreviewUrls}
          setPreviewUrl={setPreviewUrl}
          setAdditionalPreviewUrls={setAdditionalPreviewUrls}
        />
        <FormDescription>
          Upload images for your event. The first image will be the main image shown in the events list.
          {existingImageUrl && " Leave as is to keep the current images, or upload new ones to replace them."}
        </FormDescription>
      </div>
    </div>
  );
};

export default BasicInfoSection;
