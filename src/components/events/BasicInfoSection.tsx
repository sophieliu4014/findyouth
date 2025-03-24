
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

interface BasicInfoSectionProps {
  control: Control<EventFormValues>;
  onImageSelect: (file: File) => void;
  existingImageUrl?: string | null;
}

const BasicInfoSection = ({ control, onImageSelect, existingImageUrl }: BasicInfoSectionProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Set existing image preview if available
  useEffect(() => {
    if (existingImageUrl) {
      setPreviewUrl(existingImageUrl);
    }
  }, [existingImageUrl]);
  
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
              <Input placeholder="Enter the title of your event" {...field} />
            </FormControl>
            <FormDescription>
              Choose a clear, descriptive title that explains what volunteers will be doing.
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
            <FormLabel>Event Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe what volunteers will be doing, who they'll be helping, and what impact they'll make" 
                className="min-h-[150px]"
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Be specific about tasks, required skills, and what volunteers will achieve.
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
        <FormLabel>Event Image</FormLabel>
        <EventImageUpload 
          onImageSelect={onImageSelect}
          previewUrl={previewUrl}
          setPreviewUrl={setPreviewUrl}
        />
        <FormDescription>
          Upload a high-quality image that represents your event. 
          {existingImageUrl && " Leave as is to keep the current image, or upload a new one to replace it."}
        </FormDescription>
      </div>
    </div>
  );
};

export default BasicInfoSection;
