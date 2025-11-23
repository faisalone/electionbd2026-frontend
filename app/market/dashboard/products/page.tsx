'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Plus, Eye, Edit, Trash2, CheckCircle, Clock, XCircle, 
  Loader2, Search, Filter, TrendingUp, Download, Star
} from 'lucide-react';
import { toast } from 'sonner';
import { useMarketAuth } from '@/lib/market-auth-context';
import { marketplaceApi, Product } from '@/lib/marketplace-api';
import { toBengaliNumber } from '@/lib/mockProducts';
import { getMarketplaceImageUrl } from '@/lib/marketplace-image-utils';
import ProtectedRoute from '@/components/ProtectedRoute';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

function ProductsPageContent() {
  const { user, token, isLoading: authLoading } = useMarketAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const isSuperAdmin = user?.role === 'super_admin' || user?.role === 'admin';

  // Calculate stats from products
  const stats = useMemo(() => {
    const approved = products.filter(p => p.status === 'approved').length;
    const pending = products.filter(p => p.status === 'pending').length;
    const totalDownloads = products.reduce((sum, p) => sum + p.downloads_count, 0);
    const avgRating = products.length > 0 
      ? products.reduce((sum, p) => sum + p.rating, 0) / products.length 
      : 0;

    return { approved, pending, totalDownloads, avgRating };
  }, [products]);

  useEffect(() => {
    if (!authLoading && token) {
      fetchProducts();
    }
  }, [authLoading, token, filter, isSuperAdmin, page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let response;
      if (isSuperAdmin) {
        response = await marketplaceApi.getAdminProducts({
          status: filter === 'all' ? undefined : filter,
          search: searchQuery || undefined,
          page,
          per_page: 10
        });
      } else {
        response = await marketplaceApi.getMyProducts({
          status: filter === 'all' ? undefined : filter,
          search: searchQuery || undefined,
          page,
          per_page: 10
        });
      }
      setProducts(response.data);
      setTotalPages(response.meta.last_page);
      setTotalItems(response.meta.total);
    } catch (error) {
      toast.error('ডিজাইন লোড করতে ব্যর্থ হয়েছে');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (uid: string) => {
    try {
      await marketplaceApi.approveProduct(uid);
      toast.success('ডিজাইন অনুমোদিত হয়েছে');
      fetchProducts();
    } catch (error) {
      toast.error('অনুমোদন করতে ব্যর্থ হয়েছে');
    }
  };

  const handleReject = async (uid: string) => {
    const reason = prompt('প্রত্যাখ্যানের কারণ লিখুন:');
    if (!reason) return;

    try {
      await marketplaceApi.rejectProduct(uid, reason);
      toast.success('ডিজাইন প্রত্যাখ্যাত হয়েছে');
      fetchProducts();
    } catch (error) {
      toast.error('প্রত্যাখ্যান করতে ব্যর্থ হয়েছে');
    }
  };

  const handleDeleteProduct = (uid: string) => {
    setProductToDelete(uid);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      if (isSuperAdmin) {
        await marketplaceApi.adminDeleteProduct(productToDelete);
      } else {
        await marketplaceApi.deleteProduct(productToDelete);
      }
      toast.success('ডিজাইন সফলভাবে মুছে ফেলা হয়েছে');
      fetchProducts();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'ডিজাইন মুছতে ব্যর্থ হয়েছে');
    } finally {
      setProductToDelete(null);
    }
  };

  if (loading && !products.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-[#C8102E] mb-4" />
        <p className="text-gray-500 text-sm">ডিজাইন লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {isSuperAdmin ? 'সকল ডিজাইন' : 'আমার ডিজাইন'}
            </h1>
            <p className="text-sm text-gray-500">
              মোট {toBengaliNumber(totalItems)} টি ডিজাইন
            </p>
          </div>
          {!isSuperAdmin && (
            <Link
              href="/market/dashboard/products/create"
              className="inline-flex items-center gap-2 bg-[#C8102E] text-white px-6 py-3 rounded-xl hover:bg-[#A00D24] transition-all shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 text-sm font-semibold"
            >
              <Plus className="w-5 h-5" />
              নতুন ডিজাইন যুক্ত করুন
            </Link>
          )}
        </div>

        {/* Quick Stats */}
        {!isSuperAdmin && products.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="bg-linear-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-700">
                    {toBengaliNumber(stats.approved)}
                  </p>
                  <p className="text-xs text-green-600 font-medium">অনুমোদিত</p>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500 rounded-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-700">
                    {toBengaliNumber(stats.pending)}
                  </p>
                  <p className="text-xs text-yellow-600 font-medium">পেন্ডিং</p>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-700">
                    {toBengaliNumber(stats.totalDownloads)}
                  </p>
                  <p className="text-xs text-blue-600 font-medium">ডাউনলোড</p>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-700">
                    {stats.avgRating.toFixed(1)}
                  </p>
                  <p className="text-xs text-purple-600 font-medium">গড় রেটিং</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Filter Buttons */}
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            {[
              { key: 'all', label: 'সকল', icon: Package },
              { key: 'pending', label: 'পেন্ডিং', icon: Clock },
              { key: 'approved', label: 'অনুমোদিত', icon: CheckCircle },
              { key: 'rejected', label: 'প্রত্যাখ্যাত', icon: XCircle },
            ].map(({ key, label, icon: Icon }) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setFilter(key as any);
                  setPage(1);
                }}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                  filter === key
                    ? 'bg-[#C8102E] text-white shadow-lg shadow-red-500/30'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </motion.button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
                placeholder="ডিজাইন খুঁজুন..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E] text-sm"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchProducts}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-semibold shadow-lg"
            >
              খুঁজুন
            </motion.button>
          </div>
        </div>
      </div>

      {/* Products Grid/Table */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center py-12"
          >
            <Loader2 className="w-8 h-8 animate-spin text-[#C8102E]" />
          </motion.div>
        ) : products.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 py-16"
          >
            <div className="text-center">
              <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                কোন ডিজাইন পাওয়া যায়নি
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? 'অনুসন্ধানের সাথে মিল পাওয়া যায়নি'
                  : 'এখনো কোন ডিজাইন যুক্ত করা হয়নি'}
              </p>
              {!isSuperAdmin && !searchQuery && (
                <Link
                  href="/market/dashboard/products/create"
                  className="inline-flex items-center gap-2 bg-[#C8102E] text-white px-6 py-3 rounded-xl hover:bg-[#A00D24] transition-all shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  নতুন ডিজাইন যুক্ত করুন
                </Link>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">ডিজাইন</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">স্ট্যাটাস</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">পরিসংখ্যান</th>
                    <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 border-2 border-gray-200 group">
                            {product.images[0]?.thumbnail_url ? (
                              <Image
                                src={getMarketplaceImageUrl(product.images[0].thumbnail_url) || ''}
                                alt={product.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Package className="w-8 h-8" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 line-clamp-1 mb-1">{product.title}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                {product.category}
                              </span>
                              {product.rating > 0 && (
                                <span className="text-xs text-yellow-600 flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-yellow-400" />
                                  {product.rating.toFixed(1)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center">
                          {product.status === 'approved' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-semibold border border-green-200">
                              <CheckCircle className="w-3.5 h-3.5" />
                              অনুমোদিত
                            </span>
                          )}
                          {product.status === 'pending' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg text-xs font-semibold border border-yellow-200">
                              <Clock className="w-3.5 h-3.5" />
                              পেন্ডিং
                            </span>
                          )}
                          {product.status === 'rejected' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-semibold border border-red-200">
                              <XCircle className="w-3.5 h-3.5" />
                              প্রত্যাখ্যাত
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col items-center gap-1">
                          {isSuperAdmin ? (
                            <span className="text-sm font-medium text-gray-700">{product.creator?.name || 'N/A'}</span>
                          ) : (
                            <>
                              <div className="flex items-center gap-1.5 text-blue-600">
                                <Download className="w-3.5 h-3.5" />
                                <span className="text-sm font-semibold">{toBengaliNumber(product.downloads_count)}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-gray-500">
                                <Eye className="w-3.5 h-3.5" />
                                <span className="text-xs">{toBengaliNumber(product.views_count)}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                              href={`/market/${product.uid}`}
                              target="_blank"
                              className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-blue-50 transition-colors text-blue-600"
                              title="দেখুন"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          </motion.div>
                          
                          {isSuperAdmin ? (
                            <>
                              {product.status === 'pending' && (
                                <>
                                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <button
                                      onClick={() => handleApprove(product.uid)}
                                      className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-green-50 transition-colors text-green-600"
                                      title="অনুমোদন"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </button>
                                  </motion.div>
                                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <button
                                      onClick={() => handleReject(product.uid)}
                                      className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-red-50 transition-colors text-red-600"
                                      title="প্রত্যাখ্যান"
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </button>
                                  </motion.div>
                                </>
                              )}
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <button
                                  onClick={() => handleDeleteProduct(product.uid)}
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-red-50 transition-colors text-red-600"
                                  title="মুছুন"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </motion.div>
                            </>
                          ) : (
                            <>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                  href={`/market/dashboard/products/${product.uid}/edit`}
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-amber-50 transition-colors text-amber-600"
                                  title="এডিট করুন"
                                >
                                  <Edit className="w-4 h-4" />
                                </Link>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <button
                                  onClick={() => handleDeleteProduct(product.uid)}
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-red-50 transition-colors text-red-600"
                                  title="মুছুন"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </motion.div>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between gap-4 bg-white rounded-xl shadow-sm border border-gray-100 p-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            পূর্ববর্তী
          </motion.button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">পৃষ্ঠা</span>
            <span className="px-4 py-2 bg-[#C8102E] text-white rounded-lg font-bold text-sm">
              {toBengaliNumber(page)}
            </span>
            <span className="text-sm text-gray-500">/ {toBengaliNumber(totalPages)}</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            পরবর্তী
          </motion.button>
        </motion.div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="ডিজাইন মুছুন"
        description={isSuperAdmin 
          ? "আপনি কি নিশ্চিত যে এই ডিজাইনটি স্থায়ীভাবে মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।"
          : "আপনি কি নিশ্চিত যে এই ডিজাইনটি মুছে ফেলতে চান?"}
        confirmText="হ্যাঁ, মুছুন"
        cancelText="বাতিল"
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <ProtectedRoute requireCreator>
      <ProductsPageContent />
    </ProtectedRoute>
  );
}
