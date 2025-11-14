'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import PollCard from '@/components/PollCard';
import WinnerRanking from '@/components/WinnerRanking';
import { api, type Poll } from '@/lib/api';
import echo from '@/lib/echo';
import { toBengaliNumber } from '@/lib/utils';

export default function PollDetailClient({ uid }: { uid: string }) {
  const router = useRouter();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liveVoteCount, setLiveVoteCount] = useState(0);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setLoading(true);
        const response = await api.getPollByUid(uid);
        if (response.success) {
          setPoll(response.data);
          setLiveVoteCount(response.data.total_votes);
        } else {
          setError('পোল খুঁজে পাওয়া যায়নি');
        }
      } catch (err: any) {
        console.error('Failed to fetch poll:', err);
        setError(err.message || 'পোল লোড করতে ব্যর্থ হয়েছে');
      } finally {
        setLoading(false);
      }
    };

    if (uid) fetchPoll();
  }, [uid]);

  // Listen for real-time vote updates
  useEffect(() => {
    if (!echo || !poll?.id) {
      console.log('⏳ Echo or poll not ready:', { echo: !!echo, pollId: poll?.id });
      return;
    }
    
    console.log('🎧 Subscribing to channel:', `poll.${poll.id}`);
    const channel = echo.channel(`poll.${poll.id}`);
    
    channel.listen('.vote.cast', (data: any) => {
      console.log('🔔 Vote event received:', data);
      setLiveVoteCount(data.total_votes);
      if (poll) {
        const updatedOptions = poll.options.map((option) => {
          if (data.option_votes && data.option_votes[option.id]) {
            return { ...option, votes: data.option_votes[option.id] } as any;
          }
          return option as any;
        });
        setPoll({ ...poll, options: updatedOptions, total_votes: data.total_votes });
      }
    });
    
    return () => {
      console.log('🔇 Leaving channel:', `poll.${poll.id}`);
      if (echo) echo.leaveChannel(`poll.${poll.id}`);
    };
  }, [poll?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
        {/* Header Skeleton */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 animate-pulse">
            {/* Countdown Timer Header - Centered */}
            <div className="flex items-center justify-center gap-2 mb-5 pb-4 border-b border-gray-100">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center bg-gray-200 rounded-lg px-2.5 py-1.5 min-w-12 h-14"></div>
              ))}
            </div>

            {/* Poll Question with Icon */}
            <div className="mb-6 flex items-start gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded-full mt-1 shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-gray-200 rounded w-full"></div>
                <div className="h-6 bg-gray-200 rounded w-4/5"></div>
              </div>
            </div>

            {/* Poll Options */}
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                  <div className="py-4 px-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0"></div>
                      <div className="h-4 bg-gray-200 rounded flex-1"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Share Buttons */}
            <div className="mt-6 flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-8 h-8 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">পোল পাওয়া যায়নি</h2>
          <p className="text-gray-600 mb-6">{error || 'এই পোলটি খুঁজে পাওয়া যায়নি'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            হোম পেজে ফিরে যান
          </button>
        </div>
      </div>
    );
  }

  const pollStatus = poll.end_date && new Date(poll.end_date) > new Date() ? 'upcoming' : 'ended';

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <PollCard
            pollId={poll.id}
            pollUid={poll.uid || ''}
            question={poll.question}
            creatorName={poll.creator_name || poll.user?.name}
            options={poll.options.map((opt) => ({ id: opt.id.toString(), text: opt.text, votes: (opt as any).votes || opt.vote_count || 0, color: opt.color || '#3b82f6' }))}
            totalVotes={liveVoteCount}
            endDate={poll.end_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()}
            status={pollStatus as any}
            winner={(poll as any).winner}
            isDetailPage={true}
          />
        </motion.div>

        {pollStatus === 'ended' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-8">
            <WinnerRanking pollUid={poll.uid} pollId={poll.id} />
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }} className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">পোল সম্পর্কে</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">পোল আইডি:</span>
              <span className="font-semibold text-gray-900">{poll.uid}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">মোট ভোট:</span>
              <span className="font-semibold text-gray-900">{toBengaliNumber(liveVoteCount)} জন</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">স্ট্যাটাস:</span>
              <span className={`font-semibold ${pollStatus === 'upcoming' ? 'text-green-600' : 'text-gray-600'}`}>
                {pollStatus === 'upcoming' ? 'চলমান' : 'সম্পন্ন'}
              </span>
            </div>
            {(poll.creator_name || poll.user?.name) && (
              <div className="flex justify-between">
                <span className="text-gray-600">তৈরি করেছেন:</span>
                <span className="font-semibold text-gray-900">{poll.creator_name || poll.user?.name}</span>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="mt-6 text-center">
          <p className="text-gray-600 text-sm">এই পোলটি শেয়ার করুন এবং আরো বেশি মানুষের মতামত নিন! 🗳️</p>
        </motion.div>
      </div>
    </div>
  );
}
