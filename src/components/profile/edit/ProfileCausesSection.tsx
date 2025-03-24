
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "./useProfileEditForm";
import CauseSelector from "@/components/form/CauseSelector";
import { causeAreas } from "@/components/form/filters/FilterConstants";

// Remove "All Causes" from the list of selectable causes
const profileCauseAreas = causeAreas.filter(cause => cause !== "All Causes");

interface ProfileCausesSectionProps {
  form: UseFormReturn<ProfileFormValues>;
}

const ProfileCausesSection = ({ form }: ProfileCausesSectionProps) => {
  return (
    <FormField
      control={form.control}
      name="causes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Cause Areas*</FormLabel>
          <FormControl>
            <CauseSelector
              selectedCauses={field.value}
              onCauseToggle={(cause) => {
                const currentValue = field.value || [];
                if (currentValue.includes(cause)) {
                  field.onChange(currentValue.filter(c => c !== cause));
                } else if (currentValue.length < 3) {
                  field.onChange([...currentValue, cause]);
                }
              }}
              maxCauses={3}
              causeOptions={profileCauseAreas}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ProfileCausesSection;
