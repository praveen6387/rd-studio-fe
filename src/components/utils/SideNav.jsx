"use client";

import { usePathname } from "next/navigation";
import { useSidebar } from "@/contexts/SidebarContext";
import LoadingLink from "@/components/ui/loading-link";
import { Gauge, Settings, LogOut, Menu, X } from "lucide-react";

export default function Sidenav() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const isActive = (path) => {
    return pathname === path;
  };

  const navItems = [
    { href: "/dashboard", icon: <Gauge />, label: "Dashboard" },
    { href: "/dashboard/operations", icon: <Gauge />, label: "Operations" },
    { href: "/dashboard/operations2", icon: <Gauge />, label: "Operations2" },
    { href: "/dashboard/media", icon: <Gauge />, label: "Media" },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isCollapsed && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={toggleSidebar} />}

      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white h-screen flex flex-col fixed left-0 pt-16 top-0 z-30 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors z-40"
        >
          {isCollapsed ? <Menu size={16} /> : <X size={16} />}
        </button>

        {/* Logo/Brand */}
        <div className={`p-6 border-b border-gray-700 ${isCollapsed ? "px-2" : ""}`}>
          {!isCollapsed ? (
            <>
              <h2 className="text-2xl font-bold text-white">RD Photo</h2>
              <p className="text-gray-400 text-sm">Photography Studio</p>
            </>
          ) : (
            <div className="flex justify-center">
              <h2 className="text-xl font-bold text-white">RD</h2>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          <ul className={`p-4 space-y-2 ${isCollapsed ? "px-2" : ""}`}>
            {navItems.map((item) => (
              <li key={item.href}>
                <LoadingLink
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg transition-colors group ${
                    isActive(item.href) ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  title={isCollapsed ? item.label : ""}
                >
                  <span className={`${isCollapsed ? "mx-auto" : "mr-3"}`}>{item.icon}</span>
                  {!isCollapsed && item.label}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </LoadingLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className={`p-4 border-t border-gray-700 ${isCollapsed ? "px-2" : ""}`}>
          <button
            className={`flex items-center w-full p-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors group ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Settings" : ""}
          >
            <Settings className={`${isCollapsed ? "" : "mr-3"}`} size={16} />
            {!isCollapsed && "Settings"}

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                Settings
              </div>
            )}
          </button>
          <button
            className={`flex items-center w-full p-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors mt-2 group ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Logout" : ""}
          >
            <LogOut className={`${isCollapsed ? "" : "mr-3"}`} size={16} />
            {!isCollapsed && "Logout"}

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                Logout
              </div>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
