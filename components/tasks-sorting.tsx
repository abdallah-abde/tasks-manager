"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import {
  X,
  Loader,
  Filter,
  FilterX,
  ArrowUpDown,
  ChevronsUpDownIcon,
  CheckIcon,
  ChevronsUpDown,
  Check,
} from "lucide-react";
import { Input } from "./ui/input";
import { useDebouncedCallback } from "use-debounce";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";

const sortItems = [
  { value: "createdAt", label: "Creation Date" },
  { value: "priority", label: "Priority" },
  { value: "status", label: "Status" },
  { value: "title", label: "Title" },
];

export default function TaskSorting() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("createdAt");
  const [direction, setDirection] = useState(true); // false = asc, true = desc

  const [isPending, startTransition] = useTransition();
  const isLoading = isPending;

  const handleSortFieldClick = useDebouncedCallback(
    (field: string, dir: boolean) => {
      const params = new URLSearchParams(searchParams);
      // console.log(value);
      params.set("sortField", field);
      params.set("sortDir", dir ? "desc" : "asc");

      startTransition(() => {
        replace(`${pathname}?${params.toString()}`);
      });
    }
  );

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <ArrowUpDown className="cursor-pointer mr-12 sm:mr-20 size-9 transition-colors duration-300 hover:bg-secondary/95 rounded-lg p-2 absolute right-2" />
        </PopoverTrigger>
        <PopoverContent className="w-60 flex flex-col gap-4 items-center justify-center">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
                disabled={isLoading}
              >
                {value
                  ? sortItems.find((item) => item.value === value)?.label
                  : "Select Sort Item..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                {/* <CommandInput
                  placeholder="Search framework..."
                  className="h-9"
                /> */}
                <CommandList>
                  {/* <CommandEmpty>No framework found.</CommandEmpty> */}
                  <CommandGroup>
                    {sortItems.map((item) => (
                      <CommandItem
                        key={item.value}
                        value={item.value}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          console.log("current: ", currentValue);
                          setOpen(false);
                          handleSortFieldClick(currentValue, direction);
                        }}
                      >
                        {item.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            value === item.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <div className="flex gap-2 items-center">
            <Switch
              id="airplane-mode"
              checked={direction}
              onCheckedChange={(val) => {
                setDirection(val);
                handleSortFieldClick(value, val);
              }}
              disabled={isLoading}
            />
            <Label htmlFor="airplane-mode">
              {direction ? "Descending" : "Ascending"}
            </Label>
          </div>
          {isLoading && <Loader className="animate-spin" />}
        </PopoverContent>
      </Popover>
      {/* {!showSortOptions && (
        <Tooltip>
          <TooltipTrigger asChild>
            <ArrowUpDown
              className="cursor-pointer mr-20 size-9 transition-colors duration-300 hover:bg-secondary/95 rounded-lg p-2 absolute right-2"
              onClick={() => setShowSortOptions(true)}
            />
          </TooltipTrigger>
          <TooltipContent side="bottom">Show Sort</TooltipContent>
        </Tooltip>
      )} */}
    </>
  );
}
