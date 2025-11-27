import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import TaskList from "@/components/tasks-list";
import { ITEMS_PER_PAGE } from "@/data/constants";
import TasksControls from "@/components/tasks-controls";

export default async function Home(props: {
  searchParams?: Promise<{
    priority?: string;
    status?: string;
    query?: string;
    page?: string;
    sortField?: string;
    sortDir?: string;
  }>;
}) {
  const sp = (await props.searchParams) ?? {};
  const priority = sp.priority || "ANY";
  const status = sp.status || "ANY";
  const query = sp.query || "";
  const page = sp.page || "";
  const sortField = sp.sortField || "createdAt";
  const sortDir = sp.sortDir || "desc";

  const where: Record<string, any> = {};

  if (priority && priority !== "ANY") where.priority = priority;
  if (status && status !== "ANY") where.status = status;
  if (query)
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];

  const orderBy: Record<string, any> = {};

  orderBy[sortField] = sortDir === "desc" ? "desc" : "asc";

  const tasks = await prisma.task.findMany({
    where,
    orderBy,
    skip: page ? (Number(page) - 1) * ITEMS_PER_PAGE : 0,
    take: ITEMS_PER_PAGE,
  });

  const tasksCount = await prisma.task.count({ where });

  return (
    <div className="mx-auto">
      <div className="flex items-center xl:items-center justify-between flex-col xl:flex-row gap-3 mb-4 border-b pb-4 relative">
        <div className="flex items-center gap-0.5 self-center min-w-40">
          <h1 className="text-2xl font-bold pl-4">My Tasks</h1>
          {tasksCount > 0 && (
            <Badge className="self-start text-[10px]" variant={"secondary"}>
              {tasksCount}
            </Badge>
          )}
        </div>
        <TasksControls />
      </div>
      <>
        {tasksCount === 0 ? (
          <div className="container mx-auto flex flex-col items-center justify-center">
            <h1 className="text-xl md:text-3xl font-bold my-4">
              No Tasks Found
            </h1>
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
        ) : (
          <TaskList initialTasks={tasks} initialTasksCount={tasksCount} />
        )}
      </>

      {/* TODO: FILTER BY DATE */}
      {/* TODO: SETTINGS (items per page) |  */}
    </div>
  );
}
