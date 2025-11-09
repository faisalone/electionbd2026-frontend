'use client';

import { 
  Calendar, 
  Users, 
  FileText, 
  Vote, 
  CheckCircle2, 
  AlertCircle, 
  Flag, 
  Trophy 
} from 'lucide-react';
import { timelineData } from '@/lib/mockData';
import { useState, useRef, useEffect } from 'react';

// Icon mapping for each timeline step
const iconMap = [
  Calendar,    // ঘোষণা
  FileText,    // মনোনয়নপত্র
  CheckCircle2, // প্রার্থী তালিকা
  Users,       // প্রচারণা
  Vote,        // ভোটগ্রহণ
  AlertCircle, // ফলাফল গণনা
  Trophy,      // ফলাফল ঘোষণা
  Flag         // নতুন সরকার
];

export default function HeroTimeline() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 300);
    }
  };

  // Find the first "অপেক্ষমান" item for live indicator
  const liveIndex = timelineData.findIndex(item => item.status === 'অপেক্ষমান');

  return (
    <div className="w-full py-16 px-4">
      <div className="w-full max-w-7xl mx-auto relative">
        {/* Scroll Left Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center hover:bg-gray-50 transition-all"
          >
            <svg className="w-6 h-6 text-[#C8102E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Scroll Right Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center hover:bg-gray-50 transition-all"
          >
            <svg className="w-6 h-6 text-[#C8102E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Timeline Container with CSS Mask */}
        <div 
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="overflow-x-auto scrollbar-hide px-16"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)'
          }}
        >
          <div className="relative inline-flex items-start min-w-full pb-4">
            {timelineData.map((item, index) => {
              const Icon = iconMap[index] || Calendar;
              const isLive = index === liveIndex;
              const isCompleted = item.status === 'সম্পন্ন';
              const isUpcoming = item.status === 'অপেক্ষমান';

              return (
                <div key={item.id} className="relative flex items-start shrink-0" style={{ width: '280px' }}>
                  {/* Timeline Item */}
                  <div className="flex flex-col items-center w-full">
                    {/* Date - Above Icon - Larger */}
                    <div className="mb-5 h-10 flex items-center justify-center">
                      {item.date && (
                        <p className={`text-lg font-bold ${
                          isLive ? 'text-[#C8102E]' : 'text-gray-800'
                        }`}>
                          {item.date}
                        </p>
                      )}
                    </div>

                    {/* Icon Circle with Live Effect */}
                    <div className="relative">
                      {/* Live Pulsing Ring Effect */}
                      {isLive && (
                        <>
                          <div className="absolute inset-0 w-20 h-20 bg-[#C8102E] rounded-full animate-ping opacity-75"></div>
                          <div className="absolute inset-0 w-20 h-20 bg-[#C8102E] rounded-full animate-pulse opacity-50"></div>
                        </>
                      )}
                      
                      <div className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                        isLive 
                          ? 'bg-[#C8102E] text-white shadow-xl shadow-red-300' 
                          : isCompleted
                          ? 'bg-green-500 text-white shadow-lg'
                          : 'bg-white text-gray-400 border-2 border-gray-300 shadow-md'
                      }`}>
                        <Icon className="w-9 h-9" />
                      </div>

                      {/* Connecting Line to Next Item */}
                      {index < timelineData.length - 1 && (
                        <div className={`absolute top-10 left-[calc(50%+40px)] w-[200px] h-0.5 ${
                          isCompleted ? 'bg-green-400' : 'bg-gray-300'
                        }`} />
                      )}
                    </div>

                    {/* Title - Below Icon */}
                    <div className="mt-6 text-center px-3 w-full">
                      <h3 className={`font-bold text-base leading-snug ${
                        isLive ? 'text-[#C8102E]' : 'text-gray-800'
                      }`}>
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Scroll Hint */}
        <div className="text-center mt-4 text-sm text-gray-500 md:hidden">
          ← স্ক্রল করুন →
        </div>
      </div>
    </div>
  );
}
