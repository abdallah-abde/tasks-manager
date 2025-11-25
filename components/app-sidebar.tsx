"use client";

import { usePathname } from "next/navigation";

import {
  Calendar,
  CheckSquare,
  EllipsisVertical,
  Inbox,
  LogIn,
  LogOut,
  PlusSquare,
  Search,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ModeToggle } from "./mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";

// Menu items.
const items = [
  {
    title: "My Tasks",
    url: "/",
    icon: CheckSquare,
  },
  {
    title: "Add New Task",
    url: "/add-task",
    icon: PlusSquare,
  },
  // {
  //   title: "Inbox",
  //   url: "#",
  //   icon: Inbox,
  // },
  // {
  //   title: "Calendar",
  //   url: "#",
  //   icon: Calendar,
  // },
  // {
  //   title: "Search",
  //   url: "#",
  //   icon: Search,
  // },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  const { data: session } = useSession();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-between text-lg  mb-1">
            Tasks Manager <ModeToggle />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.url === pathname}
                    tooltip={item.title}
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
                  tooltip={session?.user?.name || ""}
                >
                  <Avatar className="h-8 w-8 rounded-lg grayscale">
                    <AvatarImage
                      src={session?.user?.image || ""}
                      alt={session?.user?.name || ""}
                    />
                    <AvatarFallback className="rounded-lg">
                      {session?.user?.name
                        ?.split(" ")
                        .map((m) => m.charAt(0))
                        .join("") || ""}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {session?.user?.name || ""}
                    </span>
                    <span className="text-muted-foreground truncate text-xs">
                      {session?.user?.email || ""}
                    </span>
                  </div>
                  <EllipsisVertical className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={session?.user?.image || ""}
                        alt={session?.user?.name || ""}
                      />
                      <AvatarFallback className="rounded-lg">
                        {session?.user?.name
                          ?.split(" ")
                          .map((m) => m.charAt(0))
                          .join("") || ""}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {session?.user?.name || ""}
                      </span>
                      <span className="text-muted-foreground truncate text-xs">
                        {session?.user?.email || ""}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/*<DropdownMenuGroup>
                     <DropdownMenuItem>
                <IconUserCircle />
                Account
              </DropdownMenuItem> 
                  </DropdownMenuGroup>*/}
                {/* <DropdownMenuSeparator /> */}
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="cursor-pointer"
                >
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
