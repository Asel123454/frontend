"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { fetchAPI } from "@/lib/api";
import Cookies from "js-cookie";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: "BUYER" | "SELLER" | "ADMIN";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (data: { name: string; email: string; password: string; role: string }) => Promise<{ error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "craft-organic-token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (savedToken) {
      setToken(savedToken);
      Cookies.set(TOKEN_KEY, savedToken, { expires: 7, path: "/" });
      
      // Verify token by fetching current user
      fetchAPI<{ user: User }>("/api/auth/me", { token: savedToken })
        .then((data) => {
          setUser(data.user);
        })
        .catch(() => {
          localStorage.removeItem(TOKEN_KEY);
          Cookies.remove(TOKEN_KEY, { path: "/" });
          setToken(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const data = await fetchAPI<{ token: string; user: User }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem(TOKEN_KEY, data.token);
      Cookies.set(TOKEN_KEY, data.token, { expires: 7, path: "/" });
      return {};
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Ошибка входа" };
    }
  }, []);

  const register = useCallback(async (data: { name: string; email: string; password: string; role: string }) => {
    try {
      const result = await fetchAPI<{ token: string; user: User }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setToken(result.token);
      setUser(result.user);
      localStorage.setItem(TOKEN_KEY, result.token);
      Cookies.set(TOKEN_KEY, result.token, { expires: 7, path: "/" });
      return {};
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Ошибка регистрации" };
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    Cookies.remove(TOKEN_KEY, { path: "/" });
    window.location.href = "/";
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
