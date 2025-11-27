import { ITEMS_PER_PAGE } from "@/data/constants";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const priority = url.searchParams.get("priority") || "ANY";
    const status = url.searchParams.get("status") || "ANY";
    const query = url.searchParams.get("query") || "";
    const page = url.searchParams.get("page") || "";
    const sortField = url.searchParams.get("sortField") || "createdAt";
    const sortDir = url.searchParams.get("sortDir") || "desc";

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

    return NextResponse.json({ tasks, tasksCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
