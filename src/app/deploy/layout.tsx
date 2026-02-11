import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/sidebar";
import { Header } from "@/components/app/header";

import { TooltipProvider } from "@/components/ui/tooltip";


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar variant="inset" />
      <SidebarInset>
          <Header />
          <div className="flex flex-1 flex-col ">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col overflow-y-auto">
                <TooltipProvider>{children}</TooltipProvider>
              </div>
            </div>
          </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
