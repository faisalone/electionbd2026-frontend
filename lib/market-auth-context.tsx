'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  }, [refreshUser]);

  const login = (authToken: string, userData: MarketUser) => {
    localStorage.setItem('market_token', authToken);
    localStorage.setItem('market_user', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
    refreshUser().catch(() => null);
  };

  const logout = () => {
    localStorage.removeItem('market_token');
    localStorage.removeItem('market_user');
    setToken(null);
    setUser(null);
  };

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
