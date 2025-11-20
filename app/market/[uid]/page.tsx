'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Download, Star, 
  X, Check, Sparkles, ChevronLeft, ChevronRight,
  Award
} from 'lucide-react';
import { toast } from 'sonner';
import SectionWrapper from '@/components/SectionWrapper';
import CreatorInfoCard from '@/components/CreatorInfoCard';
import ProductCard from '@/components/ProductCard';
import { getProductByUid, toBengaliNumber, categoryLabels, mockProducts } from '@/lib/mockProducts';
import { Product, ProductRating } from '@/lib/api';
import { theme } from '@/config/theme';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  const [product, setProduct] = useState<Product | null>(null);
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
    const uid = params.uid as string;
    const foundProduct = getProductByUid(uid);
    
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      router.push('/market');
    }
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

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C8102E]"></div>
      </div>
    );
  }

  const handleDownloadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'ডাউনলোড শুরু হচ্ছে...',
        success: () => {
          setDownloadSuccess(true);
          setTimeout(() => {
            setShowDownloadModal(false);
            setDownloadSuccess(false);
            setDownloadForm({ name: '', phone: '' });
          }, 2000);
          return 'ডাউনলোড সফল!';
        },
        error: 'ডাউনলোড ব্যর্থ হয়েছে',
      }
    );
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'অনুরোধ পাঠানো হচ্ছে...',
        success: () => {
          setCustomSuccess(true);
          setTimeout(() => {
            setShowCustomModal(false);
            setCustomSuccess(false);
            setCustomForm({ name: '', phone: '', details: '' });
          }, 2000);
          return 'আপনার অনুরোধ গৃহীত হয়েছে! শীঘ্রই যোগাযোগ করা হবে।';
        },
        error: 'অনুরোধ পাঠাতে ব্যর্থ হয়েছে',
      }
    );
  };

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'রেটিং জমা দেওয়া হচ্ছে...',
        success: () => {
          setRatingSuccess(true);
          setTimeout(() => {
            setShowRatingModal(false);
            setRatingSuccess(false);
            setRatingForm({ name: '', rating: 5, comment: '' });
          }, 2000);
          return 'আপনার রেটিং সফলভাবে জমা হয়েছে!';
        },
        error: 'রেটিং জমা দিতে ব্যর্থ হয়েছে',
      }
    );
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const categoryLabel = categoryLabels[product.category] || product.category;

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
                src={product.images[selectedImage] || '/placeholder-product.jpg'}
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

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 transition-all ${
                      selectedImage === index
                        ? 'ring-2 ring-[#C8102E] scale-105'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} - ${index + 1}`}
                      fill
                      className="object-cover"
                      draggable={false}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="space-y-6">
            {/* Title & Category */}
            <div>
              <span className="inline-block bg-[#C8102E] text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                {categoryLabel}
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
              <button
                onClick={() => setShowDownloadModal(true)}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#C8102E] text-white rounded-xl font-semibold hover:bg-[#A00D27] transition-all shadow-lg hover:shadow-xl"
              >
                <Download className="w-5 h-5" />
                <span>ডাউনলোড করুন</span>
              </button>
              
              {product.customization_available && (
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

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  ট্যাগ
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Creator Info - Compact */}
            <CreatorInfoCard 
              creator={product.creator} 
              variant="sidebar"
            />
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
              onClick={() => !downloadSuccess && setShowDownloadModal(false)}
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
                          placeholder="০১XXXXXXXXX"
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
              onClick={() => !customSuccess && setShowCustomModal(false)}
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
                          placeholder="০১XXXXXXXXX"
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
        {product && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">সম্পর্কিত ডিজাইন</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockProducts
                .filter(p => 
                  p.id !== product.id && 
                  p.category === product.category
                )
                .slice(0, 4)
                .map((relatedProduct, index) => (
                  <motion.div
                    key={relatedProduct.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ProductCard product={relatedProduct} />
                  </motion.div>
                ))}
            </div>
          </div>
        )}
      </SectionWrapper>
    </div>
  );
}
