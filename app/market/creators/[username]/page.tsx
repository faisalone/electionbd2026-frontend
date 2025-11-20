'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Phone, Star, Award, Calendar, ArrowLeft, Download } from 'lucide-react';
import SectionWrapper from '@/components/SectionWrapper';
import CreatorInfoCard from '@/components/CreatorInfoCard';
import { getCreatorByUsername, getProductsByCreator, toBengaliNumber } from '@/lib/mockProducts';
import { Creator, Product } from '@/lib/api';
import { theme } from '@/config/theme';

export default function CreatorPage() {
  const params = useParams();
  const router = useRouter();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const username = params.username as string;
    const foundCreator = getCreatorByUsername(username);
    
    if (foundCreator) {
      setCreator(foundCreator);
      setProducts(getProductsByCreator(foundCreator.id));
    } else {
      router.push('/market');
    }
  }, [params.username, router]);

  if (!creator) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C8102E]"></div>
      </div>
    );
  }

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

        {/* Simple Header - Top */}
        <CreatorInfoCard 
          creator={creator} 
          variant="header"
          className="mb-8"
        />

        {/* Creator's Products Grid */}
        <div className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>ক্রিয়েটরের ডিজাইন</span>
            <span className="text-[#C8102E]">({toBengaliNumber(products.length)})</span>
          </h2>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link href={`/market/${product.uid}`}>
                    <div className="group cursor-pointer">
                      {/* Product Image */}
                      <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gray-100 mb-3">
                        <Image
                          src={product.images[0] || '/placeholder-product.jpg'}
                          alt={product.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        
                        {/* Stats Overlay */}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                          <Download className="w-3.5 h-3.5 text-[#C8102E]" />
                          <span className="text-xs font-semibold text-gray-900">
                            {toBengaliNumber(product.downloads_count || 0)}
                          </span>
                        </div>

                        {/* Rating Badge */}
                        {product.rating && (
                          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs font-semibold text-gray-900">
                              {toBengaliNumber(product.rating.toFixed(1))}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-[#C8102E] transition-colors leading-snug">
                          {product.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              কোনো ডিজাইন পাওয়া যায়নি
            </div>
          )}
        </div>
      </SectionWrapper>
    </div>
  );
}
