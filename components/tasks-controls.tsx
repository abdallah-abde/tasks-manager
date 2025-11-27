"use client";

import { useState } from "react";
import TaskFilters from "./tasks-filters";
import TaskSorting from "./tasks-sorting";
import { useSearchParams } from "next/navigation";

export default function TasksControls() {
  const searchParams = useSearchParams();

  const [showFilters, setShowFilters] = useState(
    searchParams.size > 1 ||
      (searchParams.size === 1 &&
        searchParams.entries().next().value?.[0] !== "page")
  );

  const [showSortOptions, setShowSortOptions] = useState(false);

  return (
    <>
      <TaskFilters showFilters={showFilters} setShowFilters={setShowFilters} />

      {!showFilters && <TaskSorting />}
    </>
  );
}
