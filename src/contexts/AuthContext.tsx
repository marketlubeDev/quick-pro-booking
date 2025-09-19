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
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem("auth_token");
        const savedUserRaw = localStorage.getItem("auth_user");
        
        if (savedToken && savedUserRaw) {
          const savedUser = JSON.parse(savedUserRaw) as AuthUser;
          
          // Validate token by making a test request to the server
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
            
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/me`, {
              headers: {
                'Authorization': `Bearer ${savedToken}`,
                'Content-Type': 'application/json'
              },
              signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
              setToken(savedToken);
              setUser(savedUser);
            } else {
              // Token is invalid, clear storage
              localStorage.removeItem("auth_token");
              localStorage.removeItem("auth_user");
              setToken(null);
              setUser(null);
            }
          } catch (error) {
            // Network error or server down, keep token but mark as potentially invalid
            // This allows offline usage while still protecting against invalid tokens
            console.warn("Auth validation failed:", error);
            setToken(savedToken);
            setUser(savedUser);
          }
        } else {
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        // Clear corrupted data
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        setToken(null);
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };

    initializeAuth();
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
