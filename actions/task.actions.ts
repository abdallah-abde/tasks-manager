"use server";
import prisma from "@/lib/prisma";
import { taskSchema } from "@/schemas/task.schema";
import { revalidatePath } from "next/cache";
import z from "zod";

export async function createTask(data: z.infer<typeof taskSchema>) {
  try {
    const task = await prisma.task.create({ data });
    revalidatePath("/");
    return { success: true, task } as const;
  } catch (error) {
    console.log(error);
    return { success: false, error: String(error) } as const;
  }
}
