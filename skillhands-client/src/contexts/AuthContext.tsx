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
    password: string,
    extra?: {
      designation?: string;
      address?: string;
      city?: string;
      state?: string;
      postalCode?: string;
    }
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
  // Per-tab id to coordinate single active session across tabs
  const [tabId] = useState<string>(
    () => `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem("auth_token");
        const savedUserRaw = localStorage.getItem("auth_user");
        const owner = localStorage.getItem("auth_owner");

        if (savedToken && savedUserRaw) {
          const savedUser = JSON.parse(savedUserRaw) as AuthUser;

          // Validate token by making a test request to the server
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

            const response = await fetch(
              `${
                import.meta.env.VITE_API_URL || "http://localhost:3001"
              }/api/auth/me`,
              {
                headers: {
                  Authorization: `Bearer ${savedToken}`,
                  "Content-Type": "application/json",
                },
                signal: controller.signal,
              }
            );

            clearTimeout(timeoutId);

            if (response.ok) {
              setToken(savedToken);
              setUser(savedUser);
              // If no owner is set (legacy), claim ownership for this tab
              if (!owner) {
                try {
                  localStorage.setItem("auth_owner", tabId);
                } catch {}
              }
            } else {
              // Token is invalid, clear storage
              localStorage.removeItem("auth_token");
              localStorage.removeItem("auth_user");
              localStorage.removeItem("auth_owner");
              setToken(null);
              setUser(null);
            }
          } catch (error) {
            // Network error or server down, keep token but mark as potentially invalid
            // This allows offline usage while still protecting against invalid tokens
            console.warn("Auth validation failed:", error);
            setToken(savedToken);
            setUser(savedUser);
            if (!owner) {
              try {
                localStorage.setItem("auth_owner", tabId);
              } catch {}
            }
          }
        } else {
          setToken(null);
          setUser(null);
          try {
            localStorage.removeItem("auth_owner");
          } catch {}
        }
      } catch (error) {
        // Clear corrupted data
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_owner");
        setToken(null);
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };

    initializeAuth();
  }, [tabId]);

  // Listen for cross-tab login/logout via localStorage changes
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (!e.key) return;
      if (e.key === "auth_owner") {
        const currentOwner = localStorage.getItem("auth_owner");
        // Another tab took ownership; clear local state but do not clear storage
        if (currentOwner && currentOwner !== tabId) {
          setToken(null);
          setUser(null);
        }
        // If owner removed and we still have token, keep state as-is
        return;
      }
      if (e.key === "auth_token" || e.key === "auth_user") {
        const currentOwner = localStorage.getItem("auth_owner");
        const hasToken = !!localStorage.getItem("auth_token");
        const hasUser = !!localStorage.getItem("auth_user");
        // If token/user removed globally, reflect logout locally
        if (!hasToken || !hasUser) {
          setToken(null);
          setUser(null);
          return;
        }
        // If token/user changed and owner is not this tab, reflect new session
        if (currentOwner && currentOwner !== tabId) {
          try {
            const savedUserRaw = localStorage.getItem("auth_user");
            const savedToken = localStorage.getItem("auth_token");
            if (savedUserRaw && savedToken) {
              const savedUser = JSON.parse(savedUserRaw) as AuthUser;
              setToken(savedToken);
              setUser(savedUser);
            }
          } catch {}
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [tabId]);

  const login = useCallback(
    async (email: string, password: string) => {
      const resp = await authApi.login(email, password);
      localStorage.setItem("auth_token", resp.token);
      localStorage.setItem("auth_user", JSON.stringify(resp.user));
      // Mark this tab as the active session owner
      try {
        localStorage.setItem("auth_owner", tabId);
      } catch {}
      setToken(resp.token);
      setUser(resp.user);
      return resp;
    },
    [tabId]
  );

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      extra?: {
        designation?: string;
        address?: string;
        city?: string;
        state?: string;
        postalCode?: string;
      }
    ) => {
      const resp = await authApi.register(name, email, password, extra);
      localStorage.setItem("auth_token", resp.token);
      localStorage.setItem("auth_user", JSON.stringify(resp.user));
      try {
        localStorage.setItem("auth_owner", tabId);
      } catch {}
      setToken(resp.token);
      setUser(resp.user);
      return resp;
    },
    [tabId]
  );

  const logout = useCallback(() => {
    try {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_owner");
    } catch {
      // ignore
    }
    // Force clear state immediately
    setToken(null);
    setUser(null);
    // Set initializing to true to trigger re-initialization
    setInitializing(true);
    // Then set it back to false to complete the logout
    setTimeout(() => setInitializing(false), 0);
  }, []);

  const value = useMemo(
    () => ({ user, token, initializing, login, register, logout, setUser }),
    [user, token, initializing, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
