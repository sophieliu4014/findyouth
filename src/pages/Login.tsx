import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/Footer';
import { signInWithEmail } from '@/integrations/supabase/auth';
import { useAuthStore } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/';
    navigate(from, { replace: true });
  }

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; general?: string } = {};
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      
      try {
        const { data, error } = await signInWithEmail(email, password);
        
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setErrors({ general: 'Incorrect email and password combination' });
          } else {
            setErrors({ general: error.message });
          }
          return;
        }
        
        if (data?.user) {
          toast.success('Login successful!');
          navigate('/', { replace: true });
        }
      } catch (err) {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | FindYOUth</title>
        <meta name="description" content="Log in to your account to access FindYOUth." />
      </Helmet>
      
      <Navbar />
      
      <main className="min-h-screen flex items-center justify-center bg-youth-softgray py-16">
        <div className="max-w-md w-full mx-auto px-4 sm:px-6">
          <div className="glass-panel p-8 animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-youth-charcoal mb-2">Log In</h1>
              <p className="text-youth-charcoal/70">
                Login for nonprofits only. Volunteers do not need an account to browse!
              </p>
            </div>
            
            {errors.general && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-youth-charcoal mb-1">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <div className="mt-1 flex items-center text-sm text-red-500">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.email}
                  </div>
                )}
              </div>
              
              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-youth-charcoal mb-1">
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter your password"
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
                {errors.password && (
                  <div className="mt-1 flex items-center text-sm text-red-500">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.password}
                  </div>
                )}
                <div className="mt-1 text-sm text-youth-charcoal/70">
                  <Link to="/forgot-password" className="text-youth-blue hover:text-youth-purple transition-colors">
                    Forgot your password?
                  </Link>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-youth-purple focus:ring-youth-purple border-gray-300 rounded"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-youth-charcoal">
                  Remember Me
                </label>
              </div>
              
              <div>
                <Button
                  type="submit"
                  className="w-full py-3 transition-all hover:shadow-lg hover:scale-[1.02] disabled:opacity-70 bg-youth-blue hover:bg-youth-purple"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
              </div>
              
              <div className="text-center text-sm text-youth-charcoal/70">
                <p>
                  Don't have an account?{' '}
                  <Link to="/register-ngo" className="text-youth-blue font-medium hover:text-youth-purple transition-colors">
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Login;
