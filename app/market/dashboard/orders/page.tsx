'use client';

import { useState, useEffect } from 'react';
import { Clock, Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useMarketAuth } from '@/lib/market-auth-context';
import { marketplaceApi, CustomOrder } from '@/lib/marketplace-api';
import { toBengaliNumber } from '@/lib/mockProducts';
import ProtectedRoute from '@/components/ProtectedRoute';

function OrdersPageContent() {
  const { user, token, isLoading: authLoading } = useMarketAuth();
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  useEffect(() => {
    if (!authLoading && token) {
      fetchOrders();
    }
  }, [authLoading, token, filter, page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await marketplaceApi.getMyOrders({
        status: filter === 'all' ? undefined : filter,
        search: searchQuery || undefined,
        page,
        per_page: 10
      });
      setOrders(response.data);
      setTotalPages(response.meta.last_page);
    } catch (error) {
      toast.error('অর্ডার লোড করতে ব্যর্থ হয়েছে');
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
      <h1 className="text-2xl font-bold text-gray-900">কাস্টম অর্ডার</h1>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {['all', 'pending', 'in_progress', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  filter === status
                    ? 'bg-[#C8102E] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' && 'সকল'}
                {status === 'pending' && 'নতুন'}
                {status === 'in_progress' && 'চলমান'}
                {status === 'completed' && 'সম্পন্ন'}
                {status === 'cancelled' && 'বাতিল'}
              </button>
            ))}
          </div>
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="অর্ডার খুঁজুন..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E] text-sm"
              />
            </div>
            <button
              onClick={fetchOrders}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              খুঁজুন
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">কোন কাস্টম অর্ডার নেই</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{order.product.title}</p>
                    <p className="text-sm text-gray-500">অর্ডার #{toBengaliNumber(order.order_number || order.id)}</p>
                  </div>
                  {order.status === 'pending' && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                      নতুন
                    </span>
                  )}
                  {order.status === 'in_progress' && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      চলমান
                    </span>
                  )}
                  {order.status === 'completed' && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      সম্পন্ন
                    </span>
                  )}
                  {order.status === 'cancelled' && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                      বাতিল
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 mb-3">{order.details}</p>
                <div className="flex items-center justify-between text-sm">
                  {isAdmin && order.user_name && (
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-600 font-medium">ক্রেতা: {order.user_name}</span>
                      {order.phone_number && (
                        <span className="text-gray-500">ফোন: {order.phone_number}</span>
                      )}
                    </div>
                  )}
                  <span className="text-gray-500">{new Date(order.created_at).toLocaleDateString('bn-BD')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            পূর্ববর্তী
          </button>
          <span className="px-4 py-2 text-sm font-medium text-gray-600">
            পৃষ্ঠা {toBengaliNumber(page)} / {toBengaliNumber(totalPages)}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            পরবর্তী
          </button>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute requireCreator>
      <OrdersPageContent />
    </ProtectedRoute>
  );
}
