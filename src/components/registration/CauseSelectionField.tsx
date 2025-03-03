
import React from 'react';
import { FormField, FormItem, FormLabel, FormDescription, FormMessage } from '@/components/ui/form';
import { Control } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import CauseSelector from '@/components/form/CauseSelector';
import { FormValues } from './RegistrationTypes';

interface CauseSelectionFieldProps {
  control: Control<FormValues>;
  causeOptions: string[];
}

const CauseSelectionField = ({ control, causeOptions }: CauseSelectionFieldProps) => {
  const { toast } = useToast();

  const handleCauseToggle = (cause: string, currentCauses: string[], setValue: (name: "causes", value: string[]) => void) => {
    let newCauses: string[];
    
    if (currentCauses.includes(cause)) {
      newCauses = currentCauses.filter(c => c !== cause);
    } else {
      if (currentCauses.length >= 3) {
        toast({
          title: "Maximum causes reached",
          description: "You can select up to 3 causes. Remove one to add another.",
          variant: "destructive",
        });
        return;
      }
      newCauses = [...currentCauses, cause];
    }
    
    setValue("causes", newCauses);
  };

  return (
    <FormField
      control={control}
      name="causes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Select up to 3 Main Causes*</FormLabel>
          <CauseSelector 
            selectedCauses={field.value}
            onCauseToggle={(cause) => handleCauseToggle(cause, field.value, field.onChange)}
            causeOptions={causeOptions}
          />
          <FormDescription>
            These will help match you with volunteers interested in your cause areas
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CauseSelectionField;
