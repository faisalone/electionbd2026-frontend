'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ChevronDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import SectionWrapper from '@/components/SectionWrapper';
import ProductCard from '@/components/ProductCard';
import DynamicIcon from '@/components/DynamicIcon';
import { marketplaceApi, Product, Category } from '@/lib/marketplace-api';
import { toBengaliNumber } from '@/lib/mockProducts';

const sortOptions = [
  { id: 'latest', label: 'নতুন' },
  { id: 'popular', label: 'জনপ্রিয়' },
  { id: 'top_rated', label: 'রেটিং' },
];

export default function MarketPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 12;

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await marketplaceApi.getCategories({ with_count: true });
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        toast.error('ক্যাটেগরি লোড করতে ব্যর্থ হয়েছে');
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await marketplaceApi.getProducts({
          category: selectedCategory === 'all' ? undefined : selectedCategory,
          search: searchQuery.trim() || undefined,
          sort: sortBy as any,
          page: currentPage,
          per_page: itemsPerPage,
        });

        setProducts(response.data);
        setTotalPages(response.meta.last_page);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast.error('পণ্য লোড করতে ব্যর্থ হয়েছে');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery, sortBy, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen">
      <SectionWrapper>
        {/* Header with Background Image */}
        <div className="mb-8 sm:mb-10 md:mb-12 relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12 overflow-hidden rounded-3xl">
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=300&fit=crop&q=80"
              alt="Marketplace Background"
              fill
              className="object-cover object-center"
              priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255,255,255)_0%,rgb(255,255,255)_30%,rgba(255,255,255,0.7)_60%,rgba(255,255,255,0.2)_100%)]"></div>
          </div>
          
          {/* Header Content */}
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">
              ভোটমার্কেট
            </h1>
            <p className="text-base sm:text-lg text-gray-700">
              পেশাদার নির্বাচনী ক্যাম্পেইন ডিজাইন ডাউনলোড করুন বা কাস্টম অর্ডার করুন
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 sm:mb-10 space-y-4">
          {/* Search Field - Full Width */}
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
            <input
              type="text"
              placeholder="পণ্য খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 transition-all text-sm"
            />
          </div>

          {/* Desktop: Categories & Filter in one row */}
          <div className="hidden md:flex items-center gap-3">
            {/* Category Pills - Horizontal Scroll */}
            <div className="flex-1 overflow-x-auto scrollbar-hide">
              {categoriesLoading ? (
                <div className="flex gap-2 pb-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-10 w-24 bg-gray-200 rounded-full animate-pulse shrink-0" />
                  ))}
                </div>
              ) : (
                <div className="flex gap-2 pb-1">
                  {/* All Category Button */}
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all shrink-0 ${
                      selectedCategory === 'all'
                        ? 'bg-[#C8102E] text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    সব
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.slug)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all shrink-0 ${
                        selectedCategory === category.slug
                          ? 'bg-[#C8102E] text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <DynamicIcon name={category.icon} className="w-4 h-4" />
                      {category.name_bn || category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative shrink-0" ref={sortDropdownRef}>
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>{sortOptions.find(opt => opt.id === sortBy)?.label}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showSortDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-40 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50"
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSortBy(option.id);
                          setShowSortDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          sortBy === option.id
                            ? 'bg-gray-100 text-gray-900 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile: Separate rows */}
          <div className="md:hidden space-y-3">
            {/* Category Pills - Full width with gap */}
            <div className="px-4 sm:px-0">
              {categoriesLoading ? (
                <div className="flex gap-2 pb-1 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-10 w-24 bg-gray-200 rounded-full animate-pulse shrink-0" />
                  ))}
                </div>
              ) : (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
                  {/* All Category Button */}
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all shrink-0 ${
                      selectedCategory === 'all'
                        ? 'bg-[#C8102E] text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    সব
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.slug)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all shrink-0 ${
                        selectedCategory === category.slug
                          ? 'bg-[#C8102E] text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <DynamicIcon name={category.icon} className="w-4 h-4" />
                      {category.name_bn || category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative" ref={sortDropdownRef}>
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>{sortOptions.find(opt => opt.id === sortBy)?.label}</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showSortDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50"
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSortBy(option.id);
                          setShowSortDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          sortBy === option.id
                            ? 'bg-gray-100 text-gray-900 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#C8102E]" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">কোন পণ্য পাওয়া যায়নি</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  পূর্ববর্তী
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-600">
                  পৃষ্ঠা {toBengaliNumber(currentPage)} / {toBengaliNumber(totalPages)}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  পরবর্তী
                </button>
              </div>
            )}
          </>
        )}
      </SectionWrapper>
    </div>
  );
}
