
import { useState } from 'react';
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
}

const EventForm = ({ userId }: EventFormProps) => {
  const navigate = useNavigate();
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      causeArea: '',
    },
  });

  const onSubmit = async (values: EventFormValues) => {
    if (!userId) return;
    
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
        cause_area: values.causeArea,
        nonprofit_id: userId,
        created_at: new Date().toISOString(), // Ensure we record when the event was created
      };

      // Insert event into database
      const { data: createdEvent, error } = await supabase
        .from('events')
        .insert(eventPayload)
        .select('id')
        .single();

      if (error) throw error;

      // Upload image if selected
      if (eventImage && createdEvent) {
        const fileExt = eventImage.name.split('.').pop();
        const filePath = `event-images/${createdEvent.id}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('profile-images') // Using the existing bucket
          .upload(filePath, eventImage, {
            upsert: true,
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('profile-images')
          .getPublicUrl(filePath);

        // Update event with image URL
        if (urlData) {
          const { error: updateError } = await supabase
            .from('events')
            .update({ image_url: urlData.publicUrl })
            .eq('id', createdEvent.id);

          if (updateError) throw updateError;
        }
      }

      toast.success('Event created successfully!');
      // Redirect to the find activities page to show the newly created event
      navigate('/find-activities');
    } catch (error: any) {
      console.error('Error creating event:', error);
      toast.error(`Failed to create event: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <BasicInfoSection 
          control={form.control} 
          onImageSelect={setEventImage} 
        />
        
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
                Creating Event...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Event
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EventForm;
