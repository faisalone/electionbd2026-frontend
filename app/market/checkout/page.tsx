'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Check,
} from 'lucide-react';
import SectionWrapper from '@/components/SectionWrapper';
import { useCart } from '@/lib/cart-context';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getTotalPrice, getTotalItems, clearCart } = useCart();
  
  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
  });
  
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPrice = (price: number) => {
    return price.toLocaleString('bn-BD');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Order placed:', {
        customer: orderForm,
        items: cart,
        total: getTotalPrice(),
      });

      setOrderSuccess(true);
      clearCart();
      
      // Redirect to marketplace after 3 seconds
      setTimeout(() => {
        router.push('/market');
      }, 3000);
    }, 1500);
  };

  if (cart.length === 0 && !orderSuccess) {
    router.push('/market/cart');
    return null;
  }

  return (
    <div className="min-h-screen">
      <SectionWrapper>
        {!orderSuccess ? (
          <>
            {/* Header */}
            <div className="mb-12">
              <Link
                href="/market/cart"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>কার্ট</span>
              </Link>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                চেকআউট
              </h1>
              <p className="text-gray-600">
                অর্ডার সম্পন্ন করুন
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Checkout Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Customer Information */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">ক্রেতার তথ্য</h2>

                    <div>
                      <input
                        type="text"
                        required
                        value={orderForm.name}
                        onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                        className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all shadow-sm"
                        placeholder="আপনার নাম"
                      />
                    </div>

                    <div>
                      <input
                        type="tel"
                        required
                        value={orderForm.phone}
                        onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all shadow-sm"
                        placeholder="মোবাইল নম্বর"
                      />
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">ডেলিভারি ঠিকানা</h2>

                    <div>
                      <textarea
                        required
                        value={orderForm.address}
                        onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all resize-none shadow-sm"
                        placeholder="সম্পূর্ণ ঠিকানা"
                      />
                    </div>

                    <div>
                      <textarea
                        value={orderForm.notes}
                        onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                        rows={2}
                        className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all resize-none shadow-sm"
                        placeholder="অতিরিক্ত নির্দেশনা (ঐচ্ছিক)"
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">পেমেন্ট পদ্ধতি</h2>

                    <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm">
                      <input
                        type="radio"
                        name="payment"
                        value="cash-on-delivery"
                        checked
                        readOnly
                        className="w-4 h-4 text-gray-900"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">ক্যাশ অন ডেলিভারি</p>
                        <p className="text-sm text-gray-600">পণ্য পাওয়ার পর পেমেন্ট করুন</p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gray-900 text-white py-3.5 rounded-full font-semibold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'প্রক্রিয়া করা হচ্ছে...' : 'অর্ডার নিশ্চিত করুন'}
                  </button>
                </form>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <h2 className="text-lg font-bold text-gray-900">অর্ডার সামারি</h2>

                  {/* Order Items */}
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex gap-3">
                        <div className="relative w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                          <Image
                            src={item.product.images[0] || '/placeholder-product.jpg'}
                            alt={item.product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                            {item.product.title}
                          </p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">৳{formatPrice(item.product.price)} × {item.quantity}</span>
                            <span className="font-bold text-gray-900">
                              ৳{formatPrice(item.product.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Summary */}
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">সাবটোটাল ({getTotalItems()} টি)</span>
                      <span className="font-semibold text-gray-900">৳{formatPrice(getTotalPrice())}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">ডেলিভারি</span>
                      <span className="font-semibold text-green-600">ফ্রি</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-lg font-bold text-gray-900">মোট</span>
                    <span className="text-2xl font-bold text-gray-900">
                      ৳{formatPrice(getTotalPrice())}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Success Message
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center py-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Check className="w-10 h-10 text-green-600" />
            </motion.div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              অর্ডার সফল! 🎉
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। শীঘ্রই আমরা আপনার সাথে যোগাযোগ করব।
            </p>

            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <p className="text-sm text-gray-600 mb-2">অর্ডার মোট</p>
              <p className="text-3xl font-bold text-gray-900">
                ৳{formatPrice(getTotalPrice())}
              </p>
            </div>

            <Link
              href="/market"
              className="inline-block bg-gray-900 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-gray-800 transition-all shadow-lg"
            >
              মার্কেটপ্লেস
            </Link>
          </motion.div>
        )}
      </SectionWrapper>
    </div>
  );
}
