'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, Clock, User } from 'lucide-react';
import NewsCard from '@/components/NewsCard';
import NewsShareButton from '@/components/NewsShareButton';
import { api, type News } from '@/lib/api';

export default function NewsDetailPage() {
  const params = useParams();
  const uid = params?.uid as string;
  const [news, setNews] = useState<News | null>(null);
  const [relatedNews, setRelatedNews] = useState<News[]>([]);
  const [categoryNews, setCategoryNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Fetch single news item by UID
        const response = await api.getNewsArticleByUid(uid);
        
        if (response.success) {
          setNews(response.data);
          
          // Fetch related news (by category)
          const allNewsRes = await api.getNews({ page: 1, per_page: 12 });
          if (allNewsRes.success) {
            const related = allNewsRes.data
              .filter(n => n.category === response.data.category && n.uid !== uid)
              .slice(0, 3);
            setRelatedNews(related);
            
            const category = allNewsRes.data
              .filter(n => n.uid !== uid)
              .slice(0, 4);
            setCategoryNews(category);
          }
        }
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };

    if (uid) {
      fetchNews();
    }
  }, [uid]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            {/* Breadcrumb Skeleton */}
            <div className="mb-8 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-48"></div>
            </div>

            {/* Main Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  {/* Category Badge */}
                  <div className="px-6 pt-6 pb-4">
                    <div className="h-8 bg-gray-200 rounded-full w-24"></div>
                  </div>

                  {/* Title */}
                  <div className="px-6 pb-6 space-y-3">
                    <div className="h-8 bg-gray-200 rounded w-full"></div>
                    <div className="h-8 bg-gray-200 rounded w-5/6"></div>
                    <div className="flex gap-4 pt-4">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>

                  {/* Featured Image */}
                  <div className="w-full h-[400px] bg-gray-200"></div>

                  {/* Content */}
                  <div className="px-6 py-8 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>

              {/* Sidebar Skeleton */}
              <div className="lg:col-span-1">
                <div className="rounded-2xl shadow-lg p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex gap-4 pb-4 border-b border-gray-200">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">খবর পাওয়া যায়নি</h1>
          <Link href="/news" className="text-[#C8102E] hover:underline">
            সব খবরে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  const safeImage = news.image || '/news-placeholder.svg';
  const isSvg = safeImage.endsWith('.svg');

  return (
    <div className="min-h-screen">
      {/* Breadcrumb & Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/news" 
            className="inline-flex items-center gap-2 text-[#C8102E] hover:text-[#A00D27] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">সব খবরে ফিরে যান</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <article className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Article */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl shadow-md overflow-hidden"
              >
                {/* Category Badge */}
                <div className="px-6 pt-6 pb-4">
                  <span className="inline-block bg-[#C8102E] text-white px-4 py-2 rounded-full text-sm font-medium">
                    {news.category}
                  </span>
                </div>

                {/* Title */}
                <div className="px-6 pb-6">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    {news.title}
                  </h1>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm border-b border-gray-200 pb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{news.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>৫ মিনিট পড়ার সময়</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>নির্বাচন বিডি</span>
                    </div>
                  </div>
                </div>

                {/* Featured Image */}
                <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] bg-gray-200 mb-8 overflow-hidden rounded-lg">
                  <Image
                    src={safeImage}
                    alt={news.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    unoptimized={isSvg}
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Article Content */}
                <div className="px-6 pb-8">
                  {/* Summary */}
                  {news.summary && (
                    <div className="bg-gray-50 border-l-4 border-[#C8102E] p-6 mb-8 rounded-r-lg">
                      <p className="text-lg text-gray-700 leading-relaxed font-medium">
                        {news.summary}
                      </p>
                    </div>
                  )}

                  {/* Main Content */}
                  <div className="prose prose-lg max-w-none">
                    <div className="text-gray-800 leading-relaxed space-y-6">
                      {news.content.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="text-justify">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Share Buttons */}
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <h3 className="text-lg font-bold text-gray-900">শেয়ার করুন</h3>
                      <NewsShareButton
                        newsId={news.id}
                        newsUid={news.uid}
                        title={news.title}
                        category={news.category}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Related News */}
              {relatedNews.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <span className="w-1 h-8 bg-[#C8102E] rounded-full"></span>
                    সম্পর্কিত খবর
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedNews.map((item) => (
                      <NewsCard
                        key={item.id}
                        id={item.id}
                        uid={item.uid}
                        title={item.title}
                        summary={item.summary || item.content?.substring(0, 100) + '...' || ''}
                        image={item.image}
                        date={item.date}
                        category={item.category}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
                {/* Latest News Widget */}
                <div className="rounded-2xl shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <span className="w-1 h-6 bg-[#C8102E] rounded-full"></span>
                    সর্বশেষ খবর
                  </h3>
                  <div className="space-y-4">
                    {categoryNews.slice(0, 5).map((item, index) => (
                      <Link key={item.id} href={`/news/${item.uid || item.id}`}>
                        <div className="group cursor-pointer pb-4 border-b border-gray-200 last:border-0">
                          <div className="flex gap-4">
                            <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-200">
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                unoptimized={item.image.endsWith('.svg')}
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-[#C8102E] transition-colors mb-2">
                                {item.title}
                              </h4>
                              <span className="text-xs text-gray-500">{item.date}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link 
                    href="/news" 
                    className="block mt-6 text-center text-[#C8102E] hover:text-[#A00D27] font-medium transition-colors"
                  >
                    সব খবর দেখুন →
                  </Link>
                </div>

                {/* Category Widget */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <span className="w-1 h-6 bg-[#C8102E] rounded-full"></span>
                    বিভাগসমূহ
                  </h3>
                  <div className="space-y-2">
                    {['নির্বাচন', 'রাজনীতি', 'বিশ্লেষণ', 'প্রচারণা', 'জরিপ', 'বিতর্ক'].map((cat) => (
                      <Link 
                        key={cat}
                        href={`/news?category=${cat}`}
                        className="block px-4 py-3 bg-gray-50 hover:bg-[#C8102E] hover:text-white rounded-lg transition-colors font-medium"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Ad Space */}
                <div className="bg-linear-to-br from-gray-100 to-gray-200 rounded-2xl p-8 text-center">
                  <p className="text-gray-500 text-sm">বিজ্ঞাপন স্থান</p>
                  <p className="text-gray-400 text-xs mt-2">Advertisement Space</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
