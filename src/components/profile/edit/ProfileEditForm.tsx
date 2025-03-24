
import { Form } from "@/components/ui/form";
import { useProfileEditForm } from "./useProfileEditForm";
import ProfileBasicInfoSection from "./ProfileBasicInfoSection";
import ProfileContactSection from "./ProfileContactSection";
import ProfileCausesSection from "./ProfileCausesSection";
import ProfileFormSkeleton from "./ProfileFormSkeleton";
import ProfileSubmitButton from "./ProfileSubmitButton";

interface ProfileEditFormProps {
  userId: string;
  onProfileUpdated: () => void;
}

const ProfileEditForm = ({ userId, onProfileUpdated }: ProfileEditFormProps) => {
  const { form, isLoading, isSaving, onSubmit } = useProfileEditForm(userId, onProfileUpdated);
  
  if (isLoading) {
    return <ProfileFormSkeleton />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ProfileBasicInfoSection form={form} />
        <ProfileContactSection form={form} />
        <ProfileCausesSection form={form} />
        <ProfileSubmitButton isSaving={isSaving} />
      </form>
    </Form>
  );
};

export default ProfileEditForm;
