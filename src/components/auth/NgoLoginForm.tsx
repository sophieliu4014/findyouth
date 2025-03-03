import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { signInWithEmail } from '@/integrations/supabase/auth';
import { useAuthStore } from '@/lib/auth';
import AuthErrorMessage from './AuthErrorMessage';

const NgoLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const refreshAuth = useAuthStore((state) => state.refreshAuth);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; general?: string } = {};
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = 'Email is required';
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
      setErrors({});
      
      try {
        const { data, error } = await signInWithEmail(email, password);
        
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setErrors({ general: 'Incorrect email and password combination' });
          } else if (error.message.includes('Email not confirmed')) {
            setErrors({ general: 'Please verify your email before logging in' });
          } else {
            setErrors({ general: error.message });
          }
          return;
        }
        
        if (data.session) {
          await refreshAuth();
          
          toast.success('Login successful!');
          
          navigate('/');
        }
      } catch (err: any) {
        setErrors({ general: err.message || 'An error occurred during login' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="glass-panel p-8 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-youth-charcoal mb-2">NGO Log In</h1>
        <p className="text-youth-charcoal/70">
          Access your organization's account to post and manage volunteer opportunities
        </p>
      </div>
      
      {errors.general && <AuthErrorMessage message={errors.general} />}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-youth-charcoal mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`input-field ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
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
          <label htmlFor="password" className="block text-sm font-medium text-youth-charcoal mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`input-field pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
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
            <Link to="/find-volunteers" className="text-youth-blue hover:text-youth-purple transition-colors">
              Lost your password?
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
          <button
            type="submit"
            className="w-full btn-primary py-3 transition-all hover:shadow-lg hover:scale-[1.02] disabled:opacity-70"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : 'Login'}
          </button>
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
  );
};

export default NgoLoginForm;
