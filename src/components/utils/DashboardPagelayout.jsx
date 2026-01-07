"use client";

import PageLayout from "@/components/utils/PageLayout";
import Sidenav from "@/components/utils/SideNav";
import { useSidebar } from "@/contexts/SidebarContext";

export default function DashboardPageLayout({ children, title, description, button = null }) {
  const { isCollapsed } = useSidebar();

  return (
    <PageLayout header={false} footer={false} sidebar={true}>
      <main
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isCollapsed ? "ml-16 max-w-[calc(100vw-88px)]" : "ml-64 max-w-[calc(100vw-280px)]"
        } w-full`}
      >
        <div className="p-6">
          <div className="flex justify-between items-end">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{title}</h1>
              <p className="text-gray-600">{description}</p>
            </div>
            {button}
          </div>
          {children}
        </div>
      </main>
    </PageLayout>
  );
}
