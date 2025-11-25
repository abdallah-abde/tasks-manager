"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { taskSchema } from "@/schemas/task.schema";
import { createTask } from "@/actions/task.actions";
import { useSession } from "next-auth/react";

export function AddTaskForm() {
  const { data: session } = useSession();

  if (!session || !session.user || !session.user.email) {
    return;
  }

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema) as Resolver<z.infer<typeof taskSchema>>,
    defaultValues: {
      title: "",
      description: "",
      status: "PENDING",
      priority: "MEDIUM",
      userEmail: session.user.email,
      userName: session.user.name || "",
      userImage: session.user.image || "",
    },
  });

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: z.infer<typeof taskSchema>) {
    setIsSubmitting(true);
    try {
      const result = await createTask(values);
      if (result?.success) {
        toast.success("Task created successfully");
        // navigate to home (My Tasks)
        router.push("/");
      } else {
        toast.error("Failed to create task");
      }
    } catch (err) {
      toast.error("Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="px-4">
      <h1 className="text-2xl font-bold mb-4">Add New Task</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-1/2"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Tell me what's your task title..."
                    {...field}
                    className=""
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell me what's your task description..."
                    {...field}
                    className="resize-none h-30"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={form.getValues("priority")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={form.getValues("status")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="IN_PROGRESS">In_Progress</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant="secondary"
            className="w-full cursor-pointer"
            disabled={isSubmitting}
          >
            <PlusCircle />
            {isSubmitting ? "Adding..." : "Add New Task"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
