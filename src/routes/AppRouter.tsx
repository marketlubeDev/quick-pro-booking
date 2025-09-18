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
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";

import Employee from "@/pages/Employee";
import EmployeeProfile from "@/pages/employee/Profile";
import EmployeeJobs from "@/pages/employee/Jobs";

import Admin from "@/pages/admin/Admin";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminBookings from "@/pages/admin/Bookings";
import AdminServices from "@/pages/admin/Services";
import AdminUsers from "@/pages/admin/Users";
import AdminSettings from "@/pages/admin/Settings";

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
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  {
    path: "/employee",
    element: <Employee />,
    children: [
      { index: true, element: <Navigate to="profile" replace /> },
      { path: "profile", element: <EmployeeProfile /> },
      { path: "jobs", element: <EmployeeJobs /> },
    ],
  },
  {
    path: "/admin",
    element: <Admin />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "bookings", element: <AdminBookings /> },
      { path: "services", element: <AdminServices /> },
      { path: "users", element: <AdminUsers /> },
      { path: "settings", element: <AdminSettings /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
