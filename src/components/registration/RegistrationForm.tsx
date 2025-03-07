
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Import form components
import OrganizationInfoFields from './OrganizationInfoFields';
import MissionFields from './MissionFields';
import CauseSelectionField from './CauseSelectionField';
import ProfileImageUpload from './ProfileImageUpload';
import CaptchaVerification from './CaptchaVerification';

// Import types
import { FormValues } from './RegistrationTypes';
import { useForm } from 'react-hook-form';

interface RegistrationFormProps {
  form: ReturnType<typeof useForm<FormValues>>;
  isSubmitting: boolean;
  profileImage: File | null;
  setProfileImage: (file: File | null) => void;
  imageError: string | null;
  setImageError: (error: string | null) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  causeAreas: string[];
  setRecaptchaToken: (token: string | null) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  form,
  isSubmitting,
  profileImage,
  setProfileImage,
  imageError,
  setImageError,
  onSubmit,
  causeAreas,
  setRecaptchaToken
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
          <CaptchaVerification 
            control={form.control} 
            onTokenChange={setRecaptchaToken}
          />
          
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
