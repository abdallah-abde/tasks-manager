"use client";

import { Task } from "@/app/generated/prisma/client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { paginate } from "@/lib/paginate";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { ITEMS_PER_PAGE } from "@/data/constants";
import { cn } from "@/lib/utils";

export default function TasksPagination({
  tasks,
  tasksCount,
}: {
  tasks: Task[];
  tasksCount: number;
}) {
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const totalPages = Math.ceil(tasksCount / ITEMS_PER_PAGE);
  const results = paginate(totalPages, currentPage);

  return (
    <Pagination>
      <PaginationContent>
        {totalPages > 1 && currentPage > 1 && (
          <PaginationItem>
            <Button
              variant="ghost"
              asChild
              disabled={!(currentPage > 1)}
              className={
                !(currentPage > 1)
                  ? "cursor-not-allowed hover:bg-red-500"
                  : "cursor-pointer hover:bg-red-500"
              }
            >
              <PaginationPrevious
                href={currentPage > 1 ? createPageURL(currentPage - 1) : ""}
              />
            </Button>
          </PaginationItem>
        )}
        {totalPages > 1 &&
          results.map((page, index) => (
            <PaginationItem key={index}>
              {page === currentPage || page === "..." ? (
                <span
                  className={cn(
                    "p-2 px-3.5 siz-8 text-muted-foreground bg-muted rounded-lg",
                    [
                      page === "..."
                        ? "bg-transparent cursor-default tracking-[0.15rem]"
                        : "",
                    ]
                  )}
                >
                  {page}
                </span>
              ) : (
                <PaginationLink href={createPageURL(page)}>
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
        {totalPages > 1 && currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext
              href={
                currentPage < totalPages ? createPageURL(currentPage + 1) : ""
              }
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}

// // {pagesCount > 1 &&
// //   Array.from({ length: pagesCount }, (_, i) => (
// //     <PaginationItem key={i}>
// //       <PaginationLink href="#">{i + 1}</PaginationLink>
// //     </PaginationItem>
// //   ))}
// {/* <PaginationItem>
//   <PaginationEllipsis />
// </PaginationItem> */}
