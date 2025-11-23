'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Loader2, ImageIcon, FileDown, AlertCircle, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useMarketAuth } from '@/lib/market-auth-context';
import { marketplaceApi } from '@/lib/marketplace-api';
import ProtectedRoute from '@/components/ProtectedRoute';

const categories = [
  { value: 'banner', label: 'ব্যানার' },
  { value: 'leaflet', label: 'লিফলেট' },
  { value: 'poster', label: 'পোস্টার' },
  { value: 'festoon', label: 'ফেস্টুন' },
  { value: 'video', label: 'ভিডিও' },
  { value: 'handbill', label: 'হ্যান্ডবিল' },
  { value: 'billboard', label: 'বিলবোর্ড' },
  { value: 'social-media', label: 'সোশ্যাল মিডিয়া' },
];

function CreateProductPageContent() {
  const router = useRouter();
  const { token, isLoading: authLoading } = useMarketAuth();
  const [uploading, setUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [previewImages, setPreviewImages] = useState<File[]>([]);
  const [previewImageUrls, setPreviewImageUrls] = useState<string[]>([]);
  const [downloadFiles, setDownloadFiles] = useState<File[]>([]);
  const [downloadFileNames, setDownloadFileNames] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'banner',
    enable_download: true,
    enable_custom_order: true,
  });

  useEffect(() => {
    if (!authLoading && !token) {
      toast.error('অনুগ্রহ করে লগইন করুন');
      router.push('/market/login?redirect=/market/dashboard/products/create');
    }
  }, [authLoading, token, router]);

  const handlePreviewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + previewImages.length > 5) {
      toast.error('সর্বোচ্চ ৫টি প্রিভিউ ছবি আপলোড করতে পারবেন');
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(f => !validTypes.includes(f.type));
    
    if (invalidFiles.length > 0) {
      toast.error('শুধুমাত্র JPG, PNG, WEBP ফরম্যাট সমর্থিত');
      return;
    }

    setPreviewImages([...previewImages, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImageUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDownloadFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + downloadFiles.length > 10) {
      toast.error('সর্বোচ্চ ১০টি ডাউনলোড ফাইল আপলোড করতে পারবেন');
      return;
    }

    const maxSize = 50 * 1024 * 1024;
    const largeFiles = files.filter(f => f.size > maxSize);
    
    if (largeFiles.length > 0) {
      toast.error('প্রতিটি ফাইল সর্বোচ্চ ৫০MB হতে পারে');
      return;
    }

    setDownloadFiles([...downloadFiles, ...files]);
    setDownloadFileNames([...downloadFileNames, ...files.map(f => f.name)]);
  };

  const removePreviewImage = (index: number) => {
    setPreviewImages(previewImages.filter((_, i) => i !== index));
    setPreviewImageUrls(previewImageUrls.filter((_, i) => i !== index));
  };

  const removeDownloadFile = (index: number) => {
    setDownloadFiles(downloadFiles.filter((_, i) => i !== index));
    setDownloadFileNames(downloadFileNames.filter((_, i) => i !== index));
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

    if (previewImages.length === 0) {
      toast.error('অন্তত একটি প্রিভিউ ছবি আপলোড করুন');
      return;
    }

    if (formData.enable_download && downloadFiles.length === 0) {
      toast.error('ডাউনলোড সক্রিয় থাকলে অন্তত একটি ফাইল আপলোড করুন');
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
      productFormData.append('category', formData.category);
      productFormData.append('enable_download', formData.enable_download ? '1' : '0');
      productFormData.append('enable_custom_order', formData.enable_custom_order ? '1' : '0');
      
      previewImages.forEach((image, index) => {
        productFormData.append(`preview_images[${index}]`, image);
      });

      if (formData.enable_download) {
        downloadFiles.forEach((file, index) => {
          productFormData.append(`download_files[${index}]`, file);
        });
      }

      await marketplaceApi.createProduct(productFormData);
      
      toast.success('ডিজাইন সফলভাবে আপলোড হয়েছে! অনুমোদনের অপেক্ষায় আছে।');
      router.push('/market/dashboard/products');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'আপলোড করতে ব্যর্থ হয়েছে');
    } finally {
      setUploading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#C8102E]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">নতুন ডিজাইন তৈরি করুন</h1>
          <p className="text-gray-600">আপনার ডিজাইন আপলোড করুন এবং বিক্রয় শুরু করুন</p>
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
                    ক্যাটেগরি <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E]"
                    required
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
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
                  
                  <label className="block">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      multiple
                      onChange={handlePreviewImageChange}
                      className="hidden"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#C8102E] hover:bg-red-50/50 transition-colors">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-700 font-medium mb-1">প্রিভিউ ছবি আপলোড করুন</p>
                      <p className="text-sm text-gray-500">JPG, PNG, WEBP (সর্বোচ্চ 5MB প্রতিটি)</p>
                    </div>
                  </label>

                  {previewImageUrls.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                      {previewImageUrls.map((url, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200">
                          <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => removePreviewImage(index)}
                              className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          {index === 0 && (
                            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                              প্রধান
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {formData.enable_download && (
                  <>
                    <hr className="my-8" />
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        ডাউনলোড ফাইল <span className="text-red-500">*</span>
                        <span className="text-xs font-normal text-gray-500 ml-2">(সর্বোচ্চ ১০টি, প্রতিটি 50MB পর্যন্ত)</span>
                      </label>
                      
                      <label className="block">
                        <input
                          type="file"
                          accept="image/*,.pdf,.ai,.psd,.eps,.svg,.zip,.rar"
                          multiple
                          onChange={handleDownloadFileChange}
                          className="hidden"
                        />
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#C8102E] hover:bg-red-50/50 transition-colors">
                          <FileDown className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-700 font-medium mb-1">ডাউনলোড ফাইল আপলোড করুন</p>
                          <p className="text-sm text-gray-500">সব ধরনের ফাইল (PSD, AI, PDF, SVG, ZIP ইত্যাদি)</p>
                        </div>
                      </label>

                      {downloadFileNames.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {downloadFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-10 h-10 rounded-lg bg-[#C8102E]/10 flex items-center justify-center shrink-0">
                                  <FileDown className="w-5 h-5 text-[#C8102E]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeDownloadFile(index)}
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
                )}

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
                        <span>আপলোড হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        <span>ডিজাইন তৈরি করুন</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-sm text-gray-500 text-center mt-4">
                  আপনার ডিজাইন অনুমোদনের পর মার্কেটপ্লেসে প্রদর্শিত হবে
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  );
}

export default function CreateProductPage() {
  return (
    <ProtectedRoute requireCreator>
      <CreateProductPageContent />
    </ProtectedRoute>
  );
}
