'use client';

import { motion } from 'framer-motion';
import { Star, Download } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/api';
import { toBengaliNumber } from '@/lib/mockProducts';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images[0] || '/placeholder-product.jpg';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      {/* Product Image - Clickable to product details */}
      <Link href={`/market/${product.uid}`}>
        <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gray-100 mb-3 cursor-pointer">
          <Image
            src={mainImage}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Downloads Badge */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <Download className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-xs font-semibold text-gray-900">
              {toBengaliNumber(product.downloads_count || 0)}
            </span>
          </div>

          {/* Rating Badge - Bottom Left */}
          {product.rating && (
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-semibold text-gray-900">
                {toBengaliNumber(product.rating.toFixed(1))}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="space-y-2">
        {/* Title - Clickable to product details */}
        <Link href={`/market/${product.uid}`}>
          <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-gray-600 transition-colors leading-snug cursor-pointer">
            {product.title}
          </h3>
        </Link>

        {/* Creator Info - Clickable to creator page */}
        <Link
          href={`/market/creators/${product.creator.username}`}
          className="flex items-center gap-2 hover:opacity-70 transition-opacity w-fit"
        >
            <div className="relative w-6 h-6 rounded-full bg-linear-to-br from-gray-200 to-gray-300 overflow-hidden shrink-0">
              {product.creator.avatar ? (
                <Image
                  src={product.creator.avatar}
                  alt={product.creator.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-600">
                  {product.creator.name.charAt(0)}
                </div>
              )}
            </div>
            <span className="text-sm text-gray-600 truncate">{product.creator.name}</span>
        </Link>
      </div>
    </motion.div>
  );
}
