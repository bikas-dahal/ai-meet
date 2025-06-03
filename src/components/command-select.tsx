import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandResponsiveDialog,
} from "./ui/command";

interface Props {
  options: Array<{
    value: string;
    id: string;
    children: React.ReactNode;
  }>;
  onSelect: (value: string) => void;
  onSearch?: (value: string) => void;
  value: string;
  placeholder?: string;
  isSearchable?: boolean;
  className?: string;
}

export const CommandSelect = ({
  options,
  onSelect,
  onSearch,
  value,
  placeholder = "Select an option",
  className,
}: Props) => {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  const handleOpenChange = (value: boolean) => {
    onSearch?.("")
    setOpen(value)
  };

  return (
    <>
      <Button
        variant="outline"
        type="button"
        className={cn(
          "h-9 font-normal px-2 justify-between",
          !selectedOption && "text-muted-foreground",
          className
        )}
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="flex items-center gap-x-2">
          <span>{selectedOption?.children ?? placeholder}</span>
        </div>
        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
      </Button>
      <CommandResponsiveDialog shouldFilter={!onSearch} open={open} onOpenChange={handleOpenChange}>
        <CommandInput placeholder="Search..." onValueChange={onSearch} />
        <CommandList>
          <CommandEmpty>
            <span className="text-muted-foreground text-sm">No results.</span>
          </CommandEmpty>
          {options.map((option) => (
            <CommandItem
              key={option.id}
              onSelect={() => {
                onSelect(option.value);
                setOpen(false);
              }}
            >
              {option.children}
            </CommandItem>
          ))}
        </CommandList>
      </CommandResponsiveDialog>
    </>
  );
};
