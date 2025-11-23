'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Star, Award, BadgeCheck } from 'lucide-react';
import { Creator } from '@/lib/marketplace-api';
import { getMarketplaceImageUrl } from '@/lib/marketplace-image-utils';

interface CreatorCardProps {
  creator: Creator;
  toBengaliNumber: (num: number) => string;
  clickable?: boolean;
  variant?: 'full' | 'with-products';
  showProductsGrid?: boolean; // New prop to control product grid display
}

export default function CreatorCard({ 
  creator, 
  toBengaliNumber, 
  clickable = true, 
  variant = 'full',
  showProductsGrid = false
}: CreatorCardProps) {
  
  // Full Profile Variant
  if (variant === 'full') {
    const content = (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-sm p-8"
      >
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-32 h-32 shrink-0">
            <div className="relative w-full h-full rounded-full overflow-hidden bg-linear-to-br from-gray-100 to-gray-200 border-4 border-white shadow-lg">
              {creator.avatar && getMarketplaceImageUrl(creator.avatar) ? (
                <Image
                  src={getMarketplaceImageUrl(creator.avatar)!}
                  alt={creator.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling;
                    if (fallback) (fallback as HTMLElement).style.display = 'flex';
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-gray-400">
                  {creator.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            {creator.is_verified && (
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                <BadgeCheck className="w-5 h-5 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{creator.name}</h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-600 mb-4">
              {creator.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#C8102E]" />
                  <span>{creator.location}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium text-gray-900">{toBengaliNumber(parseFloat(creator.rating.toFixed(1)))}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#C8102E]" />
                <span>{toBengaliNumber(creator.total_designs)} ডিজাইন</span>
              </div>
            </div>

            {creator.bio && (
              <p className="text-gray-600 max-w-2xl leading-relaxed">{creator.bio}</p>
            )}
          </div>

          {/* Product Grid (optional) */}
          {showProductsGrid && creator.recent_products && creator.recent_products.length > 0 && (
            <div className="shrink-0">
              <div className="grid grid-cols-2 gap-2 w-32">
                {creator.recent_products.slice(0, 4).map((product, i) => {
                  const imageUrl = product.images?.[0]?.thumbnail_url ? getMarketplaceImageUrl(product.images[0].thumbnail_url) : null;
                  return (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={product.title}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                    </div>
                  );
                })}
                {/* Placeholders for empty slots */}
                {Array.from({ length: Math.max(0, 4 - (creator.recent_products.length || 0)) }).map((_, i) => (
                  <div key={`placeholder-${i}`} className="aspect-square rounded-lg bg-gray-100" />
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );

    if (clickable) {
      return (
        <Link href={`/market/creators/${creator.username}`} className="block hover:opacity-90 transition-opacity">
          {content}
        </Link>
      );
    }

    return content;
  }

  // With Products Variant
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-sm p-8 hover:shadow-lg transition-all"
    >
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 w-full">
          <div className="flex items-start gap-4 mb-4">
            <div className="relative w-20 h-20 shrink-0">
              <div className="relative w-full h-full rounded-full overflow-hidden bg-linear-to-br from-gray-100 to-gray-200 border-4 border-white shadow-lg">
                {creator.avatar && getMarketplaceImageUrl(creator.avatar) ? (
                  <Image
                    src={getMarketplaceImageUrl(creator.avatar)!}
                    alt={creator.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling;
                      if (fallback) (fallback as HTMLElement).style.display = 'flex';
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-500">
                    {creator.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              {creator.is_verified && (
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                  <BadgeCheck className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-gray-900">{creator.name}</h3>
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-100">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-bold text-yellow-700">{toBengaliNumber(parseFloat(creator.rating.toFixed(1)))}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Award className="w-4 h-4" />
                <span>{toBengaliNumber(creator.total_designs)} ডিজাইন</span>
              </div>
            </div>
          </div>

          {creator.bio && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{creator.bio}</p>
          )}

          {creator.location && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              <span>{creator.location}</span>
            </div>
          )}

          {creator.specialties && creator.specialties.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {creator.specialties.slice(0, 3).map((specialty, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-red-50 text-[#C8102E] rounded-lg text-xs font-medium"
                >
                  {specialty}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="shrink-0">
          <div className="grid grid-cols-2 gap-2 w-32">
            {creator.recent_products?.slice(0, 4).map((product, i) => {
              const imageUrl = product.images?.[0]?.thumbnail_url ? getMarketplaceImageUrl(product.images[0].thumbnail_url) : null;
              return (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.title}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
              );
            })}
            {Array.from({ length: Math.max(0, 4 - (creator.recent_products?.length || 0)) }).map((_, i) => (
              <div key={`placeholder-${i}`} className="aspect-square rounded-lg bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (clickable) {
    return (
      <Link href={`/market/creators/${creator.username}`}>
        {content}
      </Link>
    );
  }

  return content;
}
