
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle } from "lucide-react";

interface CauseSelectorProps {
  selectedCauses: string[];
  onCauseToggle: (cause: string) => void;
  maxCauses?: number;
  causeOptions: string[];
}

const CauseSelector = ({ 
  selectedCauses, 
  onCauseToggle, 
  maxCauses = 3,
  causeOptions 
}: CauseSelectorProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-1">
      {causeOptions.map((cause) => {
        const isSelected = selectedCauses.includes(cause);
        return (
          <div 
            key={cause}
            className={`border rounded-md p-3 cursor-pointer transition-colors ${
              isSelected 
                ? 'bg-youth-blue/10 border-youth-blue text-youth-blue font-medium' 
                : 'hover:bg-accent border-input'
            }`}
            onClick={() => onCauseToggle(cause)}
          >
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`cause-${cause}`}
                checked={isSelected}
                className={isSelected ? "data-[state=checked]:bg-youth-blue data-[state=checked]:border-youth-blue" : ""}
              />
              <label 
                htmlFor={`cause-${cause}`}
                className="text-sm font-medium leading-none cursor-pointer"
              >
                {cause}
              </label>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CauseSelector;
