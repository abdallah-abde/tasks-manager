"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

export default function SignInButton() {
  return (
    <Button
      variant="ghost"
      onClick={() => signIn()}
      className="bg-transparent hover:bg-transparent dark:hover:bg-transparent px-0 underline cursor-pointer text-xl hover:text-primary/50"
    >
      Login
    </Button>
  );
}
