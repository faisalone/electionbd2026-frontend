'use client';

import { useState, useEffect } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useMarketAuth } from '@/lib/market-auth-context';
import { marketplaceApi } from '@/lib/marketplace-api';
import { toBengaliNumber } from '@/lib/mockProducts';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

function DownloadsPageContent() {
  const { user, token, isLoading: authLoading } = useMarketAuth();
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  useEffect(() => {
    if (!authLoading && token) {
      fetchDownloads();
    }
  }, [authLoading, token, page]);

  const fetchDownloads = async () => {
    setLoading(true);
    try {
      const response = await marketplaceApi.getDownloads({
        page,
        per_page: 20
      });
      setDownloads(response.data);
      setTotalPages(response.meta.last_page);
    } catch (error) {
      toast.error('ডাউনলোড তালিকা লোড করতে ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#C8102E]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">ডাউনলোড রেকর্ড</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium text-gray-500">ডাউনলোড ID</th>
                <th className="px-6 py-4 font-medium text-gray-500">প্রোডাক্ট</th>
                {isAdmin && (
                  <>
                    <th className="px-6 py-4 font-medium text-gray-500">ব্যবহারকারী</th>
                    <th className="px-6 py-4 font-medium text-gray-500">ফোন নম্বর</th>
                  </>
                )}
                <th className="px-6 py-4 font-medium text-gray-500">তারিখ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {downloads.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 5 : 3} className="px-6 py-12 text-center text-gray-500">
                    কোনো ডাউনলোড রেকর্ড পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                downloads.map((download) => (
                  <tr key={download.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-gray-600">#{toBengaliNumber(download.id)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Link 
                        href={`/market/${download.product?.uid}`}
                        className="font-medium text-gray-900 hover:text-[#C8102E]"
                      >
                        {download.product?.title || 'Unknown Product'}
                      </Link>
                    </td>
                    {isAdmin && (
                      <>
                        <td className="px-6 py-4 text-gray-600">
                          {download.user_name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {download.phone_number || 'N/A'}
                        </td>
                      </>
                    )}
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(download.created_at).toLocaleDateString('bn-BD')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50"
            >
              পূর্ববর্তী
            </button>
            <span className="px-3 py-1 text-gray-600">
              {toBengaliNumber(page)} / {toBengaliNumber(totalPages)}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50"
            >
              পরবর্তী
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DownloadsPage() {
  return (
    <ProtectedRoute requireCreator>
      <DownloadsPageContent />
    </ProtectedRoute>
  );
}
