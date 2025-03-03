
import React from 'react';
import { Check, X, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-10"
          >
            {selectedCauses.length > 0 ? (
              <div className="flex flex-wrap gap-1 py-0.5">
                {selectedCauses.map(cause => (
                  <Badge 
                    key={cause} 
                    variant="secondary"
                    className="flex items-center gap-1 bg-youth-blue/10 text-youth-blue border-youth-blue"
                  >
                    {cause}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onCauseToggle(cause);
                      }}
                    />
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground">Select causes...</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full min-w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            <CommandList>
              <CommandEmpty>No causes found.</CommandEmpty>
              <CommandGroup>
                {causeOptions.map((cause) => {
                  const isSelected = selectedCauses.includes(cause);
                  return (
                    <CommandItem
                      key={cause}
                      onSelect={() => {
                        onCauseToggle(cause);
                        // Only close popover if we're at max causes after selection
                        if (selectedCauses.length >= maxCauses && !isSelected) {
                          setOpen(false);
                        }
                      }}
                      className={cn(
                        "flex items-center justify-between",
                        isSelected && "bg-youth-blue/10 text-youth-blue font-medium"
                      )}
                    >
                      <span>{cause}</span>
                      {isSelected && <Check className="h-4 w-4 ml-2" />}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      {selectedCauses.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {selectedCauses.length} of {maxCauses} selected
        </div>
      )}
    </div>
  );
};

export default CauseSelector;
