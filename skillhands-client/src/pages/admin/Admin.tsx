import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useLocation, Outlet } from "react-router-dom";

// Page titles mapping
const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/admin": {
    title: "Dashboard",
    subtitle:
      "Welcome back! Here's what's happening with your service platform.",
  },
  "/admin/service-requests": {
    title: "Service Requests",
    subtitle: "Manage and track all service requests from customers.",
  },
  "/admin/employee-applications": {
    title: "Pro Applications",
    subtitle: "Review and manage pro applications and profiles.",
  },
  "/admin/service-categories": {
    title: "Service Categories",
    subtitle: "Create, update, and delete service categories.",
  },
  "/admin/reports": {
    title: "Reports",
    subtitle: "View analytics and reports for your business.",
  },
  "/admin/settings": {
    title: "Settings",
    subtitle: "Configure your application settings and preferences.",
  },
};

export function AdminLayout() {
  const location = useLocation();
  const currentPage = pageTitles[location.pathname] || {
    title: "",
    subtitle: "",
  };

  // Sidebar state management
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Check if we're on mobile on initial render
    if (typeof window !== "undefined") {
      return window.innerWidth < 1024; // lg breakpoint
    }
    return true; // Default to collapsed on SSR
  });

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  // Handle window resize - only collapse when switching from desktop to mobile
  useEffect(() => {
    let wasDesktop = window.innerWidth >= 1024;

    const handleResize = () => {
      const isNowMobile = window.innerWidth < 1024;
      // Only collapse if we transitioned from desktop to mobile
      if (wasDesktop && isNowMobile) {
        setIsCollapsed(true);
      }
      wasDesktop = !isNowMobile;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background flex w-full">
      <Sidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      <div className="flex-1 flex flex-col lg:ml-0 w-full min-w-0">
        <Header
          title={currentPage.title}
          subtitle={currentPage.subtitle}
          onToggleSidebar={toggleSidebar}
        />
        <main className="flex-1 overflow-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Default export for AppRouter compatibility
export default AdminLayout;
