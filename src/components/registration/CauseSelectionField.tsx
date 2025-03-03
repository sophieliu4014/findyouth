
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

  return (
    <FormField
      control={control}
      name="causes"
      render={({ field }) => {
        // Ensure field.value is always an array
        const safeValue = Array.isArray(field.value) ? field.value : [];
        
        const handleToggle = (cause: string) => {
          console.log("CauseSelectionField - toggling cause:", cause, "Current causes:", safeValue);
          
          try {
            if (safeValue.includes(cause)) {
              // Remove the cause if already selected
              console.log("Removing cause:", cause);
              field.onChange(safeValue.filter(c => c !== cause));
            } else {
              // Add the cause if under limit
              if (safeValue.length >= 3) {
                console.log("Max causes reached");
                toast({
                  title: "Maximum causes reached",
                  description: "You can select up to 3 causes. Remove one to add another.",
                  variant: "destructive",
                });
                return;
              }
              
              console.log("Adding cause:", cause);
              field.onChange([...safeValue, cause]);
            }
          } catch (error) {
            console.error("Error in handleToggle:", error);
            toast({
              title: "Error selecting cause",
              description: "There was an error processing your selection. Please try again.",
              variant: "destructive",
            });
          }
        };
        
        return (
          <FormItem>
            <FormLabel>Select up to 3 Main Causes*</FormLabel>
            <CauseSelector 
              selectedCauses={safeValue}
              onCauseToggle={handleToggle}
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
