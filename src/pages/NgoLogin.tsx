
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/Footer';

// Mock database for demo purposes
const mockUsers = [
  { username: 'test@example.org', password: 'Password123!' },
  { username: 'ngo@example.org', password: 'Ngo123!' },
];

const NgoLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { username?: string; password?: string; general?: string } = {};
    let isValid = true;

    if (!username.trim()) {
      newErrors.username = 'Organization name is required';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const user = mockUsers.find(u => u.username === username);
        
        if (!user) {
          setErrors({ general: 'An account with this email does not exist' });
          setIsLoading(false);
          return;
        }
        
        if (user.password !== password) {
          setErrors({ general: 'Incorrect email and password combination' });
          setIsLoading(false);
          return;
        }
        
        // Successful login
        toast.success('Login successful!');
        // In a real app, we would set authentication state here
        setIsLoading(false);
        
        // Redirect to home page
        navigate('/');
      }, 1000);
    }
  };

  return (
    <>
      <Helmet>
        <title>NGO Login | FindYOUth</title>
        <meta name="description" content="Log in to your youth-led nonprofit organization account to post volunteer opportunities." />
      </Helmet>
      
      <Navbar />
      
      <main className="min-h-screen flex items-center justify-center bg-youth-softgray py-16">
        <div className="max-w-md w-full mx-auto px-4 sm:px-6">
          <div className="glass-panel p-8 animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-youth-charcoal mb-2">NGO Log In</h1>
              <p className="text-youth-charcoal/70">
                Access your organization's account to post and manage volunteer opportunities
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
                <label htmlFor="username" className="block text-sm font-medium text-youth-charcoal mb-1">
                  Username or Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`input-field ${errors.username ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter username or email address"
                />
                {errors.username && (
                  <div className="mt-1 flex items-center text-sm text-red-500">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.username}
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
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </div>
              
              <div className="text-center text-sm text-youth-charcoal/70">
                <p>
                  Don't have an account?{' '}
                  <Link to="/find-volunteers" className="text-youth-blue font-medium hover:text-youth-purple transition-colors">
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

export default NgoLogin;
