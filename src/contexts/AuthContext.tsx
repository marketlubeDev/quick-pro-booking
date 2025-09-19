import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthResponse, AuthUser, authApi } from "@/lib/api";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<AuthResponse>;
  logout: () => void;
  setUser: (u: AuthUser | null) => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("auth_token");
      const savedUserRaw = localStorage.getItem("auth_user");
      const savedUser = savedUserRaw
        ? (JSON.parse(savedUserRaw) as AuthUser)
        : null;
      setToken(savedToken);
      setUser(savedUser);
    } catch {
      // ignore
    } finally {
      setInitializing(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const resp = await authApi.login(email, password);
    localStorage.setItem("auth_token", resp.token);
    localStorage.setItem("auth_user", JSON.stringify(resp.user));
    setToken(resp.token);
    setUser(resp.user);
    return resp;
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const resp = await authApi.register(name, email, password);
      localStorage.setItem("auth_token", resp.token);
      localStorage.setItem("auth_user", JSON.stringify(resp.user));
      setToken(resp.token);
      setUser(resp.user);
      return resp;
    },
    []
  );

  const logout = useCallback(() => {
    try {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    } catch {
      // ignore
    }
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, initializing, login, register, logout, setUser }),
    [user, token, initializing, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
