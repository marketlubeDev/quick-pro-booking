import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
  Tags,
  LogOut,
} from "lucide-react";
import { NavigationItem } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

const navigationItems: NavigationItem[] = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  {
    name: "Service Requests",
    path: "/admin/service-requests",
    icon: ClipboardList,
  },
  {
    name: "Service Categories",
    path: "/admin/service-categories",
    icon: Tags,
  },
  {
    name: "Pro Applications",
    path: "/admin/employee-applications",
    icon: Users,
  },
  { name: "Reports", path: "/admin/reports", icon: BarChart3 },
  // { name: "Settings", path: "/admin/settings", icon: Settings },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Handle logout with proper cleanup
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-card border-r border-border transition-all duration-300 lg:sticky lg:z-auto shadow-lg lg:shadow-none flex flex-col",
          // Mobile: hide when collapsed, show when open
          isCollapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0",
          // Desktop: always visible, but width changes
          isCollapsed ? "lg:w-16" : "w-64"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
          <div
            className={cn(
              "flex items-center space-x-2 sm:space-x-3",
              isCollapsed && "lg:justify-center"
            )}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-bold text-sm">
                SH
              </span>
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <h2 className="text-foreground font-bold text-base sm:text-lg truncate">
                  SkillHand
                </h2>
                <p className="text-muted-foreground text-xs truncate">
                  Admin Panel
                </p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="lg:hidden text-foreground h-8 w-8 p-0 shrink-0 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm transition-colors pl-3 sm:pl-4",
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground hover:bg-muted",
                    isCollapsed && "lg:justify-center lg:space-x-0 lg:pl-3"
                  )
                }
                onClick={() => {
                  // Close sidebar on mobile when item is clicked
                  if (window.innerWidth < 1024) {
                    onToggle();
                  }
                }}
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        "absolute left-1 top-1/2 -translate-y-1/2 h-4 sm:h-5 w-0.5 sm:w-1 rounded bg-primary opacity-0 transition-opacity group-hover:opacity-60",
                        isActive && "opacity-100"
                      )}
                    />
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="truncate">{item.name}</span>
                    )}
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
          onClick={onToggle}
          className="hidden lg:flex absolute -right-3 top-6 w-6 h-6 rounded-full bg-card border border-border text-foreground hover:bg-muted"
        >
          <Menu className="h-3 w-3" />
        </Button>

        {/* User Profile Section - at bottom of sidebar */}
        {!isCollapsed && (
          <div className="p-4 border-t border-border space-y-3">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage
                  src={user?.avatar || "/placeholder-avatar.jpg"}
                  alt={user?.name || "Admin"}
                />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "AD"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || "admin@skillhand.com"}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </Button>
          </div>
        )}

        {/* Collapsed Profile Icon (Desktop) */}
        {isCollapsed && (
          <div className="p-4 border-t border-border lg:flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user?.avatar || "/placeholder-avatar.jpg"}
                      alt={user?.name || "Admin"}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase() || "AD"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name || "Admin User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || "admin@skillhand.com"}
                    </p>
                    <Badge variant="secondary" className="text-xs w-fit mt-1">
                      {user?.role || "Administrator"}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </aside>
    </>
  );
}
