
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/Footer';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Check, Loader2 } from 'lucide-react';

const formSchema = z.object({
  organizationName: z.string().min(2, {
    message: "Organization name must be at least 2 characters.",
  }),
  contactName: z.string().min(2, {
    message: "Contact name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  website: z.string().url({
    message: "Please enter a valid URL.",
  }).optional().or(z.literal('')),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  mission: z.string().min(20, {
    message: "Mission statement must be at least 20 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const RegisterNgo = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: "",
      contactName: "",
      email: "",
      phone: "",
      website: "",
      description: "",
      mission: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log(data);
      setIsSubmitting(false);
      setIsSuccess(true);
      toast({
        title: "Registration submitted",
        description: "We'll review your information and contact you shortly.",
      });
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Register your NGO - FindYOUth</title>
        <meta name="description" content="Register your youth-led nonprofit organization with FindYOUth to connect with passionate volunteers." />
      </Helmet>
      
      <Navbar />
      
      <main className="page-container">
        <div className="max-w-3xl mx-auto">
          <h1 className="section-title text-center">Register your Youth-Led NGO</h1>
          <p className="section-subtitle text-center">Join our community of youth-led nonprofit organizations making a difference across Greater Vancouver.</p>
          
          {isSuccess ? (
            <div className="glass-panel p-8 text-center mt-8">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-youth-charcoal mb-4">Registration Submitted!</h2>
              <p className="text-lg text-youth-charcoal/80 mb-6">
                Thank you for registering your NGO with FindYOUth. Our team will review your information and reach out to you shortly to complete the verification process.
              </p>
              <Button className="btn-primary" onClick={() => setIsSuccess(false)}>
                Register Another Organization
              </Button>
            </div>
          ) : (
            <div className="glass-panel p-8 mt-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="organizationName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization Name*</FormLabel>
                          <FormControl>
                            <Input placeholder="Youth Eco Initiative" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Person*</FormLabel>
                          <FormControl>
                            <Input placeholder="Jane Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address*</FormLabel>
                          <FormControl>
                            <Input placeholder="contact@example.org" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number*</FormLabel>
                          <FormControl>
                            <Input placeholder="(604) 555-1234" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website URL (if available)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://www.yourorganization.org" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter your organization's website if you have one
                        </FormDescription>
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
                            placeholder="Tell us about your organization, when it was founded, and what areas you work in..." 
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
                            placeholder="What is your organization's mission? What impact are you trying to make?" 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Registration"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default RegisterNgo;
