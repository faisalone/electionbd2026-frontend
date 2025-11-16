'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/api';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images[0] || '/placeholder-product.jpg';
  
  // Format price in Bengali
  const formatPrice = (price: number) => {
    return price.toLocaleString('bn-BD');
  };

  return (
    <Link href={`/market/${product.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="group cursor-pointer"
      >
        {/* Product Image */}
        <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gray-100 mb-3">
          <Image
            src={mainImage}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Rating Badge - Minimal */}
          {product.rating && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-semibold text-gray-900">{product.rating}</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-gray-600 transition-colors">
            {product.title}
          </h3>

          {/* Owner & Price Row */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{product.owner.name}</span>
            <span className="font-bold text-gray-900">৳{formatPrice(product.price)}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
