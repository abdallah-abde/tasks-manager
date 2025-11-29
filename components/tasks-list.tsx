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
import { Task } from "@/app/generated/prisma/client";
import { useSession } from "next-auth/react";
import TasksPagination from "./tasks-pagination";
import { ITEMS_PER_PAGE } from "@/data/constants";
import { headers } from "next/headers";

export default function TaskList({
  initialTasks,
  initialTasksCount,
}: {
  initialTasks: Task[];
  initialTasksCount: number;
}) {
  const { data: session } = useSession();

  const searchParams = useSearchParams();
  const [tasks, setTasks] = useState<Task[]>(initialTasks ?? []);
  const [tasksCount, setTasksCount] = useState<number>(initialTasksCount ?? 0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchTasks = async () => {
      setLoading(true);

      const params = new URLSearchParams(Array.from(searchParams.entries()));

      const res = await fetch(`/api/tasks?${params.toString()}`, {
        headers: {
          "Cache-Control": "no-store",
        },
        cache: "no-store",
      });

      if (!res.ok) {
        setLoading(false);
        return;
      }

      const { tasks, tasksCount } = await res.json();

      if (!mounted) return;

      setTasks(tasks);
      setTasksCount(tasksCount);

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

  if (tasksCount === 0) {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 mb-4 w-full">
        {tasks.map((task) => {
          const {
            id,
            title,
            description,
            priority,
            status,
            userName,
            userImage,
            createdAt,
          } = task;

          return (
            <Card
              key={id}
              className="overflow-hidden relative group"
              data-task-id={id}
            >
              <CardHeader className="border-b mt-6">
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
                <div className="absolute top-2 right-1/2 translate-x-1/2 text-blue-400 transition-colors duration-300 text-sm">
                  {(() => {
                    const d = createdAt
                      ? new Date(createdAt as unknown as string)
                      : null;
                    return d && !isNaN(d.getTime()) ? d.toDateString() : "";
                  })()}
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
                  <AvatarImage
                    src={userImage || "/no-profile-image.png"}
                    alt={userName}
                    title={userName}
                  />
                  <AvatarFallback className="text-xs">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      {tasksCount / ITEMS_PER_PAGE > 1 && (
        <div className="border-t p-4">
          <TasksPagination tasks={tasks} tasksCount={tasksCount} />
        </div>
      )}
    </>
  );
}
