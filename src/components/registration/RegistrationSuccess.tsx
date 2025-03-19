
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface RegistrationSuccessProps {
  resetForm: () => void;
}

const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({ resetForm }) => {
  return (
    <div className="glass-panel p-8 mt-8 animate-fade-in text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-youth-charcoal mb-2">Registration Successful!</h2>
      <p className="text-youth-charcoal/80 mb-6">
        Thank you for registering your organization with FindYOUth. 
        Please check your email to confirm your account. Once confirmed, you can log in to complete your profile.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button onClick={resetForm} variant="outline" className="btn-secondary">
          Register Another NGO
        </Button>
        <Button asChild className="btn-primary">
          <Link to="/ngo-login">Go to Login</Link>
        </Button>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
