'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Star, Award, Calendar } from 'lucide-react';
import { Creator } from '@/lib/api';
import { toBengaliNumber } from '@/lib/mockProducts';

interface CreatorInfoCardProps {
  creator: Creator;
  variant?: 'header' | 'sidebar';
  className?: string;
}

export default function CreatorInfoCard({ 
  creator, 
  variant = 'sidebar',
  className = ''
}: CreatorInfoCardProps) {
  
  // Header variant - like creator details page header
  if (variant === 'header') {
    return (
      <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative w-20 h-20 rounded-full bg-linear-to-br from-gray-200 to-gray-300 overflow-hidden shrink-0 ring-2 ring-[#C8102E]/20">
            {creator.avatar ? (
              <Image
                src={creator.avatar}
                alt={creator.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-600">
                {creator.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Name and Stats */}
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              {creator.name}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              {creator.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#C8102E]" />
                  <span>{creator.location}</span>
                </div>
              )}
              {creator.rating && (
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{toBengaliNumber(creator.rating.toFixed(1))}</span>
                </div>
              )}
              {creator.total_designs && (
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#C8102E]" />
                  <span>{toBengaliNumber(creator.total_designs)} ডিজাইন</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sidebar variant - for product detail page (minimal info)
  return (
    <Link
      href={`/market/creators/${creator.username}`}
      className={`block bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow ${className}`}
    >      
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative w-20 h-20 rounded-full bg-linear-to-br from-gray-200 to-gray-300 overflow-hidden shrink-0 ring-2 ring-[#C8102E]/20">
          {creator.avatar ? (
            <Image
              src={creator.avatar}
              alt={creator.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-600">
              {creator.name.charAt(0)}
            </div>
          )}
        </div>

        {/* Name and Stats - Same as header */}
        <div className="flex-1 min-w-0">
          <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 hover:text-[#C8102E] transition-colors">
            {creator.name}
          </h4>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
            {creator.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#C8102E]" />
                <span>{creator.location}</span>
              </div>
            )}
            {creator.rating && (
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold">{toBengaliNumber(creator.rating.toFixed(1))}</span>
              </div>
            )}
            {creator.total_designs && (
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#C8102E]" />
                <span>{toBengaliNumber(creator.total_designs)} ডিজাইন</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
