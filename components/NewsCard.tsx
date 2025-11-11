'use client';

import { motion } from 'framer-motion';
import { Clock, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatBengaliDateTime } from '@/lib/dateUtils';

interface NewsCardProps {
  id: number;
  uid?: string;
  title: string;
  summary: string;
  image: string;
  created_at: string;
  category: string;
}

export default function NewsCard({ id, uid, title, summary, image, created_at, category }: NewsCardProps) {
  // Fallback to placeholder if image is null/undefined
  const safeImage = image || '/news-placeholder.svg';
  const isSvg = safeImage.endsWith('.svg');
  const newsLink = uid ? `/news/${uid}` : `/news/${id}`;
  
  return (
    <Link href={newsLink}>
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-xl transition-all duration-300 h-full flex flex-col"
      >
        <div className="p-6 flex flex-col flex-1">
          {/* Header: Category Badge + Date */}
          <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#C8102E]/10 text-[#C8102E] rounded-xl border border-[#C8102E]/20">
              <Tag className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">{category}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 text-xs">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatBengaliDateTime(created_at)}</span>
            </div>
          </div>

          {/* Image Section */}
          <div className="mb-5">
            <div className="relative w-full h-48 overflow-hidden rounded-2xl bg-gray-100">
              <Image
                src={safeImage}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                unoptimized={isSvg}
                className="object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-3 line-clamp-2 leading-tight">
            {title}
          </h3>

          {/* Summary */}
          <p className="text-sm text-gray-600 mb-5 line-clamp-3 leading-relaxed flex-1">
            {summary}
          </p>

          {/* Read More Link */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm font-semibold text-primary group-hover:text-primary-600 transition-colors">
              <span>বিস্তারিত পড়ুন</span>
              <motion.span
                className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors"
                whileHover={{ x: 3 }}
              >
                →
              </motion.span>
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
