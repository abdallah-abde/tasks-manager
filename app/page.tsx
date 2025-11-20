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
import { CheckCircle2, Hourglass, Loader } from "lucide-react";

export default async function Home() {
  const tasks = await prisma.task.findMany();

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map(({ id, title, description, priority, status }) => (
          <Card key={id}>
            <CardHeader className="border-b">
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
            </CardFooter>
          </Card>
        ))}
      </div>
      {/* TODO: USER */}
    </div>
  );
}
