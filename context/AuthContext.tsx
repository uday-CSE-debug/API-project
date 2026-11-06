'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  status: string;
  avatar?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
  register: (name: string, email: string, password: string, role?: string) => Promise<{ success: boolean; message: string; user?: User }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setUser(null);
        setToken(null);
        setLoading(false);
        return;
      }

      setToken(storedToken);
      const res = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      const data = await res.json();
      if (data.success && data.data?.user) {
        setUser(data.data.user);
      } else {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
      }
    } catch (err) {
      console.error('Error verifying auth status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success && data.data?.token) {
        localStorage.setItem('token', data.data.token);
        setToken(data.data.token);
        setUser(data.data.user);
        return { success: true, message: data.message, user: data.data.user };
      }

      return { success: false, message: data.message || 'Login failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error' };
    }
  };

  const register = async (name: string, email: string, password: string, role: string = 'STUDENT') => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (data.success && data.data?.token) {
        localStorage.setItem('token', data.data.token);
        setToken(data.data.token);
        setUser(data.data.user);
        return { success: true, message: data.message, user: data.data.user };
      }

      return { success: false, message: data.message || 'Registration failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
