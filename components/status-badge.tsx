"use client";

import { Status } from "@/app/generated/prisma/enums";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle2, Hourglass, Loader, Save, X } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { updateTaskStatus } from "@/actions/task.actions";

export default function StatusBadge({
  id,
  status,
}: {
  id: number;
  status: Status;
}) {
  const [currentStatus, setCurrentStatus] = useState<Status>(status);
  const [showSelectStatus, setShowSelectStatus] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleChangeStatus(id: number, currentStatus: Status) {
    setIsUpdating(true);
    try {
      const result = await updateTaskStatus(id, currentStatus);
      if (result?.success) {
        setShowSelectStatus(false);
      } else {
        // handle error
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <>
      {showSelectStatus ? (
        <div className="flex items-center gap-1">
          <Select
            value={currentStatus}
            onValueChange={(v) => {
              setCurrentStatus(v as Status);
              // setShowSelectStatus(false);
            }}
            disabled={isUpdating}
          >
            <SelectTrigger className="w-28 text-[10px]" size="sm">
              <SelectValue placeholder="Status" className="text-[10px]" />
            </SelectTrigger>
            <SelectContent side="top">
              {Array.from(Object.values(Status)).map((statusOption) => (
                <SelectItem
                  key={statusOption}
                  value={statusOption}
                  className="text-[10px]"
                >
                  {statusOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="cursor-pointer"
                onClick={() => handleChangeStatus(id, currentStatus)}
                disabled={isUpdating}
              >
                {isUpdating ? <Loader className="animate-spin" /> : <Save />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="cursor-pointer"
                onClick={() => setShowSelectStatus(false)}
                disabled={isUpdating}
              >
                <X />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Cancel</TooltipContent>
          </Tooltip>
        </div>
      ) : (
        <Tooltip>
          <TooltipTrigger>
            <Badge
              variant="outline"
              className="text-[11px] border-0 bg-primary/5 text-primary select-none"
              onDoubleClick={() => {
                setShowSelectStatus(true);
                setCurrentStatus(status);
              }}
            >
              {status === Status.COMPLETED ? (
                <>
                  <CheckCircle2 className="text-emerald-400" /> {status}
                </>
              ) : status === Status.IN_PROGRESS ? (
                <>
                  <Loader className="text-yellow-600" />
                  {status}
                </>
              ) : (
                <>
                  <Hourglass className="text-rose-400" /> {status}
                </>
              )}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Double click to change status</p>
          </TooltipContent>
        </Tooltip>
      )}
    </>
  );
}
