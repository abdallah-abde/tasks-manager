// import { auth } from "@/auth";
import { AddTaskForm } from "@/components/add-task";
// import { redirect } from "next/navigation";

export default async function page() {
  // const session = await auth();

  // if (!session || !session.user) {
  //   redirect("/sign-in");
  // }

  return <AddTaskForm />;
}
