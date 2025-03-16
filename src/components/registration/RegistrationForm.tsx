
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';

// Import form components
import OrganizationInfoFields from './OrganizationInfoFields';
import MissionFields from './MissionFields';
import CauseSelectionField from './CauseSelectionField';
import ProfileImageUpload from './ProfileImageUpload';

// Import types
import { FormValues } from './RegistrationTypes';
import { useForm } from 'react-hook-form';

// reCAPTCHA site key
const RECAPTCHA_SITE_KEY = "6LeIuPUqAAAAAN1K4DV9mMM5B-ViLLvqsuQOqYN0"; // Replace this with your new site key when ready

interface RegistrationFormProps {
  form: ReturnType<typeof useForm<FormValues>>;
  isSubmitting: boolean;
  profileImage: File | null;
  setProfileImage: (file: File | null) => void;
  imageError: string | null;
  setImageError: (error: string | null) => void;
  captchaToken: string | null;
  captchaError: string | null;
  handleCaptchaChange: (token: string | null) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  causeAreas: string[];
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  form,
  isSubmitting,
  profileImage,
  setProfileImage,
  imageError,
  setImageError,
  captchaToken,
  captchaError,
  handleCaptchaChange,
  onSubmit,
  causeAreas
}) => {
  return (
    <div className="glass-panel p-8 mt-8">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <OrganizationInfoFields control={form.control} />
          <MissionFields control={form.control} />
          <CauseSelectionField 
            control={form.control} 
            causeOptions={causeAreas} 
          />
          <ProfileImageUpload 
            setProfileImage={setProfileImage} 
            setImageError={setImageError}
            imageError={imageError}
          />
          
          <div className="mt-6">
          
          </div>
          
          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full btn-primary hover:scale-[1.02] transition-transform"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Registration"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RegistrationForm;

 /*
            <p className="text-sm text-youth-charcoal mb-2">
                <span className="opacity-50">CAPTCHA verification temporarily disabled - </span>
                You can skip this step:
              </p>
              <ReCAPTCHA
                sitekey={RECAPTCHA_SITE_KEY}
              onChange={handleCaptchaChange}
              />
              {captchaError && (
                <p className="mt-1 text-sm text-opacity-50 text-gray-500">
                  CAPTCHA verification is currently optional
                </p>
              )}
            */
