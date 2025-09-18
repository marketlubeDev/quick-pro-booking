import { NavLink, Outlet } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const Admin = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Admin Panel</CardTitle>
            <CardDescription>Manage platform data and settings</CardDescription>
          </CardHeader>
          <CardContent>
            <nav className="mb-4 border-b">
              <div className="flex gap-6 text-sm">
                <NavLink
                  to="/admin"
                  end
                  className={({ isActive }) =>
                    `-mb-px inline-flex items-center px-1 pb-3 font-medium transition-colors ${
                      isActive
                        ? "text-foreground border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-muted"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/admin/bookings"
                  className={({ isActive }) =>
                    `-mb-px inline-flex items-center px-1 pb-3 font-medium transition-colors ${
                      isActive
                        ? "text-foreground border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-muted"
                    }`
                  }
                >
                  Bookings
                </NavLink>
                <NavLink
                  to="/admin/services"
                  className={({ isActive }) =>
                    `-mb-px inline-flex items-center px-1 pb-3 font-medium transition-colors ${
                      isActive
                        ? "text-foreground border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-muted"
                    }`
                  }
                >
                  Services
                </NavLink>
                <NavLink
                  to="/admin/users"
                  className={({ isActive }) =>
                    `-mb-px inline-flex items-center px-1 pb-3 font-medium transition-colors ${
                      isActive
                        ? "text-foreground border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-muted"
                    }`
                  }
                >
                  Users
                </NavLink>
                <NavLink
                  to="/admin/settings"
                  className={({ isActive }) =>
                    `-mb-px inline-flex items-center px-1 pb-3 font-medium transition-colors ${
                      isActive
                        ? "text-foreground border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-muted"
                    }`
                  }
                >
                  Settings
                </NavLink>
              </div>
            </nav>
            <Outlet />
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
