'use client';

import { useEffect, useState } from 'react';
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
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      // Check authentication
      if (!isAuthenticated || !user) {
        router.push('/market/login');
        return;
      }

      // Check role-based access
      if (requireAdmin) {
        const isAdmin = user.role === 'admin' || user.role === 'super_admin';
        if (!isAdmin) {
          setIsChecking(false);
          return;
        }
      }

      if (requireCreator) {
        const isCreator = user.role === 'creator' || user.role === 'admin' || user.role === 'super_admin';
        if (!isCreator) {
          setIsChecking(false);
          return;
        }
      }

      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(user.role)) {
          setIsChecking(false);
          return;
        }
      }

      setIsChecking(false);
    }
  }, [isAuthenticated, user, isLoading, requireCreator, requireAdmin, allowedRoles, router]);

  // Loading state
  if (isLoading || isChecking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#C8102E] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return null; // Router will redirect
  }

  // Check admin access
  if (requireAdmin) {
    const isAdmin = user.role === 'admin' || user.role === 'super_admin';
    if (!isAdmin) {
      return (
        <AccessDenied
          message="এই পৃষ্ঠাটি শুধুমাত্র অ্যাডমিনদের জন্য"
          requiredRole="অ্যাডমিন"
          redirectPath={fallbackPath}
        />
      );
    }
  }

  // Check creator access
  if (requireCreator) {
    const isCreatorOrAdmin = user.role === 'creator' || user.role === 'admin' || user.role === 'super_admin';
    if (!isCreatorOrAdmin) {
      return (
        <AccessDenied
          message="এই পৃষ্ঠাটি শুধুমাত্র ক্রিয়েটরদের জন্য। অনুগ্রহ করে আপনার প্রোফাইল সম্পূর্ণ করুন।"
          requiredRole="ক্রিয়েটর"
          redirectPath="/market/dashboard/settings"
        />
      );
    }
  }

  // Check specific role access
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      return (
        <AccessDenied
          message="আপনার এই পৃষ্ঠা অ্যাক্সেস করার অনুমতি নেই"
          requiredRole={allowedRoles.join(', ')}
          redirectPath={fallbackPath}
        />
      );
    }
  }

  return <>{children}</>;
}
