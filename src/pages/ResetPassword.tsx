
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { updatePassword } from '@/hooks/utils/auth-utils';
import { useAuthStore } from '@/lib/auth';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidLink, setIsValidLink] = useState(true);
  
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    // Check if this is actually a password reset flow by verifying URL parameters
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type');
    
    if (type !== 'recovery') {
      setIsValidLink(false);
      setError('Invalid or expired password reset link. Please request a new one.');
    }
  }, []);

  const validatePassword = () => {
    if (!password) {
      setError('Please enter a new password');
      return false;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validatePassword()) {
      return;
    }
    
    setIsSubmitting(true);
    
    const { success, error } = await updatePassword(password);
    
    setIsSubmitting(false);
    
    if (success) {
      setIsSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else {
      setError(error || 'Failed to update password. Please try again.');
    }
  };

  if (!isValidLink && !user) {
    return (
      <>
        <Helmet>
          <title>Invalid Reset Link | FindYOUth</title>
        </Helmet>
        
        <Navbar />
        
        <main className="min-h-screen flex items-center justify-center bg-youth-softgray py-16">
          <div className="max-w-md w-full mx-auto px-4 sm:px-6">
            <div className="glass-panel p-8 animate-fade-in">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-youth-charcoal mb-2">Invalid Link</h1>
                <p className="text-youth-charcoal/70">
                  This password reset link is invalid or has expired
                </p>
              </div>
              
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
              
              <Link to="/forgot-password">
                <Button className="w-full bg-youth-blue hover:bg-youth-purple">
                  Request New Reset Link
                </Button>
              </Link>
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
        <title>Reset Password | FindYOUth</title>
        <meta name="description" content="Create a new password for your FindYOUth account" />
      </Helmet>
      
      <Navbar />
      
      <main className="min-h-screen flex items-center justify-center bg-youth-softgray py-16">
        <div className="max-w-md w-full mx-auto px-4 sm:px-6">
          <div className="glass-panel p-8 animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-youth-charcoal mb-2">Create New Password</h1>
              <p className="text-youth-charcoal/70">
                Please enter and confirm your new password
              </p>
            </div>
            
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            {isSuccess ? (
              <div className="space-y-6">
                <div className="p-4 bg-green-50 border border-green-200 rounded-md flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-green-800 font-medium">Password updated successfully!</p>
                    <p className="text-sm text-green-700 mt-1">
                      Your password has been updated. You'll be redirected to the login page in a few seconds.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="password" className="block text-sm font-medium text-youth-charcoal mb-1">
                    New Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                      placeholder="Enter your new password"
                      disabled={isSubmitting}
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
                  <p className="text-xs text-youth-charcoal/70 mt-1">
                    Password must be at least 8 characters long
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="confirm-password" className="block text-sm font-medium text-youth-charcoal mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pr-10"
                      placeholder="Confirm your new password"
                      disabled={isSubmitting}
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
                </div>
                
                <Button
                  type="submit"
                  className="w-full py-3 transition-all hover:shadow-lg hover:scale-[1.02] disabled:opacity-70 bg-youth-blue hover:bg-youth-purple"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default ResetPassword;
