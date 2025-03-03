
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

const CaptchaVerification = ({ control }: CaptchaVerificationProps) => {
  const [captchaValue, setCaptchaValue] = useState(0);
  const [captchaTarget, setCaptchaTarget] = useState(0);
  const [captchaNumbers, setCaptchaNumbers] = useState({ num1: 0, num2: 0 });

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    setCaptchaValue(0);
    setCaptchaTarget(num1 + num2);
    setCaptchaNumbers({ num1, num2 });
    return { num1, num2 };
  };
  
  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleCaptchaChange = (value: string, setValue: (name: "captchaVerified", value: boolean) => void) => {
    const numValue = parseInt(value);
    setCaptchaValue(isNaN(numValue) ? 0 : numValue);
    
    setValue("captchaVerified", numValue === captchaTarget);
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
              <h3 className="text-sm font-medium">Solve the simple math problem:</h3>
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
            
            <div className="flex items-center gap-3">
              <div className="text-lg font-medium">
                {captchaNumbers.num1} + {captchaNumbers.num2} = ?
              </div>
              <Input 
                type="number" 
                value={captchaValue || ''} 
                onChange={(e) => handleCaptchaChange(e.target.value, field.onChange)}
                className="w-20"
                placeholder="?"
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
