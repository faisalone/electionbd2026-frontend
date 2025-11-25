'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Download, Star, 
  X, Check, Sparkles, ChevronLeft, ChevronRight,
  Award, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import SectionWrapper from '@/components/SectionWrapper';
import CreatorCard from '@/components/CreatorCard';
import ProductCard from '@/components/ProductCard';
import JoinCreatorBanner from '@/components/JoinCreatorBanner';
import DynamicIcon from '@/components/DynamicIcon';
import { toBengaliNumber, categoryLabels } from '@/lib/mockProducts';
import { marketplaceApi, Product } from '@/lib/marketplace-api';
import { useMarketAuth } from '@/lib/market-auth-context';
import { getMarketplaceImageUrl, getMarketplaceImageUrlWithFallback } from '@/lib/marketplace-image-utils';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token, isAuthenticated } = useMarketAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [isImageProtected, setIsImageProtected] = useState(true);
  
  const [downloadForm, setDownloadForm] = useState({
    name: '',
    phone: '',
  });
  
  const [customForm, setCustomForm] = useState({
    name: '',
    phone: '',
    details: '',
  });

  const [ratingForm, setRatingForm] = useState({
    name: '',
    rating: 5,
    comment: '',
  });
  
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [customSuccess, setCustomSuccess] = useState(false);
  const [ratingSuccess, setRatingSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const uid = params.uid as string;
        const response = await marketplaceApi.getProduct(uid);
        
        // Redirect if product is explicitly not approved (status field only present for authenticated users)
        // If status is undefined, it means user is not authenticated and backend already filtered non-approved products
        if (response.data.status && response.data.status !== 'approved') {
          toast.error('এই পণ্যটি এখনও অনুমোদিত হয়নি');
          router.push('/market');
          return;
        }
        
        setProduct(response.data);
        
        // Fetch related products
        const relatedResponse = await marketplaceApi.getProducts({
          category: response.data.category?.slug,
          per_page: 4,
        });
        setRelatedProducts(relatedResponse.data.filter(p => p.uid !== uid).slice(0, 3));
      } catch (error: any) {
        toast.error('পণ্য লোড করতে ব্যর্থ হয়েছে');
        router.push('/market');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [params.uid, router]);

  // Prevent right-click and drag on images
  useEffect(() => {
    const preventContextMenu = (e: MouseEvent) => {
      if (isImageProtected && (e.target as HTMLElement).tagName === 'IMG') {
        e.preventDefault();
      }
    };
    
    const preventDragStart = (e: DragEvent) => {
      if (isImageProtected && (e.target as HTMLElement).tagName === 'IMG') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('dragstart', preventDragStart);
    
    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('dragstart', preventDragStart);
    };
  }, [isImageProtected]);

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#C8102E]" />
      </div>
    );
  }

  const handleDownloadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    try {
      const response = await marketplaceApi.downloadProduct(product.uid, downloadForm);
      setDownloadSuccess(true);
      
      // Get download URLs - backend returns array of objects with url, filename, size
      const downloadFiles = response.data.download_urls || [];
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
      
      if (downloadFiles && downloadFiles.length > 0) {
        // Download files without opening new tabs
        for (const file of downloadFiles) {
          try {
            // Use the backend download-file endpoint to avoid CORS issues
            // Extract the storage path from the URL (remove leading /storage/)
            const storagePath = file.url.replace(/^\/storage\//, '');
            const downloadUrl = `${apiUrl}/marketplace/download-file?path=${encodeURIComponent(storagePath)}`;
            
            // Fetch the file as blob
            const fileResponse = await fetch(downloadUrl);
            if (!fileResponse.ok) throw new Error('Download failed');
            const blob = await fileResponse.blob();
            
            // Create download link
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = file.filename;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            
            // Small delay between downloads if multiple files
            if (downloadFiles.length > 1) {
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          } catch (error) {
            console.error('Download failed:', error);
          }
        }
      }
      
      toast.success('ডাউনলোড শুরু হয়েছে!');
      
      setTimeout(() => {
        setShowDownloadModal(false);
        setDownloadSuccess(false);
        setDownloadForm({ name: '', phone: '' });
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || 'ডাউনলোড ব্যর্থ হয়েছে');
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    try {
      await marketplaceApi.createCustomOrder(product.uid, {
        user_name: customForm.name,
        phone_number: customForm.phone,
        details: customForm.details,
      });
      
      setCustomSuccess(true);
      toast.success('আপনার অনুরোধ গৃহীত হয়েছে! শীঘ্রই যোগাযোগ করা হবে।');
      
      setTimeout(() => {
        setShowCustomModal(false);
        setCustomSuccess(false);
        setCustomForm({ name: '', phone: '', details: '' });
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || 'অনুরোধ পাঠাতে ব্যর্থ হয়েছে');
    }
  };

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    if (!token) {
      toast.error('রেটিং দিতে লগইন করুন');
      router.push(`/market/login?redirect=/market/${product.uid}`);
      return;
    }
    
    try {
      await marketplaceApi.rateProduct(product.uid, {
        user_name: ratingForm.name,
        rating: ratingForm.rating,
        comment: ratingForm.comment,
      });
      
      setRatingSuccess(true);
      toast.success('আপনার রেটিং সফলভাবে জমা হয়েছে! অনুমোদনের পর প্রদর্শিত হবে।');
      
      setTimeout(() => {
        setShowRatingModal(false);
        setRatingSuccess(false);
        setRatingForm({ name: '', rating: 5, comment: '' });
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || 'রেটিং জমা দিতে ব্যর্থ হয়েছে');
    }
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const categoryDisplay = product.category 
    ? (product.category.name_bn || product.category.name)
    : 'অন্যান্য';

  return (
    <div className="min-h-screen bg-gray-50">
      <SectionWrapper>
        {/* Back Button */}
        <Link
          href="/market"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#C8102E] mb-8 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ডিজাইন মার্কেটপ্লেস</span>
        </Link>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image with Protection */}
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative w-full aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-lg"
            >
              {/* Watermark Overlay */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white/10 text-6xl md:text-8xl font-bold -rotate-45 select-none">
                    ভোটমামু
                  </div>
                </div>
              </div>
              
              <Image
                src={getMarketplaceImageUrlWithFallback(product.images[selectedImage]?.thumbnail_url)}
                alt={product.title}
                fill
                className="object-cover select-none"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg z-20"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-900" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg z-20"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-900" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-sm z-20">
                  {toBengaliNumber(selectedImage + 1)} / {toBengaliNumber(product.images.length)}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right: Product Details */}
          <div className="space-y-6">
            {/* Title & Category */}
            <div>
              <span className="inline-flex items-center gap-2 bg-[#C8102E] text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                <DynamicIcon name={product.category?.icon} className="w-4 h-4" />
                {categoryDisplay}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {product.title}
              </h1>
              <p className="text-base text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Compact Stats Row */}
            <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
              {product.rating && (
                <div className="flex items-center gap-1.5">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-lg font-bold text-gray-900">
                    {toBengaliNumber(product.rating.toFixed(1))}
                  </span>
                </div>
              )}
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="flex items-center gap-1.5">
                <Download className="w-5 h-5 text-[#C8102E]" />
                <span className="text-lg font-bold text-gray-900">
                  {toBengaliNumber(product.downloads_count || 0)}
                </span>
              </div>
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="flex items-center gap-1.5">
                <Award className="w-5 h-5 text-[#C8102E]" />
                <span className="text-sm text-gray-600">
                  {toBengaliNumber(product.ratings?.length || 0)} রিভিউ
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {product.enable_download && (
                <button
                  onClick={() => setShowDownloadModal(true)}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#C8102E] text-white rounded-xl font-semibold hover:bg-[#A00D27] transition-all shadow-lg hover:shadow-xl"
                >
                  <Download className="w-5 h-5" />
                  <span>ডাউনলোড করুন</span>
                </button>
              )}
              
              {product.enable_custom_order && (
                <button
                  onClick={() => setShowCustomModal(true)}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-gray-900 border-2 border-gray-200 rounded-xl font-semibold hover:border-[#C8102E] hover:text-[#C8102E] transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>কাস্টম অর্ডার</span>
                </button>
              )}

              <button
                onClick={() => setShowRatingModal(true)}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl font-medium hover:bg-gray-100 transition-all"
              >
                <Star className="w-5 h-5" />
                <span>রেটিং দিন</span>
              </button>
            </div>

            {/* Creator Info */}
            <div className="mt-6">
              <CreatorCard 
                creator={product.creator} 
                toBengaliNumber={toBengaliNumber}
                showProductsGrid={true}
              />
            </div>
          </div>
        </div>

        {/* Ratings and Reviews Section */}
        {product.ratings && product.ratings.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">রেটিং ও রিভিউ</h2>
              <button
                onClick={() => setShowRatingModal(true)}
                className="text-[#C8102E] hover:text-[#A00D27] font-medium text-sm"
              >
                রিভিউ লিখুন
              </button>
            </div>

            <div className="space-y-4">
              {product.ratings.map((rating) => (
                <div key={rating.id} className="bg-white rounded-xl p-6 border border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900">{rating.user_name}</h4>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= rating.rating
                                ? 'text-yellow-500 fill-yellow-500'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(rating.created_at).toLocaleDateString('bn-BD')}
                    </span>
                  </div>
                  {rating.comment && (
                    <p className="text-gray-600 leading-relaxed">{rating.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Download Modal */}
        <AnimatePresence>
          {showDownloadModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowDownloadModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
              >
                {!downloadSuccess ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">ডাউনলোড করুন</h2>
                      <button
                        onClick={() => setShowDownloadModal(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <p className="text-gray-600 mb-6">
                      ডাউনলোড শুরু করতে আপনার তথ্য দিন
                    </p>

                    <form onSubmit={handleDownloadSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          নাম <span className="text-[#C8102E]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={downloadForm.name}
                          onChange={(e) => setDownloadForm({ ...downloadForm, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E] transition-all"
                          placeholder="আপনার পূর্ণ নাম"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ফোন নম্বর <span className="text-[#C8102E]">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={downloadForm.phone}
                          onChange={(e) => setDownloadForm({ ...downloadForm, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E] transition-all"
                          placeholder="ফোন নম্বর লিখুন"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#C8102E] text-white rounded-xl font-semibold hover:bg-[#A00D27] transition-all shadow-lg mt-6"
                      >
                        <Download className="w-5 h-5" />
                        <span>ডাউনলোড শুরু করুন</span>
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <Check className="w-10 h-10 text-green-600" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">ডাউনলোড সফল!</h3>
                    <p className="text-gray-600">
                      ফাইলটি ডাউনলোড হচ্ছে...
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Custom Order Modal */}
        <AnimatePresence>
          {showCustomModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowCustomModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
              >
                {!customSuccess ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">কাস্টম অর্ডার</h2>
                      <button
                        onClick={() => setShowCustomModal(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <p className="text-gray-600 mb-6">
                      আপনার প্রয়োজন অনুযায়ী ডিজাইন কাস্টমাইজ করতে তথ্য দিন
                    </p>

                    <form onSubmit={handleCustomSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          নাম <span className="text-[#C8102E]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={customForm.name}
                          onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E] transition-all"
                          placeholder="আপনার পূর্ণ নাম"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ফোন নম্বর <span className="text-[#C8102E]">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={customForm.phone}
                          onChange={(e) => setCustomForm({ ...customForm, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E] transition-all"
                          placeholder="ফোন নম্বর লিখুন"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          বিস্তারিত <span className="text-gray-500">(ঐচ্ছিক)</span>
                        </label>
                        <textarea
                          value={customForm.details}
                          onChange={(e) => setCustomForm({ ...customForm, details: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E] transition-all resize-none"
                          placeholder="আপনার কাস্টমাইজেশনের বিস্তারিত লিখুন..."
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#C8102E] text-white rounded-xl font-semibold hover:bg-[#A00D27] transition-all shadow-lg mt-6"
                      >
                        <Sparkles className="w-5 h-5" />
                        <span>অনুরোধ পাঠান</span>
                      </button>
                    </form>

                    <p className="text-xs text-gray-500 mt-4 text-center">
                      আমাদের টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে
                    </p>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <Check className="w-10 h-10 text-green-600" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">অনুরোধ সফল!</h3>
                    <p className="text-gray-600">
                      আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rating Modal */}
        <AnimatePresence>
          {showRatingModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => !ratingSuccess && setShowRatingModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
              >
                {!ratingSuccess ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">রেটিং দিন</h2>
                      <button
                        onClick={() => setShowRatingModal(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <form onSubmit={handleRatingSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          নাম <span className="text-[#C8102E]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={ratingForm.name}
                          onChange={(e) => setRatingForm({ ...ratingForm, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E] transition-all"
                          placeholder="আপনার নাম"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          রেটিং <span className="text-[#C8102E]">*</span>
                        </label>
                        <div className="flex gap-2 justify-center mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRatingForm({ ...ratingForm, rating: star })}
                              className="transition-transform hover:scale-110"
                            >
                              <Star
                                className={`w-10 h-10 ${
                                  star <= ratingForm.rating
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                        <p className="text-center text-sm text-gray-600">
                          {toBengaliNumber(ratingForm.rating)} স্টার
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          মন্তব্য <span className="text-gray-500">(ঐচ্ছিক)</span>
                        </label>
                        <textarea
                          value={ratingForm.comment}
                          onChange={(e) => setRatingForm({ ...ratingForm, comment: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E] transition-all resize-none"
                          placeholder="আপনার অভিজ্ঞতা শেয়ার করুন..."
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#C8102E] text-white rounded-xl font-semibold hover:bg-[#A00D27] transition-all shadow-lg mt-6"
                      >
                        <Star className="w-5 h-5" />
                        <span>রেটিং জমা দিন</span>
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <Check className="w-10 h-10 text-green-600" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">রেটিং সফল!</h3>
                    <p className="text-gray-600">
                      আপনার রেটিং সফলভাবে জমা হয়েছে
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Related Designs Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">আরও ডিজাইন দেখুন</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}

        <JoinCreatorBanner />
      </SectionWrapper>
    </div>
  );
}
