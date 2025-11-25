"use server";

import { Status } from "@/app/generated/prisma/enums";
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

export async function deleteTask(id: number) {
  try {
    await prisma.task.delete({ where: { id } });
    revalidatePath("/");
    return { success: true } as const;
  } catch (error) {
    console.log(error);
    return { success: false, error: String(error) } as const;
  }
}

export async function updateTaskStatus(id: number, status: Status) {
  try {
    await prisma.task.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/");
    return { success: true } as const;
  } catch (error) {
    console.log(error);
    return { success: false, error: String(error) } as const;
  }
}

export async function updateTask(id: number, data: z.infer<typeof taskSchema>) {
  try {
    const result = await prisma.task.update({
      where: { id },
      data,
    });
    revalidatePath("/");
    return { success: true, data } as const;
  } catch (error) {
    console.log(error);
    return { success: false, error: String(error) } as const;
  }
}
