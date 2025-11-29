'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useMarketAuth } from '@/lib/market-auth-context';
import AccessDenied from '@/components/AccessDenied';
import { Loader2 } from 'lucide-react';

type UserRole = 'user' | 'creator' | 'admin' | 'super_admin';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireCreator?: boolean;
  requireAdmin?: boolean;
  fallbackPath?: string;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  requireCreator = false,
  requireAdmin = false,
  fallbackPath = '/market/dashboard',
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useMarketAuth();
  const router = useRouter();

  // Calculate access status using useMemo to avoid setState in effect
  const accessStatus = useMemo(() => {
    if (isLoading) return { allowed: false, checking: true };
    if (!isAuthenticated || !user) return { allowed: false, checking: false };

    // Check role-based access
    if (requireAdmin) {
      const isAdmin = user.role === 'admin' || user.role === 'super_admin';
      if (!isAdmin) return { allowed: false, checking: false };
    }

    if (requireCreator) {
      const isCreator = user.role === 'creator' || user.role === 'admin' || user.role === 'super_admin';
      if (!isCreator) return { allowed: false, checking: false };
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return { allowed: false, checking: false };
    }

    return { allowed: true, checking: false };
  }, [isLoading, isAuthenticated, user, requireAdmin, requireCreator, allowedRoles]);

  useEffect(() => {
    if (!accessStatus.checking && !accessStatus.allowed && !isLoading) {
      if (!isAuthenticated || !user) {
        router.push('/market/login');
      } else {
        router.push(fallbackPath);
      }
    }
  }, [accessStatus, isLoading, isAuthenticated, user, router, fallbackPath]);

  // Loading state
  if (isLoading || accessStatus.checking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#C8102E] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  // Not authenticated or access denied
  if (!accessStatus.allowed) {
    if (!isAuthenticated || !user) {
      return null; // Router will redirect
    }
    return <AccessDenied />;
  }

  return <>{children}</>;
}
