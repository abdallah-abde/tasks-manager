import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";

import "@/app/globals.css";

import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Tasks Manager App",
  description: "An application to manage daily tasks",
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (session && session?.user) {
    redirect("/");
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body cz-shortcut-listen="true">
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="w-full h-screen flex items-center justify-center">
              {children}
            </main>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
