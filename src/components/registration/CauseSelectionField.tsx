
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
    try {
      // Ensure currentCauses is always an array
      const safeCurrentCauses = Array.isArray(currentCauses) ? currentCauses : [];
      
      if (safeCurrentCauses.includes(cause)) {
        // If cause is already selected, remove it
        setValue("causes", safeCurrentCauses.filter(c => c !== cause));
      } else {
        // If cause is not selected, add it if we haven't reached the maximum
        if (safeCurrentCauses.length >= 3) {
          toast({
            title: "Maximum causes reached",
            description: "You can select up to 3 causes. Remove one to add another.",
            variant: "destructive",
          });
          return;
        }
        setValue("causes", [...safeCurrentCauses, cause]);
      }
    } catch (error) {
      console.error("Error in handleCauseToggle:", error);
      toast({
        title: "Error selecting cause",
        description: "There was an error processing your selection. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <FormField
      control={control}
      name="causes"
      render={({ field }) => {
        // Ensure field.value is always an array
        const safeValue = Array.isArray(field.value) ? field.value : [];
        
        return (
          <FormItem>
            <FormLabel>Select up to 3 Main Causes*</FormLabel>
            <CauseSelector 
              selectedCauses={safeValue}
              onCauseToggle={(cause) => handleCauseToggle(cause, safeValue, field.onChange)}
              causeOptions={causeOptions}
            />
            <FormDescription>
              These will help match you with volunteers interested in your cause areas
            </FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default CauseSelectionField;
