'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Award, Download, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionWrapper from '@/components/SectionWrapper';
import { mockCreators, getProductsByCreator, toBengaliNumber } from '@/lib/mockProducts';
import { Creator, Product } from '@/lib/api';

const ITEMS_PER_PAGE = 9;

export default function AllCreatorsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Calculate pagination
  const totalPages = Math.ceil(mockCreators.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCreators = mockCreators.slice(startIndex, endIndex);

  // Get top 4 designs for each creator for collage
  const getTopDesigns = (creatorId: number): Product[] => {
    const products = getProductsByCreator(creatorId);
    return products
      .sort((a, b) => (b.downloads_count || 0) - (a.downloads_count || 0))
      .slice(0, 4);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SectionWrapper>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            সকল ক্রিয়েটর
          </h1>
          <p className="text-lg text-gray-600">
            আমাদের প্রতিভাবান ডিজাইনার এবং তাদের সেরা কাজগুলি দেখুন
          </p>
        </div>

        {/* Creators Grid - 2 per row on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {currentCreators.map((creator, index) => {
            const topDesigns = getTopDesigns(creator.id);
            
            return (
              <motion.div
                key={creator.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6 md:p-8">
                  {/* Grid Layout: Creator on left, Collage on right */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Creator Info - Left Side */}
                    <div className="lg:col-span-2 space-y-4">
                      {/* Avatar & Basic Info */}
                      <Link 
                        href={`/market/creators/${creator.username}`}
                        className="flex items-start gap-4 hover:opacity-80 transition-opacity"
                      >
                        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-linear-to-br from-gray-200 to-gray-300 shrink-0 ring-2 ring-[#C8102E]/20">
                          {creator.avatar ? (
                            <Image
                              src={creator.avatar}
                              alt={creator.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-600">
                              {creator.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 hover:text-[#C8102E] transition-colors">
                              {creator.name}
                            </h2>
                            {creator.rating && (
                              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full">
                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                <span className="text-sm font-semibold text-gray-900">
                                  {toBengaliNumber(creator.rating.toFixed(1))}
                                </span>
                              </div>
                            )}
                          </div>
                          {/* Design Count */}
                          {creator.total_designs && (
                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                              <Award className="w-4 h-4 text-[#C8102E]" />
                              <span>{toBengaliNumber(creator.total_designs)} ডিজাইন</span>
                            </div>
                          )}
                          {creator.bio && (
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                              {creator.bio}
                            </p>
                          )}
                          {creator.location && (
                            <div className="flex items-center gap-1.5 text-sm text-gray-500">
                              <MapPin className="w-4 h-4" />
                              <span>{creator.location}</span>
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Specialties */}
                      {creator.specialties && creator.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {creator.specialties.map((specialty, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-[#C8102E]/10 text-[#C8102E] rounded-lg text-xs font-medium border border-[#C8102E]/20"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Design Collage - Right Side (Compact) */}
                    <div className="lg:col-span-1 flex items-start">
                      {topDesigns.length > 0 ? (
                        <Link 
                          href={`/market/creators/${creator.username}`}
                          className="block w-full max-w-[220px] mx-auto"
                        >
                          <div className="grid grid-cols-2 gap-2 aspect-square rounded-xl overflow-hidden group cursor-pointer hover:ring-2 ring-[#C8102E] transition-all">
                            {topDesigns.map((design) => (
                              <div
                                key={design.id}
                                className="relative overflow-hidden bg-gray-100 aspect-square"
                              >
                                <Image
                                  src={design.images[0] || '/placeholder-product.jpg'}
                                  alt={design.title}
                                  fill
                                  sizes="100px"
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                            ))}
                            {/* Fill remaining cells if less than 4 designs */}
                            {Array.from({ length: Math.max(0, 4 - topDesigns.length) }).map((_, idx) => (
                              <div
                                key={`empty-${idx}`}
                                className="relative overflow-hidden bg-gray-200 aspect-square"
                              />
                            ))}
                          </div>
                        </Link>
                      ) : (
                        <div className="w-full max-w-[220px] mx-auto aspect-square rounded-xl bg-gray-100 flex items-center justify-center">
                          <p className="text-sm text-gray-500 text-center px-4">
                            কোনো ডিজাইন নেই
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`min-w-10 h-10 rounded-lg font-semibold transition-colors ${
                    currentPage === page
                      ? 'bg-[#C8102E] text-white'
                      : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {toBengaliNumber(page)}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </SectionWrapper>
    </div>
  );
}