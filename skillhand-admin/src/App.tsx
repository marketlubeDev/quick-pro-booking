import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { ServiceRequests } from "@/components/service-requests/ServiceRequests";
import { EmployeeApplications } from "@/components/employee-applications/EmployeeApplications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AdminLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/service-requests" element={<ServiceRequests />} />
            <Route path="/employee-applications" element={<EmployeeApplications />} />
            <Route path="/reports" element={<div className="p-6"><h1 className="text-3xl font-bold">Reports</h1><p className="text-muted-foreground">Reports dashboard coming soon.</p></div>} />
            <Route path="/settings" element={<div className="p-6"><h1 className="text-3xl font-bold">Settings</h1><p className="text-muted-foreground">Settings panel coming soon.</p></div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AdminLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

