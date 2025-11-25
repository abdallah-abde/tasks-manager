import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";

import "../globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { AppSidebar } from "@/components/app-sidebar";

import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";

import SessionProvider from "@/components/session-provider";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
// import { getServerSession } from "next-auth";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Tasks Manager App",
  description: "An application to manage daily tasks",
};

export default async function RootLayout({
  breadcrumb,
  children,
}: Readonly<{
  breadcrumb: React.ReactNode;
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const session = await auth();

  if (!session || !session.user) {
    redirect("/sign-in");
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
            <SidebarProvider defaultOpen={defaultOpen}>
              <AppSidebar />
              <main className="w-full">
                <div className="flex items-center mb-4 border-b p-2">
                  <SidebarTrigger />
                  <Separator
                    orientation="vertical"
                    className="mx-2 mr-4 data-[orientation=vertical]:h-4"
                  />
                  {breadcrumb}
                </div>
                <div className=" pb-4">
                  {/* <SessionProvider session={session}> */}
                  {children}
                  {/* </SessionProvider> */}
                </div>
              </main>
            </SidebarProvider>
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
