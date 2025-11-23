'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Package, DollarSign, Star, Plus, Download, 
  Clock, Users, Loader2, UserPlus, Settings, TrendingUp,
  Eye, ShoppingCart, AlertCircle, CheckCircle, XCircle,
  FileText, Activity, BarChart3
} from 'lucide-react';
import { toast } from 'sonner';
import { useMarketAuth } from '@/lib/market-auth-context';
import { marketplaceApi } from '@/lib/marketplace-api';
import { toBengaliNumber } from '@/lib/mockProducts';

export default function MarketplaceDashboardPage() {
  const router = useRouter();
  const { user, token, isLoading: authLoading } = useMarketAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalDownloads: 0,
    totalEarnings: 0,
    avgRating: 0,
    totalViews: 0,
    totalCustomOrders: 0,
    pendingProducts: 0,
    approvedProducts: 0,
    rejectedProducts: 0,
    // Admin stats
    totalCreators: 0,
    pendingApprovals: 0,
    totalRevenue: 0,
  });
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [recentDownloads, setRecentDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasCreatorProfile, setHasCreatorProfile] = useState(false);

  const isSuperAdmin = user?.role === 'super_admin' || user?.role === 'admin';
  const isCreator = user?.role === 'creator';
  const isRegularUser = user?.role === 'user';

  useEffect(() => {
    if (!authLoading) {
      if (!token) {
        toast.error('অনুগ্রহ করে লগইন করুন');
        router.push('/market/login?redirect=/market/dashboard');
        return;
      }

      fetchDashboardData();
    }
  }, [authLoading, token, router, isSuperAdmin, isCreator]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Check creator profile for regular users
      if (isRegularUser) {
        try {
          const profileResponse = await marketplaceApi.getCreatorProfile();
          setHasCreatorProfile(!!profileResponse.data);
        } catch (error) {
          setHasCreatorProfile(false);
        }
        setLoading(false);
        return;
      }

      if (isSuperAdmin) {
        // Admin Data Fetching
        const statsResponse = await marketplaceApi.getAdminStats();
        setStats({
          ...stats,
          totalProducts: statsResponse.data.totalProducts,
          totalCreators: statsResponse.data.totalCreators,
          pendingApprovals: statsResponse.data.pendingApprovals,
          totalRevenue: statsResponse.data.totalRevenue,
        });
      } else if (isCreator) {
        // Creator Data Fetching
        const productsResponse = await marketplaceApi.getMyProducts();
        const downloadsResponse = await marketplaceApi.getDownloads({ per_page: 5 });
        const ordersResponse = await marketplaceApi.getMyOrders({ per_page: 5 });
        
        const totalDownloads = productsResponse.data.reduce((sum: number, p: any) => sum + p.downloads_count, 0);
        const totalEarnings = productsResponse.data.reduce((sum: number, p: any) => sum + (p.price * p.downloads_count), 0);
        const totalViews = productsResponse.data.reduce((sum: number, p: any) => sum + p.views_count, 0);
        const avgRating = productsResponse.data.reduce((sum: number, p: any) => sum + p.rating, 0) / productsResponse.data.length || 0;
        
        const pendingProducts = productsResponse.data.filter((p: any) => p.status === 'pending').length;
        const approvedProducts = productsResponse.data.filter((p: any) => p.status === 'approved').length;
        const rejectedProducts = productsResponse.data.filter((p: any) => p.status === 'rejected').length;

        setStats({
          totalProducts: productsResponse.data.length,
          totalDownloads,
          totalEarnings,
          avgRating,
          totalViews,
          totalCustomOrders: ordersResponse.data.length,
          pendingProducts,
          approvedProducts,
          rejectedProducts,
          totalCreators: 0,
          pendingApprovals: 0,
          totalRevenue: 0,
        });
        
        setRecentProducts(productsResponse.data.slice(0, 5));
        setRecentDownloads(downloadsResponse.data.slice(0, 5));
      }
    } catch (error: any) {
      console.error(error);
      toast.error('ড্যাশবোর্ড ডেটা লোড করতে ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#C8102E]" />
      </div>
    );
  }

  // Show onboarding for regular users
  if (isRegularUser) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            স্বাগতম, {user?.name}
          </h1>
          <p className="text-gray-600">
            মার্কেটপ্লেসে আপনার যাত্রা শুরু করুন
          </p>
        </div>

        <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-8 md:p-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
              <UserPlus className="w-8 h-8 text-blue-600" />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              ক্রিয়েটর হিসেবে যোগ দিন
            </h2>
            
            <p className="text-gray-600 mb-8 text-lg">
              আপনার ডিজাইন আপলোড করুন, বিক্রয় করুন এবং উপার্জন করুন। 
              {hasCreatorProfile 
                ? ' আপনার ক্রিয়েটর প্রোফাইল অনুমোদনের জন্য অপেক্ষমাণ।'
                : ' প্রথমে আপনার প্রোফাইল সম্পূর্ণ করুন।'
              }
            </p>
            
            {!hasCreatorProfile && (
              <Link
                href="/market/dashboard/settings"
                className="inline-flex items-center gap-2 bg-[#C8102E] text-white px-8 py-4 rounded-xl hover:bg-[#A00D24] transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                <Settings className="w-5 h-5" />
                প্রোফাইল সম্পূর্ণ করুন
              </Link>
            )}
            
            {hasCreatorProfile && (
              <div className="inline-flex items-center gap-3 bg-yellow-50 text-yellow-800 px-6 py-3 rounded-xl border border-yellow-200">
                <Clock className="w-5 h-5" />
                <span className="font-medium">অনুমোদনের জন্য অপেক্ষমাণ</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">ডিজাইন আপলোড করুন</h3>
            <p className="text-sm text-gray-600">
              আপনার সৃজনশীল ডিজাইন আপলোড করুন এবং শেয়ার করুন
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Download className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">বিক্রয় করুন</h3>
            <p className="text-sm text-gray-600">
              আপনার ডিজাইন বিক্রয় করুন এবং ডাউনলোড ট্র্যাক করুন
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">উপার্জন করুন</h3>
            <p className="text-sm text-gray-600">
              প্রতিটি ডাউনলোড থেকে আয় করুন এবং পেমেন্ট পান
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {isSuperAdmin ? 'মার্কেটপ্লেস ম্যানেজমেন্ট' : 'ড্যাশবোর্ড'}
            </h1>
            <p className="text-gray-600">
              {isSuperAdmin ? 'ডিজাইন অনুমোদন এবং পরিচালনা করুন' : `স্বাগতম, ${user?.name}`}
            </p>
          </div>
          {!isSuperAdmin && (
            <Link
              href="/market/dashboard/products/create"
              className="inline-flex items-center gap-2 bg-[#C8102E] text-white px-6 py-3 rounded-xl hover:bg-[#A00D24] transition-colors font-semibold shadow-sm"
            >
              <Plus className="w-5 h-5" />
              <span>নতুন ডিজাইন</span>
            </Link>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-lg text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
                <Package className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 opacity-60" />
            </div>
            <p className="text-blue-100 text-sm mb-1">মোট ডিজাইন</p>
            <p className="text-3xl font-bold">{toBengaliNumber(stats.totalProducts)}</p>
          </motion.div>

          {isSuperAdmin ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-lg text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
                    <Users className="w-6 h-6" />
                  </div>
                  <Activity className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-purple-100 text-sm mb-1">মোট ক্রিয়েটর</p>
                <p className="text-3xl font-bold">{toBengaliNumber(stats.totalCreators)}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-linear-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 shadow-lg text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
                    <Clock className="w-6 h-6" />
                  </div>
                  <AlertCircle className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-orange-100 text-sm mb-1">পেন্ডিং অনুমোদন</p>
                <p className="text-3xl font-bold">{toBengaliNumber(stats.pendingApprovals)}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-lg text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <BarChart3 className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-green-100 text-sm mb-1">মোট রাজস্ব</p>
                <p className="text-3xl font-bold">৳{toBengaliNumber(stats.totalRevenue)}</p>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-lg text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
                    <Download className="w-6 h-6" />
                  </div>
                  <TrendingUp className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-green-100 text-sm mb-1">মোট ডাউনলোড</p>
                <p className="text-3xl font-bold">{toBengaliNumber(stats.totalDownloads)}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-linear-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 shadow-lg text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
                    <Star className="w-6 h-6" />
                  </div>
                  <Activity className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-orange-100 text-sm mb-1">গড় রেটিং</p>
                <p className="text-3xl font-bold">{toBengaliNumber(stats.avgRating.toFixed(1))}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-linear-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 shadow-lg text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
                    <Eye className="w-6 h-6" />
                  </div>
                  <BarChart3 className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-indigo-100 text-sm mb-1">মোট ভিউ</p>
                <p className="text-3xl font-bold">{toBengaliNumber(stats.totalViews)}</p>
              </motion.div>
            </>
          )}
        </div>

        {/* Additional Stats Row for Creators */}
        {!isSuperAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{toBengaliNumber(stats.pendingProducts)}</p>
                  <p className="text-sm text-gray-600">পেন্ডিং</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{toBengaliNumber(stats.approvedProducts)}</p>
                  <p className="text-sm text-gray-600">অনুমোদিত</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{toBengaliNumber(stats.rejectedProducts)}</p>
                  <p className="text-sm text-gray-600">প্রত্যাখ্যাত</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{toBengaliNumber(stats.totalCustomOrders)}</p>
                  <p className="text-sm text-gray-600">কাস্টম অর্ডার</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Recent Activity Section for Creators */}
        {!isSuperAdmin && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">সাম্প্রতিক ডিজাইন</h3>
                </div>
                <Link href="/market/dashboard/products" className="text-sm text-[#C8102E] hover:underline">
                  সব দেখুন
                </Link>
              </div>
              <div className="p-6">
                {recentProducts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">কোন ডিজাইন নেই</p>
                ) : (
                  <div className="space-y-3">
                    {recentProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={`/market/dashboard/products/${product.uid}/edit`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                          {product.images?.[0]?.thumbnail_url && (
                            <img 
                              src={product.images[0].thumbnail_url} 
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{product.title}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{toBengaliNumber(product.downloads_count)} ডাউনলোড</span>
                            <span>•</span>
                            <span className={`px-2 py-0.5 rounded-full ${
                              product.status === 'approved' ? 'bg-green-100 text-green-700' :
                              product.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {product.status === 'approved' ? 'অনুমোদিত' :
                               product.status === 'pending' ? 'পেন্ডিং' : 'প্রত্যাখ্যাত'}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recent Downloads */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">সাম্প্রতিক ডাউনলোড</h3>
                </div>
                <Link href="/market/dashboard/downloads" className="text-sm text-[#C8102E] hover:underline">
                  সব দেখুন
                </Link>
              </div>
              <div className="p-6">
                {recentDownloads.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">কোন ডাউনলোড নেই</p>
                ) : (
                  <div className="space-y-3">
                    {recentDownloads.map((download) => (
                      <div
                        key={download.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
                      >
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                          <Download className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{download.product?.title}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(download.created_at).toLocaleDateString('bn-BD')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
    </div>
  );
}
