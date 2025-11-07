import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Briefcase,
  TrendingUp,
  ShieldCheck,
  LogOut,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEmployeeDashboard } from "@/hooks/useEmployeeDashboard";

const Employee = () => {
  const { logout } = useAuth();
  const { stats, loading, error, refetch } = useEmployeeDashboard();

  // Listen for profile updates and refresh dashboard stats
  React.useEffect(() => {
    const handleProfileUpdate = () => {
      refetch();
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, [refetch]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="shadow-sm mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">Pro Dashboard</CardTitle>
                <CardDescription>Manage your profile and jobs</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="rounded-lg border p-4 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Profile Completion
                  </p>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        Loading...
                      </span>
                    </div>
                  ) : error ? (
                    <p className="text-sm text-red-500">Error loading data</p>
                  ) : (
                    <>
                      <p className="text-xl font-semibold">
                        {stats?.profileCompletion || 0}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stats?.profileCompletion &&
                        stats.profileCompletion < 100
                          ? "Complete your profile"
                          : "Profile complete"}
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="rounded-lg border p-4 flex items-start gap-3 bg-primary/5">
                <Briefcase className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="text-xs text-muted-foreground">Active Jobs</p>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        Loading...
                      </span>
                    </div>
                  ) : error ? (
                    <p className="text-sm text-red-500">Error loading data</p>
                  ) : (
                    <>
                      <p className="text-xl font-semibold">
                        {stats?.activeJobs || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Current projects
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="rounded-lg border p-4 flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="text-xs text-muted-foreground">Success Rate</p>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        Loading...
                      </span>
                    </div>
                  ) : error ? (
                    <p className="text-sm text-red-500">Error loading data</p>
                  ) : (
                    <>
                      <p className="text-xl font-semibold">
                        {stats?.successRate || 0}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Client satisfaction
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <nav className="mb-4 border-b">
              <div className="flex gap-6 text-sm">
                <NavLink
                  to="/employee/profile"
                  className={({ isActive }) =>
                    `-mb-px inline-flex items-center px-1 pb-3 font-medium transition-colors ${
                      isActive
                        ? "text-foreground border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-muted"
                    }`
                  }
                >
                  Profile
                </NavLink>
                <NavLink
                  to="/employee/jobs"
                  className={({ isActive }) =>
                    `-mb-px inline-flex items-center px-1 pb-3 font-medium transition-colors ${
                      isActive
                        ? "text-foreground border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-muted"
                    }`
                  }
                >
                  Jobs
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

export default Employee;
