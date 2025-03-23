
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { EventFormValues } from "./EventFormSchema";

interface LocationSectionProps {
  control: Control<EventFormValues>;
}

const LocationSection = ({ control }: LocationSectionProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-youth-charcoal">Location</h2>
      
      <FormField
        control={control}
        name="street"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street Address*</FormLabel>
            <FormControl>
              <Input placeholder="123 Main St" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City*</FormLabel>
              <FormControl>
                <Input placeholder="Vancouver" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Province/State*</FormLabel>
              <FormControl>
                <Input placeholder="BC" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="zip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal/ZIP Code*</FormLabel>
              <FormControl>
                <Input placeholder="V6B 1A1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default LocationSection;
