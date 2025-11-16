'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ShoppingCart,
  ShoppingBag,
  User,
  MapPin,
  Phone,
  Star,
  Plus,
  Minus,
  X,
  Check,
} from 'lucide-react';
import SectionWrapper from '@/components/SectionWrapper';
import { getProductById, categoryLabels } from '@/lib/mockProducts';
import { useCart } from '@/lib/cart-context';
import { Product } from '@/lib/api';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, getTotalItems } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    const id = parseInt(params.id as string);
    const foundProduct = getProductById(id);
    
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      router.push('/market');
    }
  }, [params.id, router]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C8102E]"></div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('bn-BD');
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} টি পণ্য কার্টে যোগ করা হয়েছে!`, {
      description: product.title,
      duration: 3000,
    });
  };

  const handleOrderNow = () => {
    setShowOrderModal(true);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the order to your backend
    console.log('Order submitted:', {
      product: product.id,
      quantity,
      customer: orderForm,
    });

    setOrderSuccess(true);
    
    // Reset after 2 seconds
    setTimeout(() => {
      setShowOrderModal(false);
      setOrderSuccess(false);
      setOrderForm({ name: '', phone: '', address: '' });
    }, 2000);
  };

  const categoryLabel = categoryLabels[product.category] || product.category;

  return (
    <div className="min-h-screen">
      <SectionWrapper>
        {/* Back Button */}
        <Link
          href="/market"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>মার্কেটপ্লেস</span>
        </Link>

        {/* Header Section */}
              {/* Header Section */}
      <div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            {/* Left Column: Title and Owner */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {product.owner.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs text-gray-500">বিক্রেতা</p>
                  <p className="font-medium text-gray-900">{product.owner.name}</p>
                </div>
              </div>
            </div>

            {/* Right Column: Price and Actions */}
            <div className="flex flex-col items-end gap-4">
              {/* Price */}
              <div className="text-3xl md:text-4xl font-bold text-gray-900">
                ৳{formatPrice(product.price)}
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-3 border border-gray-200 rounded-full p-1.5">
                {/* Quantity Selector */}
                <div className="flex items-center gap-2 px-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-bold text-gray-900 min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="text-sm">কার্ট</span>
                </button>

                {/* Order Now Button */}
                <button
                  onClick={handleOrderNow}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="text-sm">অর্ডার</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Image Left, Details Right */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Image Slider */}
          <div>
            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative w-full h-[400px] md:h-[500px] bg-gray-100 rounded-2xl overflow-hidden mb-4"
            >
              <Image
                src={product.images[selectedImage] || '/placeholder-product.jpg'}
                alt={product.title}
                fill
                className="object-cover"
              />
              
              {/* Rating Badge */}
              {product.rating && (
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full flex items-center gap-1.5 shadow-sm">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-bold text-gray-900">{product.rating}</span>
                </div>
              )}
            </motion.div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden transition-all ${
                      selectedImage === index
                        ? 'ring-2 ring-gray-900 scale-105'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} - ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">বিবরণ</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">ট্যাগ</h2>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Category */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">ক্যাটাগরি</h2>
              <span className="inline-block bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium">
                {categoryLabel}
              </span>
            </div>

            {/* Seller Contact */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">যোগাযোগ</h3>
              <div className="space-y-3">
                {product.owner.phone && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span>{product.owner.phone}</span>
                  </div>
                )}
                {product.owner.location && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span>{product.owner.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Order Modal */}
      </SectionWrapper>

      <AnimatePresence>
        {showOrderModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !orderSuccess && setShowOrderModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
            >
              {!orderSuccess ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">অর্ডার নিশ্চিত করুন</h2>
                    <button
                      onClick={() => setShowOrderModal(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmitOrder} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        আপনার নাম *
                      </label>
                      <input
                        type="text"
                        required
                        value={orderForm.name}
                        onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E] transition-all"
                        placeholder="আপনার পূর্ণ নাম লিখুন"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        মোবাইল নম্বর *
                      </label>
                      <input
                        type="tel"
                        required
                        value={orderForm.phone}
                        onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E] transition-all"
                        placeholder="০১XXXXXXXXX"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        সম্পূর্ণ ঠিকানা *
                      </label>
                      <textarea
                        required
                        value={orderForm.address}
                        onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E] transition-all resize-none"
                        placeholder="আপনার সম্পূর্ণ ঠিকানা লিখুন"
                      />
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">পণ্য:</span>
                        <span className="font-semibold">{product.title}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">পরিমাণ:</span>
                        <span className="font-semibold">{quantity} টি</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                        <span className="text-gray-900 font-bold">মোট:</span>
                        <span className="text-xl font-bold text-[#C8102E]">
                          ৳{formatPrice(product.price * quantity)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#C8102E] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-[#A00D24] transition-all"
                    >
                      অর্ডার নিশ্চিত করুন
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">অর্ডার সফল!</h3>
                  <p className="text-gray-600">
                    আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। শীঘ্রই আমরা আপনার সাথে যোগাযোগ করব।
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
