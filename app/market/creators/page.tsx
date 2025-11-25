'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import SectionWrapper from '@/components/SectionWrapper';
import CreatorCard from '@/components/CreatorCard';
import JoinCreatorBanner from '@/components/JoinCreatorBanner';
import { marketplaceApi, Creator } from '@/lib/marketplace-api';
import { toBengaliNumber } from '@/lib/mockProducts';

export default function CreatorsListPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCreators = async () => {
      setLoading(true);
      try {
        const response = await marketplaceApi.getCreators({
          page: currentPage,
          per_page: 12,
        });
        setCreators(response.data || []);
        setTotalPages(response.meta?.last_page || 1);
      } catch (error: any) {
        console.error('Creators fetch error:', error);
        toast.error('ক্রিয়েটর লোড করতে ব্যর্থ হয়েছে');
        setCreators([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCreators();
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SectionWrapper>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">পেশাদার ডিজাইনার</h1>
          <p className="text-gray-600 text-lg">দক্ষ ডিজাইনারদের সাথে কাজ করুন</p>
        </div>

        {/* Creators Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-[#C8102E]" />
          </div>
        ) : creators.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl">
            <p className="text-gray-500 text-lg">কোন ক্রিয়েটর পাওয়া যায়নি</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
              {creators.map((creator) => (
                <CreatorCard
                  key={creator.id}
                  creator={creator}
                  toBengaliNumber={toBengaliNumber}
                  variant="with-products"
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-[#C8102E] text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {toBengaliNumber(page)}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        <JoinCreatorBanner />
      </SectionWrapper>
    </div>
  );
}
