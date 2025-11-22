"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader } from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DeleteTask from "@/components/delete-task";
import EditTask from "@/components/edit-task";

export default function TaskList({ initialTasks }: { initialTasks: any[] }) {
  const searchParams = useSearchParams();
  const [tasks, setTasks] = useState<any[]>(initialTasks ?? []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchTasks = async () => {
      setLoading(true);
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      const res = await fetch(`/api/tasks?${params.toString()}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (!mounted) return;
      setTasks(data);
      setLoading(false);
    };

    fetchTasks();
    return () => {
      mounted = false;
    };
  }, [searchParams]);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center h-screen">
        <Loader className="animate-spin" size={64} />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center">
        <h1 className="text-xl md:text-3xl font-bold my-4">No Tasks Found</h1>
        <p className="text-muted-foreground mb-4 text-sm md:text-lg">
          You currently have no tasks. Start by adding a new task!
        </p>
        <Image
          src="/undraw_add-tasks_mvlb.svg"
          alt="No Tasks Illustration"
          width={300}
          height={200}
          className="w-1/3 h-auto"
        />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => {
          const { id, title, description, priority, status } = task;

          return (
            <Card
              key={id}
              className="overflow-hidden relative group"
              data-task-id={id}
            >
              <CardHeader className="border-b mt-2">
                <div
                  role="button"
                  className="absolute top-2 left-2 text-destructive  hover:text-destructive/80 transition-colors duration-300"
                >
                  <Tooltip>
                    <TooltipTrigger>
                      <DeleteTask id={id} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete Task</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div
                  role="button"
                  className="absolute top-2 right-2 text-emerald-400  hover:text-emerald-400/80 transition-colors duration-300"
                >
                  <Tooltip>
                    <TooltipTrigger>
                      <EditTask
                        id={task.id}
                        task={{
                          ...task,
                          description: task.description ?? undefined,
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit Task</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                <CardAction>
                  <Badge
                    className="text-xs"
                    variant={
                      priority === "HIGH"
                        ? "high"
                        : priority === "MEDIUM"
                        ? "medium"
                        : "low"
                    }
                  >
                    {priority}
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-[15px]">
                  {description}
                </p>
              </CardContent>
              <CardFooter className="flex items-center justify-between mt-auto border-t">
                <StatusBadge id={id} status={status} />
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="text-xs">CN</AvatarFallback>
                </Avatar>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </>
  );
}
