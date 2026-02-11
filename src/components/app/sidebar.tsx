import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CirclePlus } from "lucide-react";



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="">
            <Link href={"/"}>
              <SidebarMenuButton
                tooltip="Quick Create"
                className="border bg-black/25 min-w-8 duration-200 ease-linear cursor-pointer z-50 flex justify-between hover:bg-black/40 active:bg-black/40 group"
              >
                <span className="font-lg tracking-wider font-mono px-2">
                  Agent Daddie
                </span>
                <CirclePlus className="font-semibold text-foreground" />
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Change to Sidebar document */}
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-row gap-3 items-center">
          <div className="flex-1">
            {/* Navbar */}
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
