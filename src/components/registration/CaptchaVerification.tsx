
import { useEffect, useState } from 'react';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Control } from 'react-hook-form';
import { FormValues } from './RegistrationTypes';

interface CaptchaVerificationProps {
  control: Control<FormValues>;
  onTokenChange: (token: string | null) => void;
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

// Use the provided site key - configured for the correct domain
const RECAPTCHA_SITE_KEY = '6LfuS-sqAAAAACoes-qA9Qz-1TjRC-tbxfdZlUwn';

const CaptchaVerification = ({ control, onTokenChange }: CaptchaVerificationProps) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize reCAPTCHA when component mounts
  useEffect(() => {
    if (!window.grecaptcha) {
      setError("reCAPTCHA library failed to load. Please check your internet connection or try again later.");
      return;
    }

    window.grecaptcha.ready(() => {
      console.log("reCAPTCHA is ready");
      setIsReady(true);
      setError(null);
      
      // Generate an initial token when ready
      executeRecaptcha();
    });

    // Regenerate token every 2 minutes to prevent expiration
    const intervalId = setInterval(() => {
      if (isReady) {
        executeRecaptcha();
      }
    }, 120000);

    return () => {
      clearInterval(intervalId);
      // Clear token when component unmounts
      onTokenChange(null);
    };
  }, [isReady]);

  const executeRecaptcha = async () => {
    if (!window.grecaptcha || !isReady) return;

    try {
      console.log("Executing reCAPTCHA...");
      const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { 
        action: 'registration_submit' 
      });
      
      console.log("reCAPTCHA token generated:", token.substring(0, 10) + '...');
      onTokenChange(token);
    } catch (err) {
      console.error("reCAPTCHA execution error:", err);
      setError("Failed to verify you're not a robot. Please reload the page and try again.");
      onTokenChange(null);
    }
  };

  return (
    <FormField
      control={control}
      name="captchaVerified"
      render={({ field }) => {
        // Set captchaVerified based on whether we have a token
        field.onChange(isReady && !error);
        
        return (
          <FormItem>
            <FormLabel>Security Verification</FormLabel>
            <div className="text-sm text-youth-charcoal/70">
              {error ? (
                <div className="text-red-500">{error}</div>
              ) : (
                <>
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
                </>
              )}
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default CaptchaVerification;
