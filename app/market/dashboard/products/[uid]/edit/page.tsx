'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Loader2, ImageIcon, FileDown, AlertCircle, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useMarketAuth } from '@/lib/market-auth-context';
import { marketplaceApi, Product, ProductImage, ProductFile, Category } from '@/lib/marketplace-api';
import Image from 'next/image';
import { getMarketplaceImageUrl } from '@/lib/marketplace-image-utils';
import ProtectedRoute from '@/components/ProtectedRoute';

function EditProductPageContent() {
  const router = useRouter();
  const params = useParams();
  const uid = params?.uid as string;
  const { token, user, isLoading: authLoading } = useMarketAuth();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  
  // Existing images/files from server
  const [existingPreviewImages, setExistingPreviewImages] = useState<ProductImage[]>([]);
  const [existingDownloadFiles, setExistingDownloadFiles] = useState<ProductFile[]>([]);
  const [removedPreviewImageIds, setRemovedPreviewImageIds] = useState<number[]>([]);
  const [removedDownloadFileIds, setRemovedDownloadFileIds] = useState<number[]>([]);
  
  // New uploads
  const [newPreviewImages, setNewPreviewImages] = useState<File[]>([]);
  const [newPreviewImageUrls, setNewPreviewImageUrls] = useState<string[]>([]);
  const [newDownloadFiles, setNewDownloadFiles] = useState<File[]>([]);
  const [newDownloadFileNames, setNewDownloadFileNames] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    enable_download: true,
    enable_custom_order: true,
  });

  useEffect(() => {
    if (!authLoading && !token) {
      toast.error('অনুগ্রহ করে লগইন করুন');
      router.push('/market/login?redirect=/market/dashboard/products');
      return;
    }
    
    if (!authLoading && token && uid) {
      fetchProduct();
      fetchCategories();
    }
  }, [authLoading, token, uid]);

  const fetchCategories = async () => {
    try {
      const response = await marketplaceApi.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('ক্যাটেগরি লোড করতে ব্যর্থ হয়েছে');
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await marketplaceApi.getProduct(uid);
      const productData = response.data;
      
      // Check if user owns this product
      if (user?.role !== 'admin' && user?.role !== 'super_admin') {
        if (productData.creator?.id !== user?.creator_profile?.id) {
          toast.error('আপনি এই ডিজাইন এডিট করার অনুমতি নেই');
          router.push('/market/dashboard/products');
          return;
        }
      }

      setProduct(productData);
      
      // Separate preview images and download files
      const previewImgs = (productData.images || []).filter((img: ProductImage) => img.type === 'image');
      const downloadFiles = productData.files || [];
      
      setExistingPreviewImages(previewImgs);
      setExistingDownloadFiles(downloadFiles);
      
      setFormData({
        title: productData.title,
        description: productData.description || '',
        category_id: productData.category_id?.toString() || '',
        enable_download: productData.enable_download,
        enable_custom_order: productData.enable_custom_order,
      });
    } catch (error: any) {
      console.error(error);
      toast.error('ডিজাইন লোড করতে ব্যর্থ হয়েছে');
      router.push('/market/dashboard/products');
    } finally {
      setLoading(false);
    }
  };

  const handleNewPreviewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const totalPreviewCount = existingPreviewImages.length - removedPreviewImageIds.length + newPreviewImages.length;
    if (files.length + totalPreviewCount > 5) {
      toast.error('সর্বোচ্চ ৫টি প্রিভিউ ছবি আপলোড করতে পারবেন');
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(f => !validTypes.includes(f.type));
    
    if (invalidFiles.length > 0) {
      toast.error('শুধুমাত্র JPG, PNG, WEBP ফরম্যাট সমর্থিত');
      return;
    }

    setNewPreviewImages([...newPreviewImages, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPreviewImageUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleNewDownloadFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const totalDownloadCount = existingDownloadFiles.length - removedDownloadFileIds.length + newDownloadFiles.length;
    if (files.length + totalDownloadCount > 10) {
      toast.error('সর্বোচ্চ ১০টি ডাউনলোড ফাইল আপলোড করতে পারবেন');
      return;
    }

    const maxSize = 50 * 1024 * 1024;
    const largeFiles = files.filter(f => f.size > maxSize);
    
    if (largeFiles.length > 0) {
      toast.error('প্রতিটি ফাইল সর্বোচ্চ ৫০MB হতে পারে');
      return;
    }

    setNewDownloadFiles([...newDownloadFiles, ...files]);
    setNewDownloadFileNames([...newDownloadFileNames, ...files.map(f => f.name)]);
  };

  const removeExistingPreviewImage = (imageId: number) => {
    setRemovedPreviewImageIds([...removedPreviewImageIds, imageId]);
  };

  const removeExistingDownloadFile = (fileId: number) => {
    setRemovedDownloadFileIds([...removedDownloadFileIds, fileId]);
  };

  const removeNewPreviewImage = (index: number) => {
    setNewPreviewImages(newPreviewImages.filter((_, i) => i !== index));
    setNewPreviewImageUrls(newPreviewImageUrls.filter((_, i) => i !== index));
  };

  const removeNewDownloadFile = (index: number) => {
    setNewDownloadFiles(newDownloadFiles.filter((_, i) => i !== index));
    setNewDownloadFileNames(newDownloadFileNames.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleStepOne = () => {
    if (!formData.title || !formData.description) {
      toast.error('সকল তথ্য পূরণ করুন');
      return;
    }
    setCurrentStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const totalPreviewCount = existingPreviewImages.length - removedPreviewImageIds.length + newPreviewImages.length;
    if (totalPreviewCount === 0) {
      toast.error('অন্তত একটি প্রিভিউ ছবি থাকা আবশ্যক');
      return;
    }

    const totalDownloadCount = existingDownloadFiles.length - removedDownloadFileIds.length + newDownloadFiles.length;
    if (formData.enable_download && totalDownloadCount === 0) {
      toast.error('ডাউনলোড সক্রিয় থাকলে অন্তত একটি ফাইল থাকা আবশ্যক');
      return;
    }

    if (!formData.enable_download && !formData.enable_custom_order) {
      toast.error('ডাউনলোড অথবা কাস্টম অর্ডার - অন্তত একটি সক্রিয় করুন');
      return;
    }

    setUploading(true);

    try {
      const productFormData = new FormData();
      productFormData.append('title', formData.title);
      productFormData.append('description', formData.description);
      if (formData.category_id) {
        productFormData.append('category_id', formData.category_id);
      }
      productFormData.append('enable_download', formData.enable_download ? '1' : '0');
      productFormData.append('enable_custom_order', formData.enable_custom_order ? '1' : '0');
      productFormData.append('_method', 'PUT');
      
      // Add removed image IDs
      removedPreviewImageIds.forEach((id, index) => {
        productFormData.append(`remove_preview_images[${index}]`, id.toString());
      });
      
      removedDownloadFileIds.forEach((id, index) => {
        productFormData.append(`remove_download_files[${index}]`, id.toString());
      });
      
      // Add new preview images
      newPreviewImages.forEach((image, index) => {
        productFormData.append(`preview_images[${index}]`, image);
      });

      // Add new download files - always send if there are files to upload
      newDownloadFiles.forEach((file, index) => {
        productFormData.append(`download_files[${index}]`, file);
      });

      await marketplaceApi.updateProduct(uid, productFormData);
      
      toast.success('ডিজাইন সফলভাবে আপডেট হয়েছে!');
      router.push('/market/dashboard/products');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'আপডেট করতে ব্যর্থ হয়েছে');
    } finally {
      setUploading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#C8102E]" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => router.push('/market/dashboard/products')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">ডিজাইন এডিট করুন</h1>
            <p className="text-gray-600">আপনার ডিজাইন আপডেট করুন</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${currentStep >= 1 ? 'bg-[#C8102E] text-white' : 'bg-gray-200 text-gray-500'}`}>
                {currentStep > 1 ? <CheckCircle className="w-5 h-5" /> : '১'}
              </div>
              <span className={`ml-3 font-medium ${currentStep >= 1 ? 'text-gray-900' : 'text-gray-500'}`}>
                প্রোডাক্ট তথ্য
              </span>
            </div>
            <div className="w-24 h-1 bg-gray-200 relative">
              <div className={`absolute inset-0 bg-[#C8102E] transition-all ${currentStep >= 2 ? 'w-full' : 'w-0'}`} />
            </div>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${currentStep >= 2 ? 'bg-[#C8102E] text-white' : 'bg-gray-200 text-gray-500'}`}>
                ২
              </div>
              <span className={`ml-3 font-medium ${currentStep >= 2 ? 'text-gray-900' : 'text-gray-500'}`}>
                ফাইল আপলোড
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ডিজাইনের নাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E]"
                    placeholder="যেমন: নির্বাচনী পোস্টার ডিজাইন প্যাকেজ"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    বিবরণ <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E] resize-none"
                    placeholder="আপনার ডিজাইন সম্পর্কে বিস্তারিত লিখুন..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ক্যাটেগরি
                  </label>
                  {categoriesLoading ? (
                    <div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 animate-pulse">লোড হচ্ছে...</div>
                  ) : (
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E]"
                    >
                      <option value="">ক্যাটেগরি নির্বাচন করুন (ঐচ্ছিক)</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name_bn || category.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <hr className="my-6" />

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">প্রোডাক্ট অপশন</h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer p-4 border border-gray-200 rounded-xl hover:border-[#C8102E] transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.enable_download}
                        onChange={(e) => setFormData({ ...formData, enable_download: e.target.checked })}
                        className="w-5 h-5 text-[#C8102E] border-gray-300 rounded focus:ring-[#C8102E] mt-0.5"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-900 block">ডাউনলোড সক্রিয় করুন</span>
                        <span className="text-xs text-gray-500">ক্রেতারা ফাইল ডাউনলোড করতে পারবে</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer p-4 border border-gray-200 rounded-xl hover:border-[#C8102E] transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.enable_custom_order}
                        onChange={(e) => setFormData({ ...formData, enable_custom_order: e.target.checked })}
                        className="w-5 h-5 text-[#C8102E] border-gray-300 rounded focus:ring-[#C8102E] mt-0.5"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-900 block">কাস্টম অর্ডার গ্রহণ করুন</span>
                        <span className="text-xs text-gray-500">ক্রেতারা আপনার কাছে কাস্টমাইজ অর্ডার দিতে পারবে</span>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleStepOne}
                  className="w-full bg-[#C8102E] text-white py-4 rounded-xl font-semibold hover:bg-[#A00D24] transition-colors flex items-center justify-center gap-2 mt-8"
                >
                  <span>পরবর্তী ধাপ</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">ফাইল আপলোড নির্দেশনা</p>
                    <p className="text-blue-700">
                      <strong>প্রিভিউ ছবি:</strong> ক্রেতারা এই ছবিগুলি দেখবে (পাবলিক)। 
                      {formData.enable_download && <><strong className="ml-2">ডাউনলোড ফাইল:</strong> সুরক্ষিত ফাইল যা ডাউনলোড করার পর পাবে।</>}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    প্রিভিউ ছবি <span className="text-red-500">*</span>
                    <span className="text-xs font-normal text-gray-500 ml-2">(সর্বোচ্চ ৫টি, প্রতিটি 5MB পর্যন্ত)</span>
                  </label>

                  {/* Existing Preview Images */}
                  {existingPreviewImages.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">বর্তমান ছবি:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {existingPreviewImages.map((image) => (
                          !removedPreviewImageIds.includes(image.id) && (
                            <div key={image.id} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200">
                              <Image
                                src={getMarketplaceImageUrl(image.thumbnail_url) || ''}
                                alt="Preview"
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => removeExistingPreviewImage(image.id)}
                                  className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Preview Images */}
                  <label className="block">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      multiple
                      onChange={handleNewPreviewImageChange}
                      className="hidden"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#C8102E] hover:bg-red-50/50 transition-colors">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-700 font-medium mb-1">নতুন প্রিভিউ ছবি আপলোড করুন</p>
                      <p className="text-sm text-gray-500">JPG, PNG, WEBP (সর্বোচ্চ 5MB প্রতিটি)</p>
                    </div>
                  </label>

                  {newPreviewImageUrls.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                      {newPreviewImageUrls.map((url, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200">
                          <img src={url} alt={`New Preview ${index + 1}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => removeNewPreviewImage(index)}
                              className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            নতুন
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* File upload section - Always show in edit mode */}
                <>
                  <hr className="my-8" />
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-semibold text-gray-700">
                        ডাউনলোড ফাইল
                        <span className="text-xs font-normal text-gray-500 ml-2">(সর্বোচ্চ ১০টি, প্রতিটি 50MB পর্যন্ত)</span>
                      </label>
                      {!formData.enable_download && (
                        <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                          ডাউনলোড সক্রিয় নেই
                        </span>
                      )}
                    </div>

                      {/* Existing Download Files - Always show section */}
                      {existingDownloadFiles.length > 0 && (
                        <div className="mb-4 space-y-2">
                          <p className="text-sm font-semibold text-gray-700 mb-3">বর্তমান ফাইল ({existingDownloadFiles.filter(f => !removedDownloadFileIds.includes(f.id)).length}):</p>
                          {existingDownloadFiles.map((file) => (
                            !removedDownloadFileIds.includes(file.id) && (
                              <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className="w-10 h-10 rounded-lg bg-[#C8102E]/10 flex items-center justify-center shrink-0">
                                    <FileDown className="w-5 h-5 text-[#C8102E]" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {file.filename}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {file.formatted_size}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      try {
                                        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/marketplace/products/${uid}/files/${file.id}/download`, {
                                          headers: {
                                            'Authorization': `Bearer ${token}`,
                                          },
                                        });
                                        if (!response.ok) throw new Error('Download failed');
                                        const blob = await response.blob();
                                        const url = window.URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = file.filename;
                                        document.body.appendChild(a);
                                        a.click();
                                        window.URL.revokeObjectURL(url);
                                        document.body.removeChild(a);
                                      } catch (error) {
                                        toast.error('ফাইল ডাউনলোড করতে ব্যর্থ হয়েছে');
                                      }
                                    }}
                                    className="px-3 py-1.5 text-xs font-medium text-[#C8102E] hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                                  >
                                    <FileDown className="w-3.5 h-3.5" />
                                    ডাউনলোড
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeExistingDownloadFile(file.id)}
                                    className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-600 flex items-center justify-center"
                                  >
                                    <X className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      )}
                      
                      {/* New File Upload - Always visible when enable_download is true */}
                      <div>
                        {existingDownloadFiles.length === 0 && (
                          <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                              <strong>দ্রষ্টব্য:</strong> এই পণ্যের কোন ডাউনলোড ফাইল নেই। অনুগ্রহ করে নিচে থেকে ফাইল আপলোড করুন।
                            </p>
                          </div>
                        )}
                        <label className="block">
                          <input
                            type="file"
                            accept="image/*,.pdf,.ai,.psd,.eps,.svg,.zip,.rar"
                            multiple
                            onChange={handleNewDownloadFileChange}
                            className="hidden"
                          />
                          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#C8102E] hover:bg-red-50/50 transition-colors">
                            <FileDown className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-700 font-medium mb-1">নতুন ডাউনলোড ফাইল আপলোড করুন</p>
                            <p className="text-sm text-gray-500">সব ধরনের ফাইল (PSD, AI, PDF, SVG, ZIP ইত্যাদি)</p>
                          </div>
                        </label>
                      </div>

                      {newDownloadFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm text-gray-600 mb-2">নতুন ফাইল:</p>
                          {newDownloadFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                                  <FileDown className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeNewDownloadFile(index)}
                                className="ml-3 w-8 h-8 rounded-lg hover:bg-red-50 text-red-600 flex items-center justify-center shrink-0"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>

                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 border border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>পূর্ববর্তী</span>
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-[#C8102E] text-white py-4 rounded-xl font-semibold hover:bg-[#A00D24] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>আপডেট হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        <span>ডিজাইন আপডেট করুন</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-sm text-gray-500 text-center mt-4">
                  পরিবর্তনের পর আপনার ডিজাইন পুনরায় অনুমোদনের অপেক্ষায় থাকবে
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  );
}

export default function EditProductPage() {
  return (
    <ProtectedRoute requireCreator>
      <EditProductPageContent />
    </ProtectedRoute>
  );
}
