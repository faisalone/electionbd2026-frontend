'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import SectionWrapper from '@/components/SectionWrapper';
import ProductCard from '@/components/ProductCard';
import CreatorCard from '@/components/CreatorCard';
import { marketplaceApi, Creator, Product } from '@/lib/marketplace-api';
import { toBengaliNumber } from '@/lib/mockProducts';

export default function CreatorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCreator = async () => {
      setLoading(true);
      try {
        const username = params.username as string;
        
        // Fetch creator profile
        const creatorResponse = await marketplaceApi.getCreator(username);
        
        if (!creatorResponse?.data) {
          toast.error('ক্রিয়েটর খুঁজে পাওয়া যায়নি');
          router.push('/market/creators');
          return;
        }
        
        setCreator(creatorResponse.data);
        
        // Fetch creator products
        try {
          const productsResponse = await marketplaceApi.getCreatorProducts(username, {
            page: currentPage,
            per_page: 12,
          });
          setProducts(productsResponse.data || []);
          setTotalPages(productsResponse.meta?.last_page || 1);
        } catch (productError) {
          // If products fail, just show empty
          setProducts([]);
          setTotalPages(1);
        }
      } catch (error: any) {
        console.error('Creator fetch error:', error);
        toast.error(error.message || 'ক্রিয়েটর তথ্য লোড করতে ব্যর্থ হয়েছে');
        router.push('/market/creators');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCreator();
  }, [params.username, currentPage, router]);

  if (loading || !creator) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#C8102E]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SectionWrapper>
        {/* Back Button */}
        <Link
          href="/market/creators"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#C8102E] mb-8 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>সকল ক্রিয়েটর</span>
        </Link>

        {/* Creator Header */}
        <div className="mb-12">
          <CreatorCard creator={creator} toBengaliNumber={toBengaliNumber} clickable={false} showProductsGrid={true} />
        </div>

        {/* Products Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {creator.name} এর ডিজাইন ({toBengaliNumber(creator.total_designs)})
          </h2>

          {products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">এখনও কোন ডিজাইন আপলোড করা হয়নি</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
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
        </div>
      </SectionWrapper>
    </div>
  );
}
