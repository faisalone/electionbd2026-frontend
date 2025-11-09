'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import NewsCard from '@/components/NewsCard';
import { api, type News } from '@/lib/api';
import { ChevronRight, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const categories = ['সব', 'নির্বাচন', 'রাজনীতি', 'বিশ্লেষণ', 'প্রচারণা', 'জরিপ', 'বিতর্ক'];

export default function NewsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get('category');
  
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'সব');
  const [newsByCategory, setNewsByCategory] = useState<Record<string, News[]>>({});

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.getNews({ page: 1 });
        if (response.success) {
          setNews(response.data);
          
          // Group news by category
          const grouped: Record<string, News[]> = {};
          response.data.forEach((item) => {
            if (!grouped[item.category]) {
              grouped[item.category] = [];
            }
            grouped[item.category].push(item);
          });
          setNewsByCategory(grouped);
        }
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const filteredNews = selectedCategory === 'সব' 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  const featuredNews = news.slice(0, 1)[0];
  const topNews = news.slice(1, 5);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C8102E]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Category Filter - Clean Minimal */}
      <div className="border-b border-gray-200 sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap text-sm ${
                  selectedCategory === category
                    ? 'bg-[#C8102E] text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {selectedCategory === 'সব' ? (
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
                  <Link href={`/news/${featuredNews.id}`} className="lg:col-span-3">
                    <motion.article
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all h-full"
                    >
                      <div className="grid md:grid-cols-2 gap-0 h-full">
                        {/* Image Left */}
                        <div className="relative h-64 md:h-full min-h-[300px] overflow-hidden bg-gray-200">
                          <Image
                            src={featuredNews.image}
                            alt={featuredNews.title}
                            fill
                            unoptimized={featuredNews.image.endsWith('.svg')}
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            priority
                          />
                          <div className="absolute top-4 right-4 bg-[#C8102E] text-white px-3 py-1 rounded-full text-sm font-medium">
                            {featuredNews.category}
                          </div>
                        </div>

                        {/* Content Right */}
                        <div className="p-6 md:p-8 flex flex-col justify-center">
                          <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                            <Clock className="w-4 h-4" />
                            <span>{featuredNews.date}</span>
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
                      id={topNews[0].id}
                      title={topNews[0].title}
                      summary={topNews[0].summary || topNews[0].content?.substring(0, 100) + '...' || ''}
                      image={topNews[0].image}
                      date={topNews[0].date}
                      category={topNews[0].category}
                    />
                  </motion.div>
                </div>
              </section>
            )}

            {/* Secondary Grid - 4 Column News Cards */}
            {topNews.length > 1 && (
              <section className="mb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {topNews.slice(1, 5).map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <NewsCard
                        id={item.id}
                        title={item.title}
                        summary={item.summary || item.content?.substring(0, 100) + '...' || ''}
                        image={item.image}
                        date={item.date}
                        category={item.category}
                      />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Category Sections - Uniform Card Layout */}
            {Object.entries(newsByCategory).map(([category, items]) => (
              <section key={category} className="mb-16">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-7 bg-[#C8102E]"></div>
                    <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">{category}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className="text-[#C8102E] hover:text-[#A00D27] font-semibold flex items-center gap-1 transition-all group text-sm uppercase tracking-wide"
                  >
                    <span>সব দেখুন</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* All Cards Same Size - 4 Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {items.slice(0, 4).map((item) => (
                    <NewsCard
                      key={item.id}
                      id={item.id}
                      title={item.title}
                      summary={item.summary || item.content?.substring(0, 100) + '...' || ''}
                      image={item.image}
                      date={item.date}
                      category={item.category}
                    />
                  ))}
                </div>
              </section>
            ))}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredNews.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <NewsCard
                      id={item.id}
                      title={item.title}
                      summary={item.summary || item.content?.substring(0, 100) + '...' || ''}
                      image={item.image}
                      date={item.date}
                      category={item.category}
                    />
                  </motion.div>
                ))}
              </div>
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

      {/* Load More */}
      {filteredNews.length > 12 && (
        <div className="text-center pb-16">
          <button className="bg-[#C8102E] hover:bg-[#A00D27] text-white px-12 py-4 rounded font-bold text-base uppercase tracking-wide transition-all shadow-lg hover:shadow-xl hover:scale-105">
            আরও খবর দেখুন
          </button>
        </div>
      )}
    </div>
  );
}
