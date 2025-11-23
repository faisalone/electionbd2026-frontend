'use client';

import { motion } from 'framer-motion';
import { Star, Download } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/marketplace-api';
import { toBengaliNumber } from '@/lib/mockProducts';
import { getMarketplaceImageUrl } from '@/lib/marketplace-image-utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const mainImage = getMarketplaceImageUrl(product.images[0]?.thumbnail_url) || '/placeholder-product.jpg';

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
          {product.rating > 0 && (
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
          <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-gray-600 transition-colors leading-snug cursor-pointer text-sm sm:text-base">
            {product.title}
          </h3>
        </Link>

        {/* Creator Info - Clickable to creator page */}
        {product.creator && (
          <Link
            href={`/market/creators/${product.creator.username}`}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity w-fit"
          >
            <div className="relative w-6 h-6 rounded-full bg-linear-to-br from-gray-200 to-gray-300 overflow-hidden shrink-0">
              {product.creator.avatar && getMarketplaceImageUrl(product.creator.avatar) ? (
                <Image
                  src={getMarketplaceImageUrl(product.creator.avatar)!}
                  alt={product.creator.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling;
                    if (fallback) (fallback as HTMLElement).style.display = 'flex';
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-[10px] font-bold">
                  {product.creator.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <span className="text-xs text-gray-600 font-medium truncate max-w-[150px]">
              {product.creator.name}
            </span>
          </Link>
        )}
      </div>
    </motion.div>
  );
}
