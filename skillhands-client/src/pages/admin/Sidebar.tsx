import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { NavigationItem } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigationItems: NavigationItem[] = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  {
    name: "Service Requests",
    path: "/admin/service-requests",
    icon: ClipboardList,
  },
  {
    name: "Pro Applications",
    path: "/admin/employee-applications",
    icon: Users,
  },
  { name: "Reports", path: "/admin/reports", icon: BarChart3 },
  // { name: "Settings", path: "/admin/settings", icon: Settings },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 lg:sticky lg:z-auto",
          isCollapsed ? "-translate-x-full lg:translate-x-0 lg:w-16" : "w-64"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
          <div
            className={cn(
              "flex items-center space-x-3",
              isCollapsed && "lg:justify-center"
            )}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                SH
              </span>
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-sidebar-foreground font-bold text-lg">
                  SkillHand
                </h2>
                <p className="text-sidebar-foreground/60 text-xs">
                  Admin Panel
                </p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="lg:hidden text-sidebar-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-colors pl-4",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary font-semibold"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                    isCollapsed && "lg:justify-center lg:space-x-0 lg:pl-3"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        "absolute left-1 top-1/2 -translate-y-1/2 h-5 w-1 rounded bg-primary opacity-0 transition-opacity group-hover:opacity-60",
                        isActive && "opacity-100"
                      )}
                    />
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Collapse Toggle (Desktop) */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="hidden lg:flex absolute -right-3 top-6 w-6 h-6 rounded-full bg-sidebar border border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <Menu className="h-3 w-3" />
        </Button>
      </aside>

      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-60 lg:hidden bg-card shadow-md text-foreground"
      >
        <Menu className="h-5 w-5" />
      </Button>
    </>
  );
}
