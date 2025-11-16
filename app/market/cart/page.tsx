'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
} from 'lucide-react';
import SectionWrapper from '@/components/SectionWrapper';
import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();

  const formatPrice = (price: number) => {
    return price.toLocaleString('bn-BD');
  };

  const handleCheckout = () => {
    if (cart.length > 0) {
      router.push('/market/checkout');
    }
  };

  return (
    <div className="min-h-screen">
      <SectionWrapper>
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/market"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>মার্কেটপ্লেস</span>
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            কার্ট
          </h1>
          <p className="text-gray-600">
            {getTotalItems()} টি পণ্য
          </p>
        </div>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence mode="popLayout">
                {cart.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="flex gap-6 pb-6 border-b border-gray-100 last:border-0"
                  >
                    {/* Product Image */}
                    <Link
                      href={`/market/${item.product.id}`}
                      className="relative w-28 h-28 bg-gray-100 rounded-xl overflow-hidden shrink-0 group"
                    >
                      <Image
                        src={item.product.images[0] || '/placeholder-product.jpg'}
                        alt={item.product.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link
                          href={`/market/${item.product.id}`}
                          className="block"
                        >
                          <h3 className="font-semibold text-gray-900 mb-1 hover:text-gray-600 transition-colors">
                            {item.product.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-500 mb-3">{item.product.owner.name}</p>
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between">
                        {/* Quantity Selector */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-sm font-semibold text-gray-900 w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price & Remove */}
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-gray-900">
                            ৳{formatPrice(item.product.price * item.quantity)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <div className="space-y-3 pb-4 border-b border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">সাবটোটাল</span>
                    <span className="font-semibold text-gray-900">৳{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">ডেলিভারি</span>
                    <span className="font-semibold text-green-600">ফ্রি</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-lg font-bold text-gray-900">মোট</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ৳{formatPrice(getTotalPrice())}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-gray-900 text-white py-3.5 rounded-full font-semibold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl mt-4"
                >
                  চেকআউট
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Empty Cart
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">কার্ট খালি</h2>
            <p className="text-gray-600 mb-8">
              এখনও কোনো পণ্য যোগ করা হয়নি
            </p>

            <Link
              href="/market"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              মার্কেটপ্লেস
            </Link>
          </div>
        )}
      </SectionWrapper>
    </div>
  );
}
