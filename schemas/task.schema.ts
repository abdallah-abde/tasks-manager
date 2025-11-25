import z from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, {
    error: "Title is required",
  }),
  description: z.string().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).default("PENDING"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  userEmail: z.email({ error: "Email is invalid" }),
  userImage: z.string(),
  userName: z.string(),
});
