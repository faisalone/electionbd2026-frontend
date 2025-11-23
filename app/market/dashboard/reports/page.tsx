'use client';

import { BarChart3 } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

function ReportsPageContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">রিপোর্ট এবং অ্যানালিটিক্স</h1>
      
      <div className="bg-white rounded-xl border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <BarChart3 className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">রিপোর্ট ফিচার শীঘ্রই আসছে</h3>
        <p className="text-gray-500 max-w-md">
          এখানে আপনি বিস্তারিত বিক্রয় রিপোর্ট, ইউজার এনগেজমেন্ট এবং অন্যান্য গুরুত্বপূর্ণ মেট্রিক্স দেখতে পারবেন।
        </p>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <ProtectedRoute requireAdmin>
      <ReportsPageContent />
    </ProtectedRoute>
  );
}
