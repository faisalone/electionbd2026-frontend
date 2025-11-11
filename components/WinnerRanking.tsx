'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toBengaliNumber } from '@/lib/utils';

interface Voter {
  phone_number: string;
  voted_at: string;
  rank: number;
}

interface WinnerData {
  winner: {
    phone_number: string;
    voted_at: string;
  } | null;
  winning_option: {
    id: number;
    text: string;
    color: string;
    votes: number;
  };
  winning_option_voters: Voter[];
}

interface WinnerRankingProps {
  pollId?: number;
  pollUid?: string;
}

export default function WinnerRanking({ pollId, pollUid }: WinnerRankingProps) {
  const [winnerData, setWinnerData] = useState<WinnerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error
        // Use UID if available, otherwise fall back to ID
        const identifier = pollUid || pollId;
        if (!identifier) {
          setLoading(false);
          return;
        }
        console.log('Fetching winners for:', identifier);
        const response = await api.getWinnerRanking(identifier);
        console.log('Winner response:', response);
        if (response.success) {
          setWinnerData(response.data);
        } else {
          setError(response.message || 'Failed to load winners');
        }
      } catch (err: any) {
        console.error('Failed to fetch winner ranking:', err);
        setError(err.message || 'বিজয়ী তালিকা লোড করতে ব্যর্থ হয়েছে');
      } finally {
        setLoading(false);
      }
    };

    fetchWinners();
  }, [pollId, pollUid]);

  const maskPhoneNumber = (phone: string) => {
    if (phone.length <= 6) return phone;
    return `${phone.slice(0, 3)}${'*'.repeat(phone.length - 6)}${phone.slice(-3)}`;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-700" />;
      default:
        return (
          <div className="w-6 h-6 flex items-center justify-center bg-blue-100 rounded-full text-blue-700 font-bold text-xs">
            {toBengaliNumber(rank)}
          </div>
        );
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-50 to-amber-50 border-yellow-300';
      case 2:
        return 'from-gray-50 to-slate-100 border-gray-300';
      case 3:
        return 'from-orange-50 to-amber-100 border-orange-300';
      default:
        return 'from-blue-50 to-indigo-50 border-blue-200';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-gray-600">বিজয়ী তালিকা লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
        <p className="text-red-600 text-center">{error}</p>
      </div>
    );
  }

  if (!winnerData || !winnerData.winning_option_voters || winnerData.winning_option_voters.length === 0) {
    return (
      <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
        <p className="text-yellow-700 text-center">এই পোলে এখনও কোনো বিজয়ী নির্বাচিত হয়নি</p>
      </div>
    );
  }

  const voters = winnerData.winning_option_voters;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
        <div className="p-3 bg-linear-to-br from-yellow-400 to-amber-500 rounded-xl shadow-lg">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">বিজয়ী অপশনের ভোটারদের তালিকা</h3>
          <p className="text-sm text-gray-600">যারা সবচেয়ে বেশি ভোট পাওয়া অপশনে ভোট দিয়েছেন</p>
        </div>
      </div>

      {/* Ranking List */}
      <div className="space-y-3">
        {voters.map((voter, index) => (
          <motion.div
            key={voter.phone_number}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 bg-linear-to-r ${getRankBadgeColor(
              voter.rank
            )} hover:shadow-md transition-shadow`}
          >
            {/* Rank Icon */}
            <div className="shrink-0">{getRankIcon(voter.rank)}</div>

            {/* Voter Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-lg">
                  {toBengaliNumber(maskPhoneNumber(voter.phone_number))}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                ভোট দিয়েছেন: {new Date(voter.voted_at).toLocaleDateString('bn-BD', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            {/* Rank Number */}
            <div className="shrink-0">
              <div
                className={`px-4 py-2 rounded-lg font-bold text-sm ${
                  voter.rank <= 3
                    ? 'bg-white shadow-sm'
                    : 'bg-blue-100'
                }`}
              >
                #{toBengaliNumber(voter.rank)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Note */}
      {voters.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            মোট {toBengaliNumber(voters.length)} জন বিজয়ী অপশনে ভোট দিয়েছেন
          </p>
        </div>
      )}
    </motion.div>
  );
}
