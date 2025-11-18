'use client';

import { useEffect, useState, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import NewsCard from '@/components/NewsCard';
import NewsNavbar from '@/components/NewsNavbar';
import { api, type News } from '@/lib/api';
import { ChevronRight, Clock, Calendar, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/admin/api';

const categories = ['সব', 'নির্বাচন', 'ভোট', 'রাজনীতি', 'বিশ্লেষণ', 'প্রচারণা'];

function NewsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get('category');
  
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'সব');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [newsByCategory, setNewsByCategory] = useState<Record<string, News[]>>({});
  const [featuredImageError, setFeaturedImageError] = useState(false);
  
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchNews = async (page: number, reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const category = selectedCategory === 'সব' ? undefined : selectedCategory;
      // Always request 10 items from backend for consistent pagination
      const response = await api.getNews({ page, category, per_page: 10 });
      
      if (response.success) {
        let newItems = response.data;
        
        // On pages after the first, only take 8 items to display
        if (page > 1 && newItems.length > 8) {
          newItems = newItems.slice(0, 8);
        }
        
        // Deduplicate news items by id to prevent key conflicts
        setNews(prev => {
          if (reset) return newItems;
          
          const existingIds = new Set(prev.map(item => item.id));
          const uniqueNewItems = newItems.filter(item => !existingIds.has(item.id));
          return [...prev, ...uniqueNewItems];
        });
        
        // Set hasMore based on backend pagination info
        setHasMore(response.pagination.has_more);
        
        // Group news by category only on first load
        if (reset && selectedCategory === 'সব') {
          const grouped: Record<string, News[]> = {};
          response.data.forEach((item) => {
            if (!grouped[item.category]) {
              grouped[item.category] = [];
            }
            grouped[item.category].push(item);
          });
          setNewsByCategory(grouped);
        }
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load more when scrolling to bottom
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasMore && !loadingMore && !loading) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasMore, loadingMore, loading]);

  useEffect(() => {
    const element = observerTarget.current;
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0,
      rootMargin: '100px',
    });

    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [handleObserver]);

  // Fetch news on page change
  useEffect(() => {
    if (currentPage > 1) {
      fetchNews(currentPage, false);
    }
  }, [currentPage]);

  // Reset and fetch when category changes
  useEffect(() => {
    setCurrentPage(1);
    setNews([]);
    setHasMore(true);
    setFeaturedImageError(false);
    fetchNews(1, true);
  }, [selectedCategory]);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const filteredNews = selectedCategory === 'সব' 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  const featuredNews = news.slice(0, 1)[0];
  const topNews = news.slice(1, 6); // Get 5 more news (1 featured + 5 = 6 total)

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('bn-BD', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('bn-BD', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  return (
    <div className="min-h-screen">
      {/* News-specific Navbar with Google-style dropdown */}
      <NewsNavbar 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="container mx-auto px-4 py-12">
        {loading ? (
          /* Skeleton Loading */
          <div className="space-y-16">
            {/* Featured Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 h-full">
                  <div className="grid md:grid-cols-2 gap-0 h-full animate-pulse">
                    <div className="h-64 md:h-full min-h-[300px] bg-gray-200"></div>
                    <div className="p-6 md:p-8 space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-8 bg-gray-200 rounded w-full"></div>
                      <div className="h-8 bg-gray-200 rounded w-4/5"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 rounded w-full"></div>
                    <div className="h-6 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 rounded w-full"></div>
                    <div className="h-6 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : selectedCategory === 'সব' ? (
          <>
            {/* Modern Grid Layout - Featured + Top Stories */}
            {featuredNews && topNews.length > 0 && (
              <section className="mb-16">
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-1 h-8 bg-[#C8102E]"></div>
                  <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">প্রধান খবর</h2>
                </div>
                
                {/* Hero Grid: 3/4 + 1/4 layout on desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
                  {/* Featured Story - 3 columns - Horizontal Card */}
                  <Link href={`/news/${featuredNews.uid || featuredNews.id}`} className="lg:col-span-3">
                    <motion.article
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all h-full"
                    >
                      <div className="grid md:grid-cols-2 gap-0 h-full">
                        {/* Image Left */}
                        <div className="relative h-64 md:h-full min-h-[300px] overflow-hidden bg-gray-200">
                          <Image
                            src={featuredImageError || !featuredNews.image ? '/news-placeholder.svg' : getImageUrl(featuredNews.image)}
                            alt={featuredNews.title}
                            fill
                            unoptimized={true}
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            priority
                            onError={() => setFeaturedImageError(true)}
                          />
                          <div className="absolute top-4 right-4 bg-[#C8102E] text-white px-3 py-1 rounded-full text-sm font-medium">
                            {featuredNews.category}
                          </div>
                        </div>

                        {/* Content Right */}
                        <div className="p-6 md:p-8 flex flex-col justify-center">
                          <div className="flex flex-wrap items-center gap-3 text-gray-500 text-sm mb-3">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDateTime(featuredNews.created_at || featuredNews.date).date}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              <span>{formatDateTime(featuredNews.created_at || featuredNews.date).time}</span>
                            </div>
                          </div>
                          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-[#C8102E] transition-colors">
                            {featuredNews.title}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {featuredNews.summary || featuredNews.content?.substring(0, 150)}
                          </p>
                          <div className="flex items-center gap-2 text-[#C8102E] font-medium group-hover:gap-4 transition-all">
                            <span>আরও পড়ুন</span>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  </Link>

                  {/* Second Featured Story - 1 column - Standard Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-1"
                  >
                    <NewsCard
                      {...topNews[0]}
                      summary={topNews[0].summary || topNews[0].content?.substring(0, 100) + '...' || ''}
                    />
                  </motion.div>
                </div>
              </section>
            )}

            {/* Secondary Grid - 4 Column News Cards */}
            {topNews.length > 1 && (
              <section className="mb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {topNews.slice(1).map((item, index) => (
                    <motion.div
                      key={item.uid || item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <NewsCard
                        {...item}
                        summary={item.summary || item.content?.substring(0, 100) + '...' || ''}
                      />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Remaining News in Grid - Continue from where topNews ended */}
            {news.length > 6 && (
              <section className="mb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {news.slice(6).map((item, index) => (
                    <motion.div
                      key={item.uid || item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <NewsCard
                        {...item}
                        summary={item.summary || item.content?.substring(0, 100) + '...' || ''}
                      />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Infinite Scroll Loader for "সব" view */}
            <div ref={observerTarget} className="flex justify-center py-12 min-h-[100px]">
              {hasMore && loadingMore && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-lg font-medium">আরও খবর লোড হচ্ছে...</span>
                </div>
              )}
              {!hasMore && news.length > 0 && (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-50 rounded-full border border-gray-200">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600 font-medium">সব খবর দেখানো হয়েছে</span>
                  </div>
                </div>
              )}
            </div>

            {/* Category Sections - Removed for cleaner infinite scroll */}
          </>
        ) : (
          /* Filtered Category View - Masonry Grid */
          <section>
            <div className="mb-10 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1.5 h-10 bg-[#C8102E]"></div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 uppercase tracking-wide">
                  {selectedCategory}
                </h1>
              </div>
              <p className="text-gray-600 text-base ml-5 font-medium">
                {filteredNews.length} টি সংবাদ
              </p>
            </div>
            
            {filteredNews.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredNews.map((item, index) => (
                    <motion.div
                      key={item.uid || item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <NewsCard
                        {...item}
                        summary={item.summary || item.content?.substring(0, 100) + '...' || ''}
                      />
                    </motion.div>
                  ))}
                </div>
                
                {/* Infinite Scroll Loader */}
                <div ref={observerTarget} className="flex justify-center py-12 min-h-[100px]">
                  {hasMore && loadingMore && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="text-lg font-medium">আরও খবর লোড হচ্ছে...</span>
                    </div>
                  )}
                  {!hasMore && filteredNews.length > 0 && (
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-50 rounded-full border border-gray-200">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600 font-medium">সব খবর দেখানো হয়েছে</span>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-24">
                <div className="mb-6">
                  <svg className="w-24 h-24 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="text-gray-900 text-2xl font-bold mb-2">কোনো খবর পাওয়া যায়নি</h3>
                <p className="text-gray-500 text-lg">এই বিভাগে এখনও কোনো সংবাদ প্রকাশিত হয়নি</p>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default function NewsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    }>
      <NewsContent />
    </Suspense>
  );
}
