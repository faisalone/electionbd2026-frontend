'use client';

import { useState, useEffect } from 'react';
import { useMarketAuth } from '@/lib/market-auth-context';
import { marketplaceApi, Creator } from '@/lib/marketplace-api';
import { Loader2, Search, ShieldCheck, Star, Package, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { toBengaliNumber } from '@/lib/mockProducts';
import { getMarketplaceImageUrl } from '@/lib/marketplace-image-utils';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

function CreatorsPageContent() {
  const { token, user } = useMarketAuth();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  useEffect(() => {
    if (token) {
      fetchCreators();
    }
  }, [token]);

  const fetchCreators = async () => {
    try {
      const response = await marketplaceApi.getCreators({ per_page: 50 });
      setCreators(response.data);
    } catch (error) {
      console.error(error);
      toast.error('ক্রিয়েটর তালিকা লোড করতে ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (creatorId: number) => {
    const confirmed = window.confirm('আপনি কি নিশ্চিত যে এই ক্রিয়েটরকে অনুমোদন করতে চান?');
    if (!confirmed) return;
    
    setActionLoading(creatorId);
    try {
      await marketplaceApi.approveCreator(creatorId);
      toast.success('ক্রিয়েটর সফলভাবে অনুমোদিত হয়েছে');
      fetchCreators();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'ক্রিয়েটর অনুমোদন করতে ব্যর্থ হয়েছে');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (creatorId: number) => {
    const confirmed = window.confirm('আপনি কি নিশ্চিত যে এই ক্রিয়েটরকে প্রত্যাখ্যান/স্থগিত করতে চান?');
    if (!confirmed) return;
    
    setActionLoading(creatorId);
    try {
      await marketplaceApi.rejectCreator(creatorId);
      toast.success('ক্রিয়েটর সফলভাবে স্থগিত করা হয়েছে');
      fetchCreators();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'ক্রিয়েটর স্থগিত করতে ব্যর্থ হয়েছে');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            সক্রিয়
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-medium">
            <Clock className="w-3 h-3" />
            অপেক্ষমান
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-medium">
            <XCircle className="w-3 h-3" />
            স্থগিত
          </span>
        );
      default:
        return null;
    }
  };

  const filteredCreators = creators.filter(creator => 
    creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    creator.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (creator.phone && creator.phone.includes(searchQuery))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#C8102E]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">ক্রিয়েটর ম্যানেজমেন্ট</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="ক্রিয়েটর খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E] w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">ক্রিয়েটর</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">যোগাযোগ</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">ডিজাইন</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">রেটিং</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">স্ট্যাটাস</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCreators.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    কোন ক্রিয়েটর পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filteredCreators.map((creator) => (
                  <tr key={creator.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                          {creator.avatar && getMarketplaceImageUrl(creator.avatar) ? (
                            <img src={getMarketplaceImageUrl(creator.avatar)!} alt={creator.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-lg font-bold text-gray-400">{creator.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{creator.name}</p>
                          <p className="text-xs text-gray-500">@{creator.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{creator.phone || 'N/A'}</p>
                      <p className="text-xs text-gray-400">{creator.location || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                        <Package className="w-3 h-3" />
                        {toBengaliNumber(creator.total_designs)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-medium">
                        <Star className="w-3 h-3 fill-current" />
                        {toBengaliNumber(creator.rating.toFixed(1))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(creator.status || 'pending')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isAdmin && creator.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(creator.id)}
                              disabled={actionLoading === creator.id}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {actionLoading === creator.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                'অনুমোদন'
                              )}
                            </button>
                            <button
                              onClick={() => handleReject(creator.id)}
                              disabled={actionLoading === creator.id}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {actionLoading === creator.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                'প্রত্যাখ্যান'
                              )}
                            </button>
                          </>
                        )}
                        {isAdmin && creator.status === 'suspended' && (
                          <button
                            onClick={() => handleApprove(creator.id)}
                            disabled={actionLoading === creator.id}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading === creator.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              'পুনরায় সক্রিয়'
                            )}
                          </button>
                        )}
                        <Link 
                          href={`/market/creators/${creator.username}`}
                          className="text-[#C8102E] hover:underline text-sm font-medium"
                        >
                          প্রোফাইল
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function CreatorsPage() {
  return (
    <ProtectedRoute requireAdmin>
      <CreatorsPageContent />
    </ProtectedRoute>
  );
}
