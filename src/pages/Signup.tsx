
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/Footer';
import { signUpWithEmail } from '@/integrations/supabase/auth';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ 
    email?: string; 
    name?: string;
    password?: string; 
    confirmPassword?: string;
    general?: string 
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { 
      email?: string; 
      name?: string;
      password?: string; 
      confirmPassword?: string;
      general?: string 
    } = {};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

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
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    } else if (!/(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/.test(password)) {
      newErrors.password = 'Password must include capital letters, numbers, and symbols';
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
        const { data, error } = await signUpWithEmail(email, password, { 
          full_name: name 
        });
        
        if (error) {
          if (error.message.includes('already registered')) {
            setErrors({ email: 'This email is already registered' });
          } else {
            setErrors({ general: error.message });
          }
          return;
        }
        
        if (data) {
          setAccountCreated(true);
          toast.success('Account created successfully!');
        }
      } catch (err) {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (accountCreated) {
    return (
      <>
        <Helmet>
          <title>Sign Up Success | FindYOUth</title>
        </Helmet>
        
        <Navbar />
        
        <main className="min-h-screen flex items-center justify-center bg-youth-softgray py-16">
          <div className="max-w-md w-full mx-auto px-4 sm:px-6">
            <div className="glass-panel p-8 animate-fade-in">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-youth-charcoal mb-2">Account Created!</h1>
                <p className="text-youth-charcoal/70 mb-6">
                  Your account has been created successfully.
                </p>
                <p className="text-youth-charcoal/70 mb-6">
                  Please check your email to confirm your account before logging in.
                </p>
                <Button 
                  onClick={() => navigate('/login')}
                  className="w-full bg-youth-blue hover:bg-youth-purple transition-colors"
                >
                  Go to Login
                </Button>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Sign Up | FindYOUth</title>
        <meta name="description" content="Create an account to access FindYOUth's volunteer opportunities." />
      </Helmet>
      
      <Navbar />
      
      <main className="min-h-screen flex items-center justify-center bg-youth-softgray py-16">
        <div className="max-w-md w-full mx-auto px-4 sm:px-6">
          <div className="glass-panel p-8 animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-youth-charcoal mb-2">Create an Account</h1>
              <p className="text-youth-charcoal/70">
                Join our community to find volunteer opportunities
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
                <Label htmlFor="name" className="block text-sm font-medium text-youth-charcoal mb-1">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <div className="mt-1 flex items-center text-sm text-red-500">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.name}
                  </div>
                )}
              </div>
              
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
                    placeholder="Create a password"
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
                <div className="mt-1 text-xs text-youth-charcoal/70">
                  Password must be at least 8 characters and include capital letters, numbers, and symbols.
                </div>
              </div>
              
              <div>
                <Label htmlFor="confirmPassword" className="block text-sm font-medium text-youth-charcoal mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <div className="mt-1 flex items-center text-sm text-red-500">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.confirmPassword}
                  </div>
                )}
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
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </div>
              
              <div className="text-center text-sm text-youth-charcoal/70">
                <p>
                  Already have an account?{' '}
                  <Link to="/login" className="text-youth-blue font-medium hover:text-youth-purple transition-colors">
                    Log In
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

export default Signup;
