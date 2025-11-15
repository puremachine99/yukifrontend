import { ReactNode } from "react";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardNavbar } from "@/components/dashboard/navbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      {/* LEFT SIDEBAR */}
      <DashboardSidebar />

      {/* MAIN AREA */}
      <SidebarInset>
        {/* TOP NAVBAR */}
        <DashboardNavbar />

        {/* CONTENT */}
        <main className="p-4">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
