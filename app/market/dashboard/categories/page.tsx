'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit, Trash2, Loader2, Search, ToggleLeft, ToggleRight,
  GripVertical, Save, X, Upload, ImageIcon, Tag, Package
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { useMarketAuth } from '@/lib/market-auth-context';
import { marketplaceApi, Category } from '@/lib/marketplace-api';
import { toBengaliNumber } from '@/lib/mockProducts';
import { getMarketplaceImageUrl } from '@/lib/marketplace-image-utils';
import ProtectedRoute from '@/components/ProtectedRoute';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import DynamicIcon from '@/components/DynamicIcon';

function CategoriesPageContent() {
  const { user, isLoading: authLoading } = useMarketAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    name_bn: '',
    slug: '',
    description: '',
    icon: '',
    order: 0,
    status: true,
  });
  
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      fetchCategories();
    }
  }, [authLoading]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // Don't pass status filter to show both active and inactive categories
      const response = await marketplaceApi.adminGetCategories({ per_page: 100 });
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('ক্যাটেগরি লোড করতে ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      name_bn: '',
      slug: '',
      description: '',
      icon: '',
      order: 0,
      status: true,
    });
    setBannerFile(null);
    setBannerPreview(null);
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('ব্যানার সাইজ সর্বোচ্চ ২MB হতে পারে');
        return;
      }
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.slug) {
      toast.error('নাম এবং স্লাগ আবশ্যক');
      return;
    }

    try {
      const data = new FormData();
      data.append('name', formData.name);
      if (formData.name_bn) data.append('name_bn', formData.name_bn);
      data.append('slug', formData.slug);
      if (formData.description) data.append('description', formData.description);
      if (formData.icon) data.append('icon', formData.icon);
      data.append('order', formData.order.toString());
      data.append('status', formData.status ? '1' : '0');
      if (bannerFile) data.append('banner', bannerFile);

      await marketplaceApi.createCategory(data);
      toast.success('ক্যাটেগরি তৈরি হয়েছে');
      setShowCreateModal(false);
      resetForm();
      fetchCategories();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'ক্যাটেগরি তৈরি করতে ব্যর্থ হয়েছে');
    }
  };

  const handleEdit = async () => {
    if (!editingCategory || !formData.name || !formData.slug) {
      toast.error('নাম এবং স্লাগ আবশ্যক');
      return;
    }

    try {
      const data = new FormData();
      data.append('name', formData.name);
      if (formData.name_bn) data.append('name_bn', formData.name_bn);
      data.append('slug', formData.slug);
      if (formData.description) data.append('description', formData.description);
      if (formData.icon) data.append('icon', formData.icon);
      data.append('order', formData.order.toString());
      data.append('status', formData.status ? '1' : '0');
      if (bannerFile) data.append('banner', bannerFile);
      data.append('_method', 'PUT');

      await marketplaceApi.updateCategory(editingCategory.id, data);
      toast.success('ক্যাটেগরি আপডেট হয়েছে');
      setShowEditModal(false);
      setEditingCategory(null);
      resetForm();
      fetchCategories();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'ক্যাটেগরি আপডেট করতে ব্যর্থ হয়েছে');
    }
  };

  const handleToggleStatus = async (category: Category) => {
    try {
      await marketplaceApi.toggleCategoryStatus(category.id);
      toast.success('স্ট্যাটাস আপডেট হয়েছে');
      fetchCategories();
    } catch (error) {
      toast.error('স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে');
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await marketplaceApi.deleteCategory(categoryToDelete);
      toast.success('ক্যাটেগরি মুছে ফেলা হয়েছে');
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || 'ক্যাটেগরি মুছতে ব্যর্থ হয়েছে');
    } finally {
      setCategoryToDelete(null);
    }
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      name_bn: category.name_bn || '',
      slug: category.slug,
      description: category.description || '',
      icon: category.icon || '',
      order: category.order,
      status: category.status,
    });
    setBannerPreview(getMarketplaceImageUrl(category.banner || null));
    setShowEditModal(true);
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.name_bn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-[#C8102E]" />
      </div>
    );
  }

  if (user?.role !== 'super_admin') {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-semibold">শুধুমাত্র সুপার অ্যাডমিন অ্যাক্সেস করতে পারবেন</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">ক্যাটেগরি ম্যানেজমেন্ট</h1>
          <p className="text-sm text-gray-500">মোট {toBengaliNumber(categories.length)} টি ক্যাটেগরি</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="inline-flex items-center gap-2 bg-[#C8102E] text-white px-6 py-3 rounded-xl hover:bg-[#A00D24] transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          নতুন ক্যাটেগরি
        </motion.button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ক্যাটেগরি খুঁজুন..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E] text-sm"
          />
        </div>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#C8102E]" />
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-16">
          <div className="text-center">
            <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
              <Tag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">কোন ক্যাটেগরি পাওয়া যায়নি</h3>
            <p className="text-gray-500 mb-6">নতুন ক্যাটেগরি তৈরি করুন</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category, index) => {
            const bannerUrl = getMarketplaceImageUrl(category.banner || null);
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                {/* Banner Image */}
                <div className="relative h-32 bg-linear-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {bannerUrl ? (
                    <Image
                      src={bannerUrl}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => handleToggleStatus(category)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-lg backdrop-blur-sm ${
                        category.status
                          ? 'bg-green-500/90 text-white hover:bg-green-600'
                          : 'bg-gray-500/90 text-white hover:bg-gray-600'
                      }`}
                    >
                      {category.status ? (
                        <><ToggleRight className="w-3.5 h-3.5" /> সক্রিয়</>
                      ) : (
                        <><ToggleLeft className="w-3.5 h-3.5" /> বন্ধ</>
                      )}
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    {category.icon && (
                      <div className="w-12 h-12 bg-linear-to-br from-[#C8102E]/10 to-[#C8102E]/5 rounded-xl flex items-center justify-center text-[#C8102E] shrink-0">
                        <DynamicIcon name={category.icon} className="w-6 h-6" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">{category.name}</h3>
                      {category.name_bn && (
                        <p className="text-sm text-gray-600 line-clamp-1">{category.name_bn}</p>
                      )}
                    </div>
                  </div>

                  {category.description && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{category.description}</p>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 mb-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-600">অর্ডার:</span>
                      <span className="font-bold text-gray-900">{toBengaliNumber(category.order)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-bold text-blue-600">{toBengaliNumber(category.products_count || 0)}</span>
                      <span className="text-gray-600">পণ্য</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 mb-4">
                    <div className="flex-1 bg-gray-100 rounded-lg px-3 py-2">
                      <span className="text-xs text-gray-500 font-medium">স্লাগ:</span>
                      <p className="text-xs font-mono text-gray-900 mt-0.5 truncate">{category.slug}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openEditModal(category)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-colors font-semibold text-sm border border-amber-200"
                    >
                      <Edit className="w-4 h-4" />
                      এডিট
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setCategoryToDelete(category.id);
                        setDeleteConfirmOpen(true);
                      }}
                      className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors border border-red-200"
                      title="মুছুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {(showCreateModal || showEditModal) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              setEditingCategory(null);
              resetForm();
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-xl font-bold text-gray-900">
                  {showCreateModal ? 'নতুন ক্যাটেগরি' : 'ক্যাটেগরি এডিট করুন'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    setEditingCategory(null);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      নাম (English) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E]"
                      placeholder="Banner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      নাম (বাংলা)
                    </label>
                    <input
                      type="text"
                      value={formData.name_bn}
                      onChange={(e) => setFormData({ ...formData, name_bn: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E]"
                      placeholder="ব্যানার"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      স্লাগ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E] font-mono text-sm"
                      placeholder="banner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      আইকন (Lucide Icon Name)
                    </label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E]"
                      placeholder="flag"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    বিবরণ
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E] resize-none"
                    placeholder="ক্যাটেগরি সম্পর্কে বিবরণ..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      অর্ডার
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E]"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      স্ট্যাটাস
                    </label>
                    <select
                      value={formData.status ? 'active' : 'inactive'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value === 'active' })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E]"
                    >
                      <option value="active">সক্রিয়</option>
                      <option value="inactive">নিষ্ক্রিয়</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ব্যানার ছবি
                  </label>
                  <div className="space-y-2">
                    {bannerPreview && (
                      <div className="relative w-full h-32 rounded-xl overflow-hidden border-2 border-gray-200">
                        <Image
                          src={bannerPreview}
                          alt="Banner Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#C8102E] transition-colors cursor-pointer">
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-600">ব্যানার আপলোড করুন</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    setEditingCategory(null);
                    resetForm();
                  }}
                  className="px-6 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  বাতিল
                </button>
                <button
                  onClick={showCreateModal ? handleCreate : handleEdit}
                  className="px-6 py-2.5 bg-[#C8102E] text-white rounded-xl hover:bg-[#A00D24] transition-colors font-semibold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {showCreateModal ? 'তৈরি করুন' : 'আপডেট করুন'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setCategoryToDelete(null);
        }}
        onConfirm={handleDelete}
        title="ক্যাটেগরি মুছুন"
        description="আপনি কি নিশ্চিত যে এই ক্যাটেগরিটি মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।"
        confirmText="হ্যাঁ, মুছুন"
        cancelText="বাতিল"
      />
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <ProtectedRoute requireCreator>
      <CategoriesPageContent />
    </ProtectedRoute>
  );
}
