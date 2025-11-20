'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import ReactPaginate from 'react-paginate';
import SectionWrapper from '@/components/SectionWrapper';
import ProductCard from '@/components/ProductCard';
import { mockProducts, categoryLabels, getProductsByCategory, searchProducts, toBengaliNumber } from '@/lib/mockProducts';

const categories = [
  { id: 'all', label: 'সব' },
  { id: 'banner', label: 'ব্যানার' },
  { id: 'leaflet', label: 'লিফলেট' },
  { id: 'poster', label: 'পোস্টার' },
  { id: 'festoon', label: 'ফেস্টুন' },
  { id: 'video', label: 'ভিডিও' },
  { id: 'handbill', label: 'হ্যান্ডবিল' },
  { id: 'billboard', label: 'বিলবোর্ড' },
  { id: 'social-media', label: 'সোশ্যাল' },
];

const sortOptions = [
  { id: 'newest', label: 'নতুন' },
  { id: 'popular', label: 'জনপ্রিয়' },
  { id: 'downloads', label: 'ডাউনলোড' },
  { id: 'rating', label: 'রেটিং' },
];

export default function MarketPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 8;

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

  useEffect(() => {
    let products = mockProducts;

    // Filter by category
    if (selectedCategory !== 'all') {
      products = getProductsByCategory(selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      products = searchProducts(searchQuery);
    }

    // Sort products
    if (sortBy === 'downloads') {
      products = [...products].sort((a, b) => (b.downloads_count || 0) - (a.downloads_count || 0));
    } else if (sortBy === 'rating') {
      products = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'popular') {
      // Popular based on combination of downloads and rating
      products = [...products].sort((a, b) => {
        const scoreA = (a.downloads_count || 0) * (a.rating || 0);
        const scoreB = (b.downloads_count || 0) * (b.rating || 0);
        return scoreB - scoreA;
      });
    }

    setFilteredProducts(products);
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedCategory, searchQuery, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (selected: { selected: number }) => {
    setCurrentPage(selected.selected + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <SectionWrapper>
        {/* Header with Background Image */}
        <div className="mb-12 relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 overflow-hidden rounded-3xl">
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=300&fit=crop&q=80"
              alt="Marketplace Background"
              fill
              className="object-cover object-center"
              priority
            />
            {/* Stronger Gradient Overlay - White on left to transparent on right */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255,255,255)_0%,rgb(255,255,255)_30%,rgba(255,255,255,0.7)_60%,rgba(255,255,255,0.2)_100%)]"></div>
          </div>
          
          {/* Header Content */}
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              ভোটমার্কেট
            </h1>
            <p className="text-lg text-gray-700">
              পেশাদার নির্বাচনী ক্যাম্পেইন ডিজাইন ডাউনলোড করুন বা কাস্টম অর্ডার করুন
            </p>
          </div>
        </div>

        {/* Menu Bar with Search, Categories, and Sort */}
        <div className="mb-10 space-y-4">
          {/* Search Field - Full Width */}
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
            <input
              type="text"
              placeholder="পণ্য খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-transparent backdrop-blur-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 transition-all text-sm"
            />
          </div>

          {/* Desktop: Categories & Filter in one row */}
          <div className="hidden md:flex items-center gap-3">
            {/* Category Pills - Horizontal Scroll */}
            <div className="flex-1 overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 pb-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all shrink-0 min-w-[100px] ${
                      selectedCategory === category.id
                        ? 'bg-[#C8102E] text-white shadow-md'
                        : 'bg-transparent text-gray-700 hover:bg-white/50 border border-gray-200'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="relative shrink-0" ref={sortDropdownRef}>
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 px-4 py-2.5 bg-transparent border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-white/50 transition-colors whitespace-nowrap"
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

          {/* Mobile: Categories & Filter in separate rows */}
          <div className="md:hidden space-y-3">
            {/* Category Pills - Horizontal Scroll with padding */}
            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
              <div className="flex gap-2 pb-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all shrink-0 min-w-[100px] ${
                      selectedCategory === category.id
                        ? 'bg-[#C8102E] text-white shadow-md'
                        : 'bg-transparent text-gray-700 hover:bg-white/50 border border-gray-200'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown - Separate row */}
            <div className="relative" ref={sortDropdownRef}>
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-transparent border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-white/50 transition-colors"
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
                    className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50"
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSortBy(option.id);
                          setShowSortDropdown(false);
                        }}
                        className={`w-full text-center px-4 py-2.5 text-sm transition-colors ${
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
        {currentProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {currentProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center pt-8">
                <ReactPaginate
                  previousLabel={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  }
                  nextLabel={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  }
                  breakLabel="..."
                  pageCount={totalPages}
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={2}
                  onPageChange={handlePageChange}
                  forcePage={currentPage - 1}
                  pageLabelBuilder={(page) => toBengaliNumber(page)}
                  containerClassName="flex items-center gap-1"
                  pageClassName="page-item"
                  pageLinkClassName="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg font-medium text-sm transition-all bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                  previousClassName="page-item"
                  previousLinkClassName="min-w-8 h-9 sm:h-10 px-2 sm:px-3 flex items-center justify-center rounded-lg font-medium text-sm transition-all bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm"
                  nextClassName="page-item"
                  nextLinkClassName="min-w-8 h-9 sm:h-10 px-2 sm:px-3 flex items-center justify-center rounded-lg font-medium text-sm transition-all bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm"
                  breakClassName="w-9 h-9 flex items-center justify-center text-gray-400"
                  breakLinkClassName="w-full h-full flex items-center justify-center"
                  activeClassName="active"
                  activeLinkClassName="!bg-gray-900 !text-white !border-gray-900 shadow-md"
                  disabledClassName="opacity-50 cursor-not-allowed"
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">কোনো পণ্য পাওয়া যায়নি</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-sm text-gray-900 hover:text-gray-600 underline"
            >
              সব পণ্য দেখুন
            </button>
          </div>
        )}
      </SectionWrapper>
    </div>
  );
}
