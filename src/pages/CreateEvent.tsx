
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/lib/auth';
import EventImageUpload from '@/components/events/EventImageUpload';

// Form validation schema
const eventFormSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  description: z.string().min(20, { message: 'Description must be at least 20 characters' }),
  date: z.string().min(1, { message: 'Date is required' }),
  startTime: z.string().min(1, { message: 'Start time is required' }),
  endTime: z.string().min(1, { message: 'End time is required' }),
  applicationDeadline: z.string().optional(),
  street: z.string().min(1, { message: 'Street address is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  zip: z.string().min(1, { message: 'ZIP code is required' }),
  signupFormUrl: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.string().length(0)),
  attachedLinks: z.string().optional(),
  causeArea: z.string().min(1, { message: 'Cause area is required' }),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

const CreateEvent = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to login if not authenticated
  if (!isLoading && !isAuthenticated) {
    navigate('/login');
    return null;
  }

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
    if (!user) return;
    
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
        nonprofit_id: user.id,
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
      navigate('/find-activities');
    } catch (error: any) {
      console.error('Error creating event:', error);
      toast.error(`Failed to create event: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const causeAreas = [
    'Environment',
    'Education',
    'Health',
    'Community',
    'Animal Welfare',
    'Arts & Culture',
    'Social Services',
    'Disaster Relief',
    'Human Rights',
    'Youth Development',
  ];

  return (
    <>
      <Helmet>
        <title>Create Volunteer Event | FindYOUth</title>
        <meta name="description" content="Create a new volunteer event for your organization" />
      </Helmet>
      
      <Navbar />
      
      <main className="min-h-screen bg-youth-softgray py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="glass-panel p-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-youth-charcoal mb-6">Create Volunteer Event</h1>
            <p className="text-youth-charcoal/80 mb-8">
              Share your volunteer opportunity with the community! Fill out the form below to create a new event.
            </p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-youth-charcoal">Basic Information</h2>
                  
                  <FormField
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
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
                            {causeAreas.map((cause) => (
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
                      onImageSelect={setEventImage}
                    />
                    <p className="text-xs text-youth-charcoal/70 mt-2">
                      Upload an image that represents your event. Maximum size 2MB.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-youth-charcoal">Date & Time</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Date*</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time*</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time*</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="applicationDeadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application Deadline</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>
                          Optional: date by which volunteers must apply
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-youth-charcoal">Location</h2>
                  
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address*</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City*</FormLabel>
                          <FormControl>
                            <Input placeholder="Vancouver" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Province/State*</FormLabel>
                          <FormControl>
                            <Input placeholder="BC" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="zip"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal/ZIP Code*</FormLabel>
                          <FormControl>
                            <Input placeholder="V6B 1A1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-youth-charcoal">Additional Information</h2>
                  
                  <FormField
                    control={form.control}
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
                    control={form.control}
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
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default CreateEvent;
