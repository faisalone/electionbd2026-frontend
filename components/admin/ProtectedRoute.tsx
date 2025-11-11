'use client';

import { useAdmin } from '@/lib/admin/context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin, token, isLoading } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/admin/login');
    }
  }, [isLoading, token, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#C8102E]" size={48} />
      </div>
    );
  }

  if (!admin || !token) {
    return null;
  }

  return <>{children}</>;
}
