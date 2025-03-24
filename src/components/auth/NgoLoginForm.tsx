
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signInWithEmail } from '@/integrations/supabase/auth';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import AuthErrorMessage from './AuthErrorMessage';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" })
});

type FormData = z.infer<typeof formSchema>;

const NgoLoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    setIsLoading(true);
    
    try {
      const { data: authData, error: authError } = await signInWithEmail(data.email, data.password);
      
      if (authError) {
        console.error("Login error:", authError);
        
        // Provide more user-friendly error messages
        if (authError.message.includes("Invalid login credentials")) {
          setError("Incorrect email or password. Please try again.");
        } else if (authError.message.includes("Email not confirmed")) {
          setError("Please check your email to confirm your account before logging in.");
        } else {
          setError(authError.message);
        }
        return;
      }
      
      // Success! Redirect to the dashboard
      toast.success("Successfully logged in!");
      navigate('/profile');
      
    } catch (error: any) {
      console.error("Unexpected login error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel p-8 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-youth-charcoal mb-2">NGO Login</h1>
        <p className="text-youth-charcoal/70">
          Log in to your nonprofit organization account
        </p>
      </div>
      
      {error && <AuthErrorMessage message={error} />}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-youth-charcoal">Email Address</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="your-ngo@example.org" 
                    {...field} 
                    className="bg-white/70"
                  />
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
                <FormLabel className="text-youth-charcoal">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••" 
                      {...field} 
                      className="bg-white/70 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-youth-charcoal/50 hover:text-youth-charcoal"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-youth-blue hover:text-youth-purple transition-colors">
              Forgot your password?
            </Link>
          </div>
          
          <Button 
            type="submit"
            className="w-full bg-youth-blue hover:bg-youth-purple transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
          
          <div className="text-center mt-6">
            <p className="text-youth-charcoal/70 text-sm">
              Don't have an account yet?{' '}
              <Link to="/register-ngo" className="text-youth-blue font-medium hover:text-youth-purple transition-colors">
                Register your NGO
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NgoLoginForm;
