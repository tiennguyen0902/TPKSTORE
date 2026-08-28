import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import { api } from "../services/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<User>;
  register: (data: { email: string; password: string; fullName: string; phone?: string }) => Promise<User>;
  logout: () => void;
  updateUser: (updated: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("store_ai_access_token");
      if (token) {
        try {
          const res = await api.getMe();
          setUser(res.user);
        } catch (err) {
          localStorage.removeItem("store_ai_access_token");
          localStorage.removeItem("store_ai_refresh_token");
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, pass: string): Promise<User> => {
    const data = await api.login(email, pass);
    localStorage.setItem("store_ai_access_token", data.tokens.accessToken);
    localStorage.setItem("store_ai_refresh_token", data.tokens.refreshToken);
    setUser(data.user);
    return data.user;
  };

  const register = async (data: { email: string; password: string; fullName: string; phone?: string }): Promise<User> => {
    const res = await api.register(data);
    localStorage.setItem("store_ai_access_token", res.tokens.accessToken);
    localStorage.setItem("store_ai_refresh_token", res.tokens.refreshToken);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem("store_ai_access_token");
    localStorage.removeItem("store_ai_refresh_token");
    setUser(null);
  };

  const updateUser = (updated: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updated });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
