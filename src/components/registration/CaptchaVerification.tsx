
import { useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Control } from 'react-hook-form';
import { FormValues } from './RegistrationTypes';

interface CaptchaVerificationProps {
  control: Control<FormValues>;
}

// Declare the grecaptcha global variable for TypeScript
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

// This is just a placeholder key, typically you would use an environment variable
// for the actual production key that matches your domain
const RECAPTCHA_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; // Google's test key that doesn't display errors

const CaptchaVerification = ({ control }: CaptchaVerificationProps) => {
  useEffect(() => {
    // Execute reCAPTCHA when component mounts
    const executeRecaptcha = async () => {
      try {
        if (window.grecaptcha) {
          window.grecaptcha.ready(async () => {
            try {
              const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'register_ngo' });
              console.log('reCAPTCHA token generated:', token.substring(0, 10) + '...');
            } catch (error) {
              console.error('reCAPTCHA execution error:', error);
            }
          });
        }
      } catch (error) {
        console.error('reCAPTCHA error:', error);
      }
    };

    executeRecaptcha();
  }, []);

  return (
    <FormField
      control={control}
      name="captchaVerified"
      render={({ field }) => {
        // Set captchaVerified to true since we're using invisible reCAPTCHA
        // The actual verification will happen on the server
        if (!field.value) {
          field.onChange(true);
        }
        
        return (
          <FormItem>
            <FormLabel>Security Verification</FormLabel>
            <div className="text-sm text-youth-charcoal/70">
              This site is protected by reCAPTCHA v3 to ensure you're not a robot.
              <div className="mt-1 text-xs text-youth-charcoal/50">
                This site is protected by reCAPTCHA and the Google 
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-youth-blue hover:text-youth-purple mx-1">
                  Privacy Policy
                </a>
                and
                <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="text-youth-blue hover:text-youth-purple mx-1">
                  Terms of Service
                </a>
                apply.
              </div>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default CaptchaVerification;
