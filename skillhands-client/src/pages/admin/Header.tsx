import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onToggleSidebar?: () => void;
}

export function Header({ title, subtitle, onToggleSidebar }: HeaderProps) {
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
      <div className="flex h-14 sm:h-16 items-center gap-2 sm:gap-4 px-4 sm:px-6">
        {/* Page Title */}
        <div className="flex-1 min-w-0">
          {title && (
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-foreground truncate">{title}</h1>
              {subtitle && (
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">{subtitle}</p>
              )}
            </div>
          )}
        </div>

        {/* Mobile Toggle Button - positioned where profile icon was */}
        {onToggleSidebar && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden bg-background border border-border/60 shadow-sm hover:shadow-md text-foreground hover:bg-accent/50 hover:border-primary/50 transition-all h-9 w-9 p-0 shrink-0"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>
    </header>
  );
}
