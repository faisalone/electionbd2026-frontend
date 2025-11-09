'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Briefcase } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CandidateCardProps {
  id: string;
  name: string;
  partyName: string;
  partySymbol: string;
  partySymbolName: string;
  partyColor: string;
  seatName: string;
  age: number;
  education: string;
  experience: string;
  image: string;
}

export default function CandidateCard({
  id,
  name,
  partyName,
  partySymbol,
  partySymbolName,
  partyColor,
  seatName,
  age,
  education,
  experience,
  image,
}: CandidateCardProps) {
  return (
    <Link href={`/candidate/${id}`}>
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-lg transition-all duration-200"
      >
        <div className="flex flex-col">
          {/* Top Section: Image + Party Symbol Side by Side */}
          <div className="relative border-b border-gray-200">
            <div className="p-4 flex items-center gap-4">
              {/* Image */}
              <div className="relative w-28 h-32 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                <Image
                  src={image}
                  alt={name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>

              {/* Symbol + Symbol Name + Party Name */}
              <div className="flex-1 space-y-2">
                <div 
                  className="flex items-center justify-center gap-3 p-4 rounded-lg"
                  style={{ backgroundColor: `${partyColor}10` }}
                >
                  <span className="text-6xl leading-none">{partySymbol}</span>
                  <span className="text-sm font-semibold" style={{ color: partyColor }}>
                    ({partySymbolName})
                  </span>
                </div>
                
                {/* Party Name */}
                <div 
                  className="p-2 rounded-lg text-center"
                  style={{ backgroundColor: `${partyColor}05` }}
                >
                  <p className="text-xs font-medium" style={{ color: partyColor }}>
                    {partyName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Candidate Details */}
          <div className="p-4 flex flex-col flex-1">
            {/* Header */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1.5 group-hover:text-primary transition-colors">
                {name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{age} বছর</span>
                <span>•</span>
                <span className="truncate">{seatName}</span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="space-y-3 flex-1">
              <div className="flex items-start gap-2.5">
                <GraduationCap className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 mb-1 font-medium">শিক্ষাগত যোগ্যতা</p>
                  <p className="text-sm text-gray-900 leading-relaxed">
                    {education}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Briefcase className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 mb-1 font-medium">পেশাগত অভিজ্ঞতা</p>
                  <p className="text-sm text-gray-900 leading-relaxed">
                    {experience}
                  </p>
                </div>
              </div>
            </div>

            {/* View Details Link */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm font-medium text-primary group-hover:underline inline-flex items-center gap-1">
                বিস্তারিত দেখুন
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
