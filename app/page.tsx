import prisma from "@/lib/prisma";

import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, Edit, Filter, Hourglass, Loader } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import DeleteTask from "@/components/DeleteTask";
import Image from "next/image";

export default async function Home() {
  const tasks = await prisma.task.findMany();

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
    <div className="container mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-0.5">
          <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
          <Badge className="self-start text-[10px]" variant={"secondary"}>
            {tasks.length}
          </Badge>
        </div>
        <div>
          <Filter />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map(({ id, title, description, priority, status }) => (
          <Card
            key={id}
            className="overflow-hidden relative group"
            data-task-id={id}
          >
            <CardHeader className="border-b mt-2">
              <div
                role="button"
                className="absolute top-2 left-2 text-destructive  hover:text-destructive/80 transition-transform duration-300"
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
              <p className="text-muted-foreground text-[15px]">{description}</p>
            </CardContent>
            <CardFooter className="flex items-center justify-between mt-auto border-t">
              <Badge
                variant="outline"
                className="text-[11px] border-0 bg-primary/5 text-primary"
              >
                {status === "COMPLETED" ? (
                  <>
                    <CheckCircle2 className="text-emerald-400" /> {status}
                  </>
                ) : status === "IN_PROGRESS" ? (
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
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="text-xs">CN</AvatarFallback>
              </Avatar>
              <div
                role="button"
                className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/6 bg-secondary rounded-tl-full rounded-tr-full p-1.5 outline-8  hover:bg-secondary/80 hover:translate-y-0 cursor-pointer transition-transform duration-300"
              >
                <Tooltip>
                  <TooltipTrigger>
                    <Edit size={16} className="cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit Task</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      {/* TODO: USER */}
      {/* TODO: CHART */}
      {/* TODO: Filters */}
    </div>
  );
}
