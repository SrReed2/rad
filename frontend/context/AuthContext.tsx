"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  username: string;
  role: "admin" | "docente";
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Credenciales demo — reemplazar con llamada real al backend
const DEMO_USERS: Record<string, { password: string; role: "admin" | "docente" }> = {
  admin: { password: "admin123", role: "admin" },
  docente: { password: "rad2024", role: "docente" },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaurar sesión al recargar
  useEffect(() => {
    try {
      const stored = localStorage.getItem("rad_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem("rad_user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simula llamada async al backend (sustituir por fetch real en Agosto)
    await new Promise((r) => setTimeout(r, 400));

    const found = DEMO_USERS[username.toLowerCase()];
    if (found && found.password === password) {
      const userData: User = { username, role: found.role };
      setUser(userData);
      localStorage.setItem("rad_user", JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("rad_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
