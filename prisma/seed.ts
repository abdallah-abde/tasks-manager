import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const taskData: Prisma.TaskCreateInput[] = [
  {
    title: "This is my first task",
    description: "This task is created for seeding purposes",
    status: "PENDING",
    priority: "MEDIUM",
  },
  {
    title: "This is my second task",
    description: "This task is created for seeding purposes",
    status: "IN_PROGRESS",
    priority: "HIGH",
  },
];

export async function main() {
  for (const u of taskData) {
    await prisma.task.create({ data: u });
  }
}

main();
