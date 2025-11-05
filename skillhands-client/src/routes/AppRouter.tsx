import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";
import Index from "@/pages/Index";
import Services from "@/pages/Services";
import ServiceDetail from "@/pages/ServiceDetail";
import ServiceDetailView from "@/pages/ServiceDetailView";
import Projects from "@/pages/Projects";
import ProjectDetail from "@/pages/ProjectDetail";
import Request from "@/pages/Request";
import About from "@/pages/About";
import FAQ from "@/pages/FAQ";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/NotFound";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PaymentCancel from "@/pages/PaymentCancel";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import ForgotPassword from "@/pages/ForgotPassword";
import Employee from "@/pages/Employee";
import EmployeeSignupSuccess from "@/pages/EmployeeSignupSuccess";
import EmployeeProfile from "@/pages/employee/Profile";
import EmployeeJobs from "@/pages/employee/Jobs";
import Admin from "@/pages/admin/Admin";
import { Dashboard } from "@/pages/admin/Dashboard/Dashboard";
import { ServiceRequests } from "@/pages/admin/ServiceRequiest/ServiceRequests";
import { EmployeeApplications } from "@/pages/admin/EmployeeApplication/EmployeeApplications";
import { Reports } from "@/pages/admin/Reports";
import { Settings } from "@/pages/admin/Settings";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import ServiceCategories from "@/pages/admin/ServiceCategories/ServiceCategories";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Index /> },
      { path: "/services", element: <Services /> },
      { path: "/services/:slug", element: <ServiceDetail /> },
      { path: "/services/detail/:id", element: <ServiceDetailView /> },
      { path: "/projects", element: <Projects /> },
      { path: "/projects/:id", element: <ProjectDetail /> },
      { path: "/request", element: <Request /> },
      { path: "/about", element: <About /> },
      { path: "/faq", element: <FAQ /> },
      { path: "/contact", element: <Contact /> },
      { path: "/privacy", element: <Privacy /> },
      { path: "/terms", element: <Terms /> },
      { path: "/payment-success", element: <PaymentSuccess /> },
      { path: "/payment-cancel", element: <PaymentCancel /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/forgot", element: <ForgotPassword /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/signup/success", element: <EmployeeSignupSuccess /> },
  {
    path: "/employee",
    element: (
      <ProtectedRoute>
        <Employee />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="profile" replace /> },
      { path: "profile", element: <EmployeeProfile /> },
      { path: "jobs", element: <EmployeeJobs /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <Admin />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "service-requests", element: <ServiceRequests /> },
      { path: "employee-applications", element: <EmployeeApplications /> },
      { path: "service-categories", element: <ServiceCategories /> },
      { path: "reports", element: <Reports /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
