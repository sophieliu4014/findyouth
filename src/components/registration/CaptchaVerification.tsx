
import React, { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Control } from 'react-hook-form';
import { FormValues } from './RegistrationTypes';

interface CaptchaVerificationProps {
  control: Control<FormValues>;
}

// List of pre-defined CAPTCHA challenges with answers
const captchaOptions = [
  { image: '/captcha/captcha1.jpg', answer: 'D7X9F2' },
  { image: '/captcha/captcha2.jpg', answer: 'B3K5M8' },
  { image: '/captcha/captcha3.jpg', answer: 'P6R2T5' },
  { image: '/captcha/captcha4.jpg', answer: 'W4J9L1' },
  { image: '/captcha/captcha5.jpg', answer: 'A7C3E8' },
];

const CaptchaVerification = ({ control }: CaptchaVerificationProps) => {
  const [captchaInput, setCaptchaInput] = useState('');
  const [currentCaptcha, setCurrentCaptcha] = useState<{ image: string; answer: string }>({ 
    image: '', 
    answer: '' 
  });

  const generateCaptcha = () => {
    const randomIndex = Math.floor(Math.random() * captchaOptions.length);
    setCurrentCaptcha(captchaOptions[randomIndex]);
    setCaptchaInput('');
    return captchaOptions[randomIndex];
  };
  
  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleCaptchaChange = (value: string, setValue: (name: "captchaVerified", value: boolean) => void) => {
    setCaptchaInput(value);
    
    // Case insensitive comparison
    const isVerified = value.toUpperCase() === currentCaptcha.answer.toUpperCase();
    setValue("captchaVerified", isVerified);
  };
  
  const refreshCaptcha = () => {
    generateCaptcha();
  };

  return (
    <FormField
      control={control}
      name="captchaVerified"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Verification*</FormLabel>
          <div className="glass-card p-4">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-sm font-medium">Enter the characters shown in the image:</h3>
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
            
            <div className="flex flex-col space-y-3">
              {currentCaptcha.image && (
                <div className="captcha-image-container border border-gray-300 rounded overflow-hidden max-w-md">
                  <img 
                    src={currentCaptcha.image} 
                    alt="CAPTCHA verification" 
                    className="w-full h-auto"
                  />
                </div>
              )}
              <Input 
                type="text" 
                value={captchaInput} 
                onChange={(e) => handleCaptchaChange(e.target.value, field.onChange)}
                className="max-w-xs"
                placeholder="Enter the code"
              />
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CaptchaVerification;
