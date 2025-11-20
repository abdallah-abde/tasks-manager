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

export default async function Home() {
  const tasks = await prisma.task.findMany();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
      {tasks.map(({ id, title, description, priority, status }) => (
        <Card key={id}>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardAction>
              <Badge
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
            <p>{description}</p>
          </CardContent>
          <CardFooter>
            <Badge variant="default">{status}</Badge>
          </CardFooter>
        </Card>
      ))}
      {/* TODO: USER */}
    </div>
  );
}
