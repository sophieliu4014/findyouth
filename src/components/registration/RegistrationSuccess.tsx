
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface RegistrationSuccessProps {
  resetForm: () => void;
}

const RegistrationSuccess = ({ resetForm }: RegistrationSuccessProps) => {
  return (
    <div className="glass-panel p-8 text-center mt-8">
      <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-youth-charcoal mb-4">Registration Submitted!</h2>
      <p className="text-lg text-youth-charcoal/80 mb-6">
        Thank you for registering your NGO with FindYOUth. Our team will review your information and reach out to you shortly to complete the verification process.
      </p>
      <Button className="btn-primary" onClick={resetForm}>
        Register Another Organization
      </Button>
    </div>
  );
};

export default RegistrationSuccess;
