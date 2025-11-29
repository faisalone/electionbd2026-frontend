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
import JoinCreatorBanner from '@/components/JoinCreatorBanner';
import MarketBackground from '@/components/market/MarketBackground';
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
    <div className="min-h-screen relative overflow-hidden">
      <MarketBackground />
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

          {loading ? (
            <div className="text-center py-20 bg-white rounded-2xl">
              <Loader2 className="w-12 h-12 animate-spin text-[#C8102E]" />
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {products.length === 0 && !loading && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">কোন ডিজাইন পাওয়া যায়নি</p>
                </div>
              )}

              <JoinCreatorBanner />
            </>
          )}
        </div>
      </SectionWrapper>
    </div>
  );
}
