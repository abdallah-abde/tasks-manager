import { TasksChart } from "@/components/tasks-chart";
import { getDailyTaskCounts } from "@/data/tasks";

export default async function page() {
  const results = await getDailyTaskCounts();

  return (
    <div className="px-4">
      <TasksChart data={results} />
    </div>
  );
}
