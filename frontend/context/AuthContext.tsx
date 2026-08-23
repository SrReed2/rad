"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";

export type Role =
  | "director"
  | "profesor_matematicas"
  | "profesor_ingles"
  | "profesor_quimica";

interface User {
  username: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "sofia_user";

// Credenciales demo — reemplazar con llamada real al backend
const DEMO_USERS: Record<string, { password: string; role: Role }> = {
  director: { password: "director123", role: "director" },
  mathprof: { password: "mathprof123", role: "profesor_matematicas" },
  engprof: { password: "engprof123", role: "profesor_ingles" },
  quimprof: { password: "quimprof123", role: "profesor_quimica" },
};

// Materia asociada a cada rol docente — director es null porque ve todas.
export const ROLE_SUBJECTS: Record<Role, string | null> = {
  director: null,
  profesor_matematicas: "Matemáticas",
  profesor_ingles: "Inglés",
  profesor_quimica: "Química",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaurar sesión al recargar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    // Simula llamada async al backend (sustituir por fetch real más adelante)
    await new Promise((r) => setTimeout(r, 400));

    const found = DEMO_USERS[username.toLowerCase()];
    if (found && found.password === password) {
      const userData: User = { username, role: found.role };
      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // useMemo evita recrear el objeto de contexto en cada render (ver StudentsContext).
  const value = useMemo(
    () => ({ user, login, logout, isLoading }),
    [user, login, logout, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
