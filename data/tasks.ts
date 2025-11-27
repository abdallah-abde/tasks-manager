import prisma from "@/lib/prisma";
import { subMonths, startOfDay } from "date-fns";

export const getTasksCount = async () => {
  const count = await prisma.task.count();
  return count;
};

export type DailyTaskCount = {
  date: string;
  pending: number;
  inProgress: number;
  completed: number;
  total: number;
};

export async function getDailyTaskCounts() {
  // 1. Get tasks from the last 3 months
  const tasks = await prisma.task.findMany({
    where: {
      createdAt: {
        gte: subMonths(new Date(), 3),
      },
    },
    select: {
      createdAt: true,
      status: true,
    },
  });

  // 2. Group by day
  const grouped: Record<string, DailyTaskCount> = {};

  for (const task of tasks) {
    const day = startOfDay(task.createdAt).toISOString().split("T")[0]; // yyyy-mm-dd

    if (!grouped[day]) {
      grouped[day] = {
        date: day,
        pending: 0,
        inProgress: 0,
        completed: 0,
        total: 0,
      };
    }

    if (task.status === "PENDING") grouped[day].pending++;
    if (task.status === "IN_PROGRESS") grouped[day].inProgress++;
    if (task.status === "COMPLETED") grouped[day].completed++;

    grouped[day].total++;
  }

  // 3. Convert to array sorted by date
  return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
}
