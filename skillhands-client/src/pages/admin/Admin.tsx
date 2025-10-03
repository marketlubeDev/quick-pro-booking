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

  return (
    <div className="min-h-screen bg-background flex w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-0">
        <Header title={currentPage.title} subtitle={currentPage.subtitle} />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Default export for AppRouter compatibility
export default AdminLayout;
