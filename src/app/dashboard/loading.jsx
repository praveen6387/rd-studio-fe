"use client";
import { useSidebar } from "@/contexts/SidebarContext";

export default function DashboardLoading() {
  const { isCollapsed } = useSidebar();
  return (
    <div className={`min-h-screen flex items-center justify-center ${isCollapsed ? "ml-16" : "ml-64"}`}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
