'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { marketplaceApi } from './marketplace-api';

interface MarketUser {
  id: number;
  name: string;
  phone_number: string;
  username?: string;
  avatar?: string;
  role: 'creator' | 'user' | 'admin' | 'super_admin';
  creator_profile?: {
    id: number;
    username: string;
    avatar?: string;
  };
}

interface MarketAuthContextType {
  user: MarketUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: MarketUser) => void;
  logout: () => void;
  refreshUser: () => Promise<MarketUser | null>;
  isLoading: boolean;
}

const MarketAuthContext = createContext<MarketAuthContextType | undefined>(undefined);

export function MarketAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<MarketUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async (): Promise<MarketUser | null> => {
    try {
      const response = await marketplaceApi.getMe();
      if (response.success && response.user) {
        setUser(response.user);
        localStorage.setItem('market_user', JSON.stringify(response.user));
        return response.user;
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
    return null;
  }, [setUser]);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('market_token');
      const storedUser = localStorage.getItem('market_user');

      if (storedToken) {
        setToken(storedToken);
      }

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Failed to parse stored user:', error);
        }
      }

      if (storedToken) {
        await refreshUser();
      }

      setIsLoading(false);
    };

    initializeAuth();

    // Listen for storage changes (logout in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'market_token' && e.newValue === null) {
        // Token removed, clear state and redirect
        setToken(null);
        setUser(null);
        if (pathname?.startsWith('/market/dashboard')) {
          router.push('/market/login');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshUser, router, pathname]);

  // Redirect from dashboard if not authenticated
  useEffect(() => {
    if (!isLoading && !token && pathname?.startsWith('/market/dashboard')) {
      router.push('/market/login');
    }
  }, [isLoading, token, pathname, router]);

  const login = (authToken: string, userData: MarketUser) => {
    localStorage.setItem('market_token', authToken);
    localStorage.setItem('market_user', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
    refreshUser().catch(() => null);
  };

  const logout = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem('market_token');
    localStorage.removeItem('market_user');
    
    // Clear state
    setToken(null);
    setUser(null);
    
    // Dispatch custom storage event for cross-tab synchronization
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'market_token',
      newValue: null,
      oldValue: localStorage.getItem('market_token'),
      storageArea: localStorage,
      url: window.location.href
    }));
    
    // Navigate away from protected routes
    if (pathname?.startsWith('/market/dashboard')) {
      router.push('/market/login');
    }
  }, [router, pathname]);

  return (
    <MarketAuthContext.Provider 
      value={{ 
        user, 
        token, 
        isAuthenticated: !!token,
        login, 
        logout, 
        refreshUser,
        isLoading 
      }}
    >
      {children}
    </MarketAuthContext.Provider>
  );
}

export function useMarketAuth() {
  const context = useContext(MarketAuthContext);
  if (context === undefined) {
    throw new Error('useMarketAuth must be used within a MarketAuthProvider');
  }
  return context;
}
