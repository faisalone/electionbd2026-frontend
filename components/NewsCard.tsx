'use client';

import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface NewsCardProps {
  id: number;
  uid?: string;
  title: string;
  summary: string;
  image: string;
  date: string;
  category: string;
}

export default function NewsCard({ id, uid, title, summary, image, date, category }: NewsCardProps) {
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
        whileHover={{ y: -10 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all cursor-pointer h-full flex flex-col"
      >
        {/* Image */}
        <div className="relative w-full h-52 overflow-hidden bg-gray-200">
          <Image
            src={safeImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            unoptimized={isSvg}
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        {/* Category Badge */}
        <div className="absolute top-4 right-4 bg-[#C8102E] text-white px-3 py-1 rounded-full text-sm font-medium z-10">
          {category}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Date */}
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
          <Calendar className="w-4 h-4" />
          <span>{date}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-[#C8102E] transition-colors">
          {title}
        </h3>

        {/* Summary */}
        <p className="text-gray-600 mb-4 line-clamp-3">{summary}</p>

        {/* Read More Button */}
        <motion.button
          whileHover={{ x: 5 }}
          className="flex items-center gap-2 text-[#C8102E] font-medium group"
        >
          আরও পড়ুন
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </motion.article>
    </Link>
  );
}
