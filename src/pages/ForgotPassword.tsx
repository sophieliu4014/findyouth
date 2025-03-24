
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { sendPasswordResetEmail } from '@/hooks/utils/auth-utils';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    const { success, error } = await sendPasswordResetEmail(email);
    
    setIsSubmitting(false);
    
    if (success) {
      setIsSuccess(true);
    } else {
      setError(error || 'Failed to send reset link. Please try again.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password | FindYOUth</title>
        <meta name="description" content="Reset your FindYOUth account password" />
      </Helmet>
      
      <Navbar />
      
      <main className="min-h-screen flex items-center justify-center bg-youth-softgray py-16">
        <div className="max-w-md w-full mx-auto px-4 sm:px-6">
          <div className="glass-panel p-8 animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-youth-charcoal mb-2">Reset Password</h1>
              <p className="text-youth-charcoal/70">
                Enter your email address and we'll send you instructions to reset your password
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
                    <p className="text-sm text-green-800 font-medium">Reset link sent!</p>
                    <p className="text-sm text-green-700 mt-1">
                      Check your email for instructions on how to reset your password. The link will expire in 24 hours.
                    </p>
                  </div>
                </div>
                <Link to="/login">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            ) : (
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
                    className={`${error ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter your email address"
                    disabled={isSubmitting}
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full py-3 transition-all hover:shadow-lg hover:scale-[1.02] disabled:opacity-70 bg-youth-blue hover:bg-youth-purple"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending reset link...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
                
                <div className="text-center">
                  <Link 
                    to="/login" 
                    className="text-youth-blue hover:text-youth-purple text-sm transition-colors"
                  >
                    <ArrowLeft className="inline-block h-3 w-3 mr-1" />
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default ForgotPassword;
