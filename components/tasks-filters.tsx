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
import { X, Loader } from "lucide-react";
import { Input } from "./ui/input";
import { useDebouncedCallback } from "use-debounce";
import { Label } from "./ui/label";

export default function TaskFilters() {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const isLoading = isPending;

  const currentPriority = searchParams.get("priority") || "";
  const currentStatus = searchParams.get("status") || "";
  const searchText = searchParams.get("query") || "";
  const [searchTerm, setSearchTerm] = useState<string>(searchText);

  const setParam = useDebouncedCallback((key: string, value: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  });

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    startTransition(() => {
      replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
    });
  }, 300);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-start md:items-center xl:items-end gap-4 w-full xl:flex xl:justify-end pr-4">
      <div className="flex items-center gap-2 w-full xl:w-96">
        <Label className="text-sm text-muted-foreground" htmlFor="search">
          Search
        </Label>
        <Input
          name="search"
          placeholder="Search Tasks..."
          value={searchTerm}
          onChange={(e) => {
            const v = e.target.value;
            setSearchTerm(v);
            handleSearch(v);
          }}
          disabled={isLoading}
        />
      </div>
      <div className="flex items-center gap-2 w-full xl:w-64">
        <Label className="text-sm text-muted-foreground" htmlFor="priority">
          Priority
        </Label>
        <Select
          name="priority"
          value={currentPriority}
          onValueChange={(v) => setParam("priority", v)}
          disabled={isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="ANY" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ANY">Any</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 w-full xl:w-64">
        <Label className="text-sm text-muted-foreground" htmlFor="status">
          Status
        </Label>
        <Select
          name="status"
          value={currentStatus}
          onValueChange={(v) => setParam("status", v)}
          disabled={isLoading}
        >
          <SelectTrigger className="w-full ">
            <SelectValue placeholder="ANY" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ANY">Any</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 w-full lg:col-span-3 lg:row-span-3 xl:col-span-1 xl:row-span-1 xl:w-auto">
        <Button
          variant="outline"
          className="cursor-pointer ml-auto"
          onClick={() => {
            setSearchTerm("");
            startTransition(() => replace("/"));
          }}
          disabled={isLoading}
        >
          <X />
          Reset
        </Button>
        {isLoading && <Loader className="animate-spin" size={16} />}
      </div>
    </div>
  );
}
