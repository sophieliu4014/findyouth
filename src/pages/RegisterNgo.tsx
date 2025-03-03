
import { useState, useRef, useEffect } from 'react';
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
import { Check, Loader2, Upload, RefreshCw, AlertCircle } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";

const causeAreas = [
  "Advocacy & Human Rights",
  "Education",
  "Sports",
  "Health",
  "Arts & Culture",
  "Environment",
  "Homeless",
  "Animals",
  "Youth",
  "Seniors",
  "Religion"
];

const passwordSchema = z.string()
  .min(8, { message: "Password must be at least 8 characters." })
  .refine(password => /[A-Z]/.test(password), { 
    message: "Password must include at least one capital letter."
  })
  .refine(password => /[0-9]/.test(password), { 
    message: "Password must include at least one number."
  })
  .refine(password => /[^A-Za-z0-9]/.test(password), { 
    message: "Password must include at least one symbol."
  });

const formSchema = z.object({
  organizationName: z.string().min(2, {
    message: "Organization name must be at least 2 characters.",
  }),
  password: passwordSchema,
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  website: z.string().url({
    message: "Please enter a valid URL.",
  }).optional().or(z.literal('')),
  socialMedia: z.string().url({
    message: "Please enter a valid social media URL.",
  }),
  location: z.string().min(2, {
    message: "Please enter your organization's location.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  mission: z.string().min(20, {
    message: "Mission statement must be at least 20 characters.",
  }),
  causes: z.array(z.string()).min(1, {
    message: "Please select at least one cause.",
  }).max(3, {
    message: "You can select up to 3 causes.",
  }),
  captchaVerified: z.boolean().refine(val => val === true, {
    message: "Please complete the verification.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const RegisterNgo = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [captchaValue, setCaptchaValue] = useState(0);
  const [captchaTarget, setCaptchaTarget] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: "",
      password: "",
      email: "",
      phone: "",
      website: "",
      socialMedia: "",
      location: "",
      description: "",
      mission: "",
      causes: [],
      captchaVerified: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    if (!profileImage) {
      setImageError("Profile picture is required");
      setIsSubmitting(false);
      return;
    }
    
    setTimeout(() => {
      console.log(data);
      console.log("Profile Image:", profileImage);
      setIsSubmitting(false);
      setIsSuccess(true);
      toast({
        title: "Registration submitted",
        description: "We'll review your information and contact you shortly.",
      });
    }, 1500);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setImageError(null);
    
    if (!file) {
      setProfileImage(null);
      setImagePreview(null);
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      setImageError("File size must be less than 2MB");
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setProfileImage(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleCauseToggle = (cause: string) => {
    const currentCauses = form.getValues("causes");
    let newCauses: string[];
    
    if (currentCauses.includes(cause)) {
      newCauses = currentCauses.filter(c => c !== cause);
    } else {
      if (currentCauses.length >= 3) {
        toast({
          title: "Maximum causes reached",
          description: "You can select up to 3 causes. Remove one to add another.",
          variant: "destructive",
        });
        return;
      }
      newCauses = [...currentCauses, cause];
    }
    
    form.setValue('causes', newCauses, { shouldValidate: true });
  };
  
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    setCaptchaValue(0);
    setCaptchaTarget(num1 + num2);
    return { num1, num2 };
  };
  
  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleCaptchaChange = (value: string) => {
    const numValue = parseInt(value);
    setCaptchaValue(isNaN(numValue) ? 0 : numValue);
    
    form.setValue('captchaVerified', numValue === captchaTarget, { 
      shouldValidate: true 
    });
  };
  
  const refreshCaptcha = () => {
    generateCaptcha();
  };

  return (
    <>
      <Helmet>
        <title>Register Your NGO - FindYOUth</title>
        <meta name="description" content="Register your youth-led nonprofit organization with FindYOUth to connect with passionate volunteers." />
      </Helmet>
      
      <Navbar />
      
      <main className="page-container">
        <div className="max-w-3xl mx-auto">
          <h1 className="section-title text-center">Register Your NGO</h1>
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
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Password*</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          {!form.formState.errors.password && field.value && !/(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/.test(field.value) && (
                            <div className="mt-1 text-xs text-red-500">
                              <div className="flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                <span>Please incorporate capital letters, symbols, and numbers</span>
                              </div>
                            </div>
                          )}
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      name="socialMedia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Social Media URL*</FormLabel>
                          <FormControl>
                            <Input placeholder="https://www.instagram.com/yourorg" {...field} />
                          </FormControl>
                          <FormDescription>
                            Link to your main social media (Instagram, TikTok, etc.)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location*</FormLabel>
                        <FormControl>
                          <Input placeholder="Vancouver, BC" {...field} />
                        </FormControl>
                        <FormDescription>
                          City where your nonprofit is headquartered
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
                  
                  <FormField
                    control={form.control}
                    name="causes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select up to 3 Main Causes*</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-1">
                          {causeAreas.map((cause) => {
                            const isSelected = field.value.includes(cause);
                            return (
                              <div 
                                key={cause}
                                className={`border rounded-md p-3 cursor-pointer transition-colors
                                  ${isSelected 
                                    ? 'bg-primary/20 border-primary' 
                                    : 'hover:bg-accent border-input'}`}
                                onClick={() => handleCauseToggle(cause)}
                              >
                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={`cause-${cause}`}
                                    checked={isSelected}
                                  />
                                  <label 
                                    htmlFor={`cause-${cause}`}
                                    className="text-sm font-medium leading-none cursor-pointer"
                                  >
                                    {cause}
                                  </label>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <FormDescription>
                          These will help match you with volunteers interested in your cause areas
                        </FormDescription>
                        {form.formState.errors.causes && (
                          <FormMessage>{form.formState.errors.causes.message}</FormMessage>
                        )}
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <FormLabel>Profile Picture*</FormLabel>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 transition-colors hover:border-primary">
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      
                      {imagePreview ? (
                        <div className="flex flex-col items-center gap-4">
                          <img src={imagePreview} alt="Profile preview" className="w-32 h-32 object-cover rounded-lg" />
                          <Button type="button" variant="outline" onClick={triggerFileInput}>
                            Change Image
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <Upload className="h-8 w-8 text-gray-400" />
                          </div>
                          <div className="text-center">
                            <Button type="button" variant="outline" onClick={triggerFileInput}>
                              Choose Image
                            </Button>
                            <p className="text-sm text-muted-foreground mt-2">
                              PNG, JPG or GIF (max. 2MB)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    {imageError && (
                      <p className="text-sm font-medium text-destructive">{imageError}</p>
                    )}
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="captchaVerified"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification*</FormLabel>
                        <div className="glass-card p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-sm font-medium">Solve the simple math problem:</h3>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              onClick={refreshCaptcha}
                              className="h-8 w-8 p-0"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="text-lg font-medium">
                              {captchaTarget - captchaValue} + {captchaValue} = ?
                            </div>
                            <Input 
                              type="number" 
                              value={captchaValue || ''} 
                              onChange={(e) => handleCaptchaChange(e.target.value)}
                              className="w-20"
                              placeholder="?"
                            />
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full btn-primary hover:scale-[1.02] transition-transform"
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
