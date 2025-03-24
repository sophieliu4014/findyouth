
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { eventFormSchema, EventFormValues } from './EventFormSchema';
import BasicInfoSection from './BasicInfoSection';
import DateTimeSection from './DateTimeSection';
import LocationSection from './LocationSection';
import AdditionalInfoSection from './AdditionalInfoSection';

interface EventFormProps {
  userId: string;
  initialData?: any; // For editing an existing event
  isEditing?: boolean;
}

const EventForm = ({ userId, initialData, isEditing = false }: EventFormProps) => {
  const navigate = useNavigate();
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      applicationDeadline: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      signupFormUrl: '',
      attachedLinks: '',
      causeAreas: [],
    },
  });

  // Populate form with existing data when editing
  useEffect(() => {
    if (isEditing && initialData) {
      // Set existing image URL if available
      if (initialData.image_url) {
        setExistingImageUrl(initialData.image_url);
      }

      // Parse location to get street, city, state, zip
      let street = '';
      let city = initialData.city || '';
      let state = initialData.state || '';
      let zip = initialData.zip || '';

      if (initialData.location) {
        // Try to extract street from location if it contains commas
        const locationParts = initialData.location.split(',');
        if (locationParts.length > 0) {
          street = locationParts[0].trim();
        }
      }

      // Parse cause areas from comma-separated string to array
      const causeAreas = initialData.cause_area 
        ? initialData.cause_area.split(',').map((area: string) => area.trim()) 
        : [];

      // Set form values
      form.reset({
        title: initialData.title || '',
        description: initialData.description || '',
        date: initialData.date || '',
        startTime: initialData.start_time || '',
        endTime: initialData.end_time || '',
        applicationDeadline: initialData.application_deadline || '',
        street: street,
        city: city,
        state: state,
        zip: zip,
        signupFormUrl: initialData.signup_form_url || '',
        attachedLinks: initialData.attached_links || '',
        causeAreas: causeAreas,
      });
    }
  }, [isEditing, initialData, form]);

  const onSubmit = async (values: EventFormValues) => {
    if (!userId) return;
    
    // For create mode, validate image is uploaded
    if (!isEditing && !eventImage) {
      setImageError("Please upload an event image");
      toast.error("Event image is required");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create location string
      const location = `${values.street}, ${values.city}, ${values.state} ${values.zip}`;
      
      // Prepare event data
      const eventPayload = {
        title: values.title,
        description: values.description,
        location,
        date: values.date,
        start_time: values.startTime,
        end_time: values.endTime,
        application_deadline: values.applicationDeadline || null,
        city: values.city,
        state: values.state,
        zip: values.zip,
        signup_form_url: values.signupFormUrl || null,
        attached_links: values.attachedLinks || null,
        cause_area: values.causeAreas.join(', '), // Join cause areas as comma-separated string
        nonprofit_id: userId,
      };

      let eventId: string;

      if (isEditing && initialData) {
        // Update existing event
        console.log('Updating event with payload:', eventPayload);
        const { data: updatedEvent, error } = await supabase
          .from('events')
          .update(eventPayload)
          .eq('id', initialData.id)
          .select('id')
          .single();

        if (error) throw error;
        eventId = updatedEvent.id;
        console.log('Event updated successfully:', updatedEvent);
      } else {
        // Create new event
        console.log('Creating event with payload:', eventPayload);
        const fullPayload = {
          ...eventPayload,
          created_at: new Date().toISOString(),
        };

        const { data: createdEvent, error } = await supabase
          .from('events')
          .insert(fullPayload)
          .select('id')
          .single();

        if (error) throw error;
        eventId = createdEvent.id;
        console.log('Event created successfully:', createdEvent);
      }

      // Upload image if selected (for both create and edit)
      if (eventImage && eventId) {
        try {
          const fileExt = eventImage.name.split('.').pop();
          const filePath = `event-images/${eventId}.${fileExt}`;
          
          console.log('Uploading image to path:', filePath);
          
          const { error: uploadError, data: uploadData } = await supabase.storage
            .from('event-images') 
            .upload(filePath, eventImage, {
              upsert: true,
            });

          if (uploadError) {
            console.error('Error uploading image:', uploadError);
            toast.error(`Image upload failed: ${uploadError.message}`, {
              description: isEditing 
                ? "Event was updated but without a new image."
                : "Event was created but without an image."
            });
          } else {
            console.log('Image uploaded successfully:', uploadData);

            // Get public URL
            const { data: urlData } = supabase.storage
              .from('event-images')
              .getPublicUrl(filePath);

            console.log('Image public URL:', urlData);

            // Update event with image URL
            if (urlData) {
              const { error: updateError } = await supabase
                .from('events')
                .update({ image_url: urlData.publicUrl })
                .eq('id', eventId);

              if (updateError) {
                console.error('Error updating event with image URL:', updateError);
                toast.error("Failed to attach image to event", {
                  description: isEditing
                    ? "Your event was updated, but the image couldn't be attached."
                    : "Your event was created, but the image couldn't be attached."
                });
              } else {
                console.log('Event updated with image URL:', urlData.publicUrl);
              }
            }
          }
        } catch (imageError: any) {
          console.error('Error processing image upload:', imageError);
          toast.error(`Image processing error: ${imageError.message}`, {
            description: isEditing
              ? "Event was updated but without a new image."
              : "Event was created but without an image."
          });
        }
      }

      // Show success toast and navigate
      toast.success(isEditing ? 'Event updated successfully!' : 'Event created successfully!');
      navigate(isEditing ? `/event/${eventId}` : '/find-activities');
    } catch (error: any) {
      console.error(isEditing ? 'Error updating event:' : 'Error creating event:', error);
      toast.error(isEditing 
        ? `Failed to update event: ${error.message}` 
        : `Failed to create event: ${error.message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <BasicInfoSection 
          control={form.control} 
          onImageSelect={(file) => {
            setEventImage(file);
            setImageError(null);
          }}
          existingImageUrl={existingImageUrl}
        />
        
        {imageError && (
          <div className="text-destructive text-sm font-medium">
            {imageError}
          </div>
        )}
        
        <DateTimeSection control={form.control} />
        
        <LocationSection control={form.control} />
        
        <AdditionalInfoSection control={form.control} />
        
        <div className="pt-6 border-t border-gray-200">
          <Button
            type="submit"
            className="bg-youth-blue hover:bg-youth-purple transition-colors w-full md:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? 'Updating Event...' : 'Creating Event...'}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? 'Update Event' : 'Create Event'}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EventForm;
