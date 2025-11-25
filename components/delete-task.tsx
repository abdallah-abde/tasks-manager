"use client";

import { deleteTask } from "@/actions/task.actions";
import { CircleX, Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DeleteTask({ id }: { id: number }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (
    e: React.MouseEvent<HTMLElement | SVGElement>,
    id: number
  ) => {
    const cardEl = document.querySelector(
      `[data-task-id="${id}"]`
    ) as HTMLElement | null;

    if (cardEl) {
      cardEl.classList.add("opacity-20", "pointer-events-none");
      cardEl.setAttribute("aria-busy", "true");
    }

    setIsDeleting(true);
    try {
      const result = await deleteTask(id);

      if (result?.success) {
        toast.success("Task Deleted successfully");
      } else {
        toast.error("Failed to delete task");
      }
    } catch (error) {
      toast.error("Failed to delete task");
    } finally {
      setIsDeleting(false);
      if (cardEl) {
        cardEl.classList.remove("opacity-20", "pointer-events-none");
        cardEl.removeAttribute("aria-busy");
      }
    }
  };

  return (
    <>
      {isDeleting ? (
        <Loader size={16} className="animate-spin" />
      ) : (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <CircleX size={16} className="cursor-pointer" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                task.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={(e) => handleDelete(e, id)}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
