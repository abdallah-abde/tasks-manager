import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export default function page() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github", { redirectTo: "/" });
      }}
    >
      <Button
        type="submit"
        size="lg"
        variant="secondary"
        className="cursor-pointer"
      >
        <Github className="mr-2" /> Sign in with Github
      </Button>
    </form>
  );
}
