'use client';

import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface NewsCardProps {
  title: string;
  summary: string;
  image: string;
  date: string;
  category: string;
}

export default function NewsCard({ title, summary, image, date, category }: NewsCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-110"
        />
        {/* Category Badge */}
        <div className="absolute top-4 right-4 bg-[#C8102E] text-white px-3 py-1 rounded-full text-sm font-medium">
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
  );
}
