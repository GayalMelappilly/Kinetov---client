'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types';
import { adminLogin as apiLogin, getAdminProfile } from '../lib/api';

interface AdminAuthContextType {
  admin: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  login: (u: string, p: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setToken(savedToken);
      getAdminProfile()
        .then((profile) => {
          setAdmin(profile);
        })
        .catch(() => {
          // Invalid token or expired
          localStorage.removeItem('adminToken');
          setToken(null);
          setAdmin(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (u: string, p: string) => {
    const res = await apiLogin(u, p);
    localStorage.setItem('adminToken', res.token);
    setToken(res.token);
    setAdmin(res.admin);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, token, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};
