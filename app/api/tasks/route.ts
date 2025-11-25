import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const priority = url.searchParams.get("priority") || undefined;
    const status = url.searchParams.get("status") || undefined;
    const query = url.searchParams.get("query") || undefined;

    const where: any = {};
    if (priority && priority !== "ANY") where.priority = priority;
    if (status) where.status = status;
    if (query)
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
