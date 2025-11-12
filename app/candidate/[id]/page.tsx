'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, User, GraduationCap, Briefcase } from 'lucide-react';
import { api, type Candidate } from '@/lib/api';
import { getImageUrl } from '@/lib/admin/api';
import SectionWrapper from '@/components/SectionWrapper';

export default function CandidatePage() {
  const params = useParams();
  const candidateId = params.id as string;
  
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        setLoading(true);
        const res = await api.getCandidate(parseInt(candidateId));
        if (res.success) {
          setCandidate(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch candidate:', error);
      } finally {
        setLoading(false);
      }
    };

    if (candidateId) {
      fetchCandidate();
    }
  }, [candidateId]);

  if (loading) {
    return (
      <SectionWrapper>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100">
            <div className="h-6 bg-gray-200"></div>
            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                  <div className="w-full aspect-square rounded-2xl bg-gray-200"></div>
                  <div className="mt-6 h-32 bg-gray-200 rounded-2xl"></div>
                </div>
                <div className="md:col-span-2 space-y-6">
                  <div className="h-12 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-100 rounded w-1/2"></div>
                  <div className="h-32 bg-gray-100 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>
    );
  }

  if (!candidate) {
    return (
      <SectionWrapper>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            প্রার্থী খুঁজে পাওয়া যায়নি
          </h1>
          <Link href="/" className="text-[#C8102E] hover:underline">
            হোমে ফিরে যান
          </Link>
        </div>
      </SectionWrapper>
    );
  }

  const party = candidate.party;
  const seat = candidate.seat;
  const district = seat?.district;
  const symbol = candidate.symbol || party?.symbol;
  const symbolData = typeof symbol === 'object' && symbol ? symbol : null;
  const partyColor = party?.color || '#666666';
  const firstLetter = (candidate.name || candidate.name_en).charAt(0).toUpperCase();

  // Generate a consistent avatar color
  const getAvatarColor = (name: string) => {
    const colors = [
      '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', 
      '#10b981', '#06b6d4', '#6366f1', '#f97316'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const avatarBgColor = getAvatarColor(candidate.name || candidate.name_en);

  return (
    <SectionWrapper>
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-[#C8102E] mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>ফিরে যান</span>
      </Link>

      {/* Candidate Profile Card */}
      <motion.div 
        className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Party Color Header */}
        <div className="h-6" style={{ backgroundColor: partyColor }} />

        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left: Profile Image */}
            <div className="md:col-span-1">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-200 shadow-xl flex items-center justify-center">
                {candidate.image ? (
                  <img 
                    src={getImageUrl(candidate.image)} 
                    alt={candidate.name || candidate.name_en}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center text-white text-8xl font-bold"
                    style={{ backgroundColor: avatarBgColor }}
                  >
                    {firstLetter}
                  </div>
                )}
              </div>
              
              {/* Party/Symbol Info */}
              <div
                className="mt-6 p-6 rounded-2xl text-white text-center"
                style={{ backgroundColor: partyColor }}
              >
                {symbolData?.image ? (
                  <div className="mb-3">
                    <img 
                      src={getImageUrl(symbolData.image)} 
                      alt={symbolData.symbol_name}
                      className="w-24 h-24 object-contain mx-auto"
                    />
                  </div>
                ) : (
                  <div className="text-6xl mb-3">🏛️</div>
                )}
                <h3 className="text-xl font-bold">
                  {party?.name || 'স্বতন্ত্র'}
                </h3>
                {symbolData && (
                  <p className="text-sm mt-2 opacity-90">{symbolData.symbol_name}</p>
                )}
              </div>
            </div>

            {/* Right: Details */}
            <div className="md:col-span-2">
              {/* Name and Basic Info */}
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  {candidate.name}
                </h1>
                <p className="text-xl text-gray-600 mb-2">
                  {candidate.name_en}
                </p>
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-5 h-5" />
                  <span>বয়স: {candidate.age} বছর</span>
                </div>
              </div>

              {/* Seat Info */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-[#C8102E] shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">নির্বাচনী এলাকা</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {seat?.name || 'N/A'}
                    </p>
                    {seat?.area && (
                      <p className="text-gray-600 mt-1">{seat.area}</p>
                    )}
                    {district && (
                      <p className="text-gray-500 mt-1 text-sm">
                        জেলা: {district.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <GraduationCap className="w-6 h-6 text-[#C8102E] shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 mb-2">শিক্ষাগত যোগ্যতা</p>
                    <p className="text-lg font-bold text-gray-900">
                      {candidate.education}
                    </p>
                  </div>
                </div>
              </div>

              {/* Experience */}
              {candidate.experience && (
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-6 h-6 text-[#C8102E] shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600 mb-2">পেশাগত অভিজ্ঞতা</p>
                      <p className="text-lg font-bold text-gray-900">
                        {candidate.experience}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="mt-12 pt-8 border-t-2 border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              নির্বাচনী তথ্য
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                {candidate.name} {seat?.name} আসন থেকে {party?.name || 'স্বতন্ত্র প্রার্থী হিসেবে'} প্রতিদ্বন্দ্বিতা করছেন।
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
