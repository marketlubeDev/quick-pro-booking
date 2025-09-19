import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useLogin() {
  const { login } = useAuth();
  return login;
}

export function useLogout() {
  const { logout } = useAuth();
  return logout;
}
