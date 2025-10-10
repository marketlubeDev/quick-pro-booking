import { Bell, Search, User, Settings, LogOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, logout } = useAuth();

  // Handle logout with proper cleanup
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Define action buttons for specific pages
  // const getActionButton = () => {
  //   switch (location.pathname) {
  //     case "/admin/service-requests":
  //       return (
  //         <Button>
  //           <Plus className="h-4 w-4 mr-2" />
  //           Add Request
  //         </Button>
  //       );
  //     case "/admin/employee-applications":
  //       return (
  //         <Button>
  //           <Plus className="h-4 w-4 mr-2" />
  //           Invite Employee
  //         </Button>
  //       );
  //     default:
  //       return null;
  //   }
  // };
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-6">
        {/* Page Title */}
        <div className="flex-1">
          {title && (
            <div>
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          )}
        </div>

        {/* Global Search */}
        {/* <div className="relative w-[260px] hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            defaultValue={searchParams.get("q") || ""}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const value = (e.target as HTMLInputElement).value;
                const next = new URLSearchParams(searchParams);
                if (value && value.trim() !== "") {
                  next.set("q", value.trim());
                } else {
                  next.delete("q");
                }
                setSearchParams(next, { replace: false });
              }
            }}
            onBlur={(e) => {
              const value = e.target.value;
              const next = new URLSearchParams(searchParams);
              if (value && value.trim() !== "") {
                next.set("q", value.trim());
              } else {
                next.delete("q");
              }
              setSearchParams(next, { replace: false });
            }}
            className="pl-9"
          />
        </div> */}

        {/* Action Button */}
        {/* {getActionButton()} */}

        {/* Notifications */}
        {/* <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          <Badge
            variant="destructive"
            className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
          >
            3
          </Badge>
        </Button> */}

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
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
            {/* <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem> */}
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
    </header>
  );
}
