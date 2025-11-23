'use client';

import { useRouter } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';

interface AccessDeniedProps {
  message?: string;
  requiredRole?: string;
  redirectPath?: string;
}

export default function AccessDenied({ 
  message = 'আপনার এই পৃষ্ঠা অ্যাক্সেস করার অনুমতি নেই',
  requiredRole,
  redirectPath = '/market/dashboard'
}: AccessDeniedProps) {
  const router = useRouter();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <ShieldAlert className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          অ্যাক্সেস নেই
        </h1>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        {requiredRole && (
          <p className="text-sm text-gray-500 mb-6">
            প্রয়োজনীয় ভূমিকা: <span className="font-semibold">{requiredRole}</span>
          </p>
        )}
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            পিছনে যান
          </button>
          
          <button
            onClick={() => router.push(redirectPath)}
            className="px-4 py-2 text-sm font-medium text-white bg-[#C8102E] rounded-lg hover:bg-[#A00D25]"
          >
            ড্যাশবোর্ডে ফিরে যান
          </button>
        </div>
      </div>
    </div>
  );
}
