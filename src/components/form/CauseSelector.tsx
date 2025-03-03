
import React from "react";
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
  causeOptions,
}: CauseSelectorProps) => {
  const [open, setOpen] = React.useState(false);

  // Ensure selectedCauses is always an array
  const normalizedSelectedCauses = Array.isArray(selectedCauses) ? selectedCauses : [];

  // Toggle cause selection - simplified to just call the parent handler
  const handleCauseToggle = (cause: string) => {
    console.log("CauseSelector - toggling cause:", cause);
    onCauseToggle(cause);
  };

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
            {normalizedSelectedCauses.length > 0 ? (
              <div className="flex flex-wrap gap-1 py-0.5">
                {normalizedSelectedCauses.map((cause) => (
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
                        handleCauseToggle(cause);
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

        <PopoverContent
          className="w-full min-w-[var(--radix-popover-trigger-width)] p-0 bg-background z-50"
          align="start"
        >
          <Command>
            <CommandList>
              <CommandEmpty>No causes found.</CommandEmpty>
              <CommandGroup>
                {causeOptions.map((cause) => {
                  const isSelected = normalizedSelectedCauses.includes(cause);
                  return (
                    <CommandItem
                      key={cause}
                      onSelect={() => {
                        console.log("Command item selected:", cause);
                        handleCauseToggle(cause);
                        // Don't auto-close the popover
                        // setOpen(false);
                      }}
                      className={cn(
                        "flex items-center justify-between cursor-pointer",
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

      <div className="text-sm text-muted-foreground">
        {normalizedSelectedCauses.length} of {maxCauses} selected
      </div>
    </div>
  );
};

export default CauseSelector;
