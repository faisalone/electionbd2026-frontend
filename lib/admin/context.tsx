'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAdminProfile } from './api';

interface Admin {
  id: number;
  name: string;
  phone_number: string;
  role: string;
  is_active: boolean;
}

interface AdminContextType {
  admin: Admin | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for token in localStorage
    const storedToken = localStorage.getItem('admin_token');
    if (storedToken) {
      setToken(storedToken);
      fetchAdminProfile(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchAdminProfile = async (authToken: string) => {
    try {
      const response = await getAdminProfile(authToken);
      if (response.success) {
        setAdmin(response.admin);
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('admin_token');
        setToken(null);
      }
    } catch (error) {
      console.error('Failed to fetch admin profile:', error);
      localStorage.removeItem('admin_token');
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (authToken: string) => {
    localStorage.setItem('admin_token', authToken);
    setToken(authToken);
    fetchAdminProfile(authToken);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AdminContext.Provider value={{ admin, token, login, logout, isLoading }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
