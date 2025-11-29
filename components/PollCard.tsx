'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle, Send, Loader2, XCircle } from 'lucide-react';
import { LiaLongArrowAltRightSolid } from 'react-icons/lia';
import { toBengaliNumber, toEnglishNumber, formatBengaliDate } from '@/lib/utils';
import api from '@/lib/api';
import ShareButton from './ShareButton';
import echo from '@/lib/echo';

interface PollOption {
  id: string;
  text: string;
  votes: number;
  color: string;
}

interface PollCardProps {
  question: string;
  creatorName?: string;
  options: PollOption[];
  totalVotes: number;
  pollId: number;
  pollUid?: string;
  endDate: string;
  status: 'upcoming' | 'ended';
  winner?: {
    phone_number: string;
    voted_at: string;
  } | null;
  isDetailPage?: boolean;
}

export default function PollCard({ 
  question, 
  creatorName, 
  options, 
  totalVotes, 
  pollId, 
  pollUid, 
  endDate, 
  status, 
  winner, 
  isDetailPage = false 
}: PollCardProps) {
  const [voted, setVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [rememberedVote, setRememberedVote] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [votingStep, setVotingStep] = useState<'select' | 'phone'>('select');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [liveVoteCount, setLiveVoteCount] = useState(totalVotes);
  const [animatedVoteCount, setAnimatedVoteCount] = useState(totalVotes);
  const [liveOptions, setLiveOptions] = useState(options);

  // Sync live vote count and options
  useEffect(() => {
    setLiveVoteCount(totalVotes);
    setAnimatedVoteCount(totalVotes);
    setLiveOptions(options);
  }, [totalVotes, options]);

  // Animate number changes
  useEffect(() => {
    if (animatedVoteCount === liveVoteCount) return;

    const diff = liveVoteCount - animatedVoteCount;
    const step = diff > 0 ? 1 : -1;
    const duration = Math.min(Math.abs(diff) * 50, 1000);
    const stepTime = duration / Math.abs(diff);

    const timer = setInterval(() => {
      setAnimatedVoteCount(prev => {
        const next = prev + step;
        if ((step > 0 && next >= liveVoteCount) || (step < 0 && next <= liveVoteCount)) {
          clearInterval(timer);
          return liveVoteCount;
        }
        return next;
      });
    }, stepTime);

    return () => clearInterval(timer);
  }, [liveVoteCount, animatedVoteCount]);

  // Real-time updates
  useEffect(() => {
    if (!echo) return;
    
    const channel = echo.channel(`poll.${pollId}`);
    channel.listen('.vote.cast', (data: any) => {
      setLiveVoteCount(data.total_votes);
      
      // Update individual option vote counts
      if (data.option_votes) {
        setLiveOptions(prevOptions => 
          prevOptions.map(opt => ({
            ...opt,
            votes: data.option_votes[opt.id] || opt.votes
          }))
        );
      }
    });

    return () => {
      if (echo) {
        echo.leaveChannel(`poll.${pollId}`);
      }
    };
  }, [pollId, echo]);

  // Countdown timer
  useEffect(() => {
    if (status === 'upcoming') {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const end = new Date(endDate).getTime();
        const distance = end - now;

        if (distance > 0) {
          setTimeLeft({
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000),
          });
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [endDate, status]);

  // Restore vote from localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(`poll_voted_${pollId}`);
        if (stored) {
          setRememberedVote(stored);
          setSelectedOption(stored);
          setVoted(true);
        }
      }
    } catch (e) {
      // ignore
    }
  }, [pollId]);

  const handleOptionClick = (optionId: string) => {
    if (!voted && status === 'upcoming') {
      setSelectedOption(optionId);
      setVotingStep('phone');
      setPhoneNumber('');
      setSubmitError('');
    }
  };

  const handleVoteSubmit = async () => {
    if (!selectedOption) return;
    
    const englishPhone = toEnglishNumber(phoneNumber);
    if (englishPhone.length < 11) {
      setSubmitError('সঠিক ফোন নম্বর লিখুন (১১ ডিজিট)');
      return;
    }
    
    setIsVerifying(true);
    setSubmitError('');
    
    try {
      await api.votePoll(pollId, {
        option_id: parseInt(selectedOption),
        phone_number: englishPhone,
      });
      
      // Mark as voted and remember the voted option
      setVoted(true);
      setRememberedVote(selectedOption);
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(`poll_voted_${pollId}`, selectedOption);
        }
      } catch (e) {}
      // Don't reset votingStep - keep selected option visible
      // Removed optimistic update - wait for websocket response
    } catch (error: any) {
      setSubmitError(error.message || 'ভোট জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsVerifying(false);
    }
  };

  const getPercentage = (votes: number) => {
    return liveVoteCount > 0 ? ((votes / liveVoteCount) * 100).toFixed(1) : '0.0';
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col max-h-[700px] relative ${
        status === 'upcoming' 
          ? 'border-2 border-[#C8102E]/30 shadow-[#C8102E]/10 shadow-lg' 
          : 'border border-gray-100 hover:border-gray-200'
      }`}
    >
      {/* Fixed Header - Always Visible */}
      <div className={`p-6 pb-4 border-b border-gray-100 rounded-t-2xl shrink-0 ${
        status === 'ended' 
          ? 'bg-linear-to-br from-green-600 to-green-700' 
          : 'bg-linear-to-br from-blue-50 to-purple-50'
      }`}>
        {/* Question */}
        <div className="flex items-start gap-2">
          {status === 'upcoming' && (
            <div className="relative flex items-center justify-center w-5 h-5 mt-1 shrink-0">
              <div className="absolute inset-0 w-5 h-5 bg-[#C8102E] rounded-full animate-ping opacity-75"></div>
              <div className="relative w-2.5 h-2.5 bg-[#C8102E] rounded-full"></div>
            </div>
          )}
          {status === 'ended' && (
            <CheckCircle className="w-5 h-5 text-white mt-1 shrink-0" />
          )}
          <h3 className={`font-bold leading-tight flex-1 ${
            status === 'ended' ? 'text-white text-lg' : 'text-gray-900 text-3xl'
          }`}>{question}</h3>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 min-h-0">
        {/* Options */}
        <div className="w-full space-y-4">
          {(() => {
            const showResults = voted || status === 'ended';
            const isSelectionMode = !voted && status === 'upcoming';

            if (showResults) {
              return (
                <div className="space-y-3">
                  {liveOptions.map((option) => {
                    const percentage = getPercentage(option.votes);
                    const isRemembered = rememberedVote === option.id;
                    return (
                      <div key={option.id}>
                        <div className={`relative overflow-hidden rounded-xl border bg-gray-50 ${isRemembered ? 'ring-2 ring-offset-2 ring-blue-500/20 border-blue-500' : 'border-gray-200'}`}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="absolute inset-0 bg-blue-500 opacity-20"
                          />
                          <div className="relative z-10 py-4 px-4 flex items-center justify-between gap-2">
                            <span className="font-semibold text-gray-900 text-sm leading-tight wrap-break-word flex-1">
                              {option.text}
                            </span>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xl font-bold text-blue-600">
                                {toBengaliNumber(percentage)}%
                              </span>
                              <span className="text-xs text-gray-500">
                                ({toBengaliNumber(option.votes)})
                              </span>
                              {isRemembered && (
                                <CheckCircle className="w-4 h-4 text-[#C8102E] ml-1" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            }

            // Selection Mode
            const gridContainerClasses = liveOptions.length === 1 ? 'grid-cols-1' : 'grid-cols-2';
            return (
              <div className={`grid gap-3 ${gridContainerClasses}`}>
                {liveOptions.map((option, idx) => {
                  const isSelected = selectedOption === option.id;
                  const isLong = option.text.length > 80;
                  const forceCenterThird = liveOptions.length === 3 && idx === 2;
                  const colSpanClass = isLong ? 'col-span-2' : 'col-span-1';
                  const selfAlignClass = forceCenterThird ? 'col-span-2 justify-self-center' : '';

                  return (
                    <motion.button
                      key={option.id}
                      onClick={() => handleOptionClick(option.id)}
                      disabled={!isSelectionMode}
                      whileHover={isSelectionMode ? { scale: 1.02 } : {}}
                      whileTap={isSelectionMode ? { scale: 0.98 } : {}}
                      className={`${colSpanClass} ${selfAlignClass} text-left transition-all rounded-xl border px-4 py-4 text-sm font-semibold ${
                        isSelectionMode ? 'cursor-pointer' : 'cursor-default'
                      } ${isSelected ? 'text-white bg-blue-500 border-blue-500' : 'text-gray-900 bg-gray-50 border-gray-200 hover:border-gray-300'}`}
                    >
                      <span className="wrap-break-word">{option.text}</span>
                    </motion.button>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Voting Flow */}
      {selectedOption && !voted && status === 'upcoming' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="overflow-hidden px-6 pb-3"
        >
          <div className="space-y-2">
              <div className="relative">
                <input
                type="tel"
                value={phoneNumber}
                  onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setSubmitError('');
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && toEnglishNumber(phoneNumber).length >= 11) {
                    handleVoteSubmit();
                  }
                }}
                placeholder="হোয়াটসঅ্যাপ নাম্বার"
                className="w-full px-4 pr-24 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 font-semibold transition-all text-center text-base border-blue-400 focus:border-blue-500 focus:ring-blue-100 bg-blue-50"
                maxLength={11}
                  autoFocus
                />

                  <button
                    onClick={handleVoteSubmit}
                    disabled={toEnglishNumber(phoneNumber).length < 11 || isVerifying}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-1.5 transition-all ${
                  toEnglishNumber(phoneNumber).length >= 11 && !isVerifying
                    ? 'bg-[#25D366] hover:bg-[#1da851] text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                  >
                {isVerifying ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /><span>...</span></>
                ) : (
                  <><Send className="w-4 h-4" /><span>জমা</span></>
                )}
                  </button>
                </div>

                {submitError && (
                  <div className="p-1.5 bg-red-50 border border-red-200 rounded text-red-700 text-[10px] font-medium flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {submitError}
                  </div>
                )}

                <div className="p-2 bg-green-50 border border-green-200 rounded-lg text-green-700 font-medium text-center">
                  আপনি হোয়াটসঅ্যাপে নিশ্চিতকরণ বার্তা পাবেন এবং জিতলে যোগাযোগ করা হবে...
                </div>
              </div>
        </motion.div>
      )}

      {/* Fixed Footer */}
      {/* Vote Success */}
      {voted && (
        <div className="mx-6 mt-auto mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">ভোট সফল!</span>
        </div>
      )}

      {/* Fixed Footer */}
      <div className="p-6 pt-4 border-t border-gray-100 space-y-3 shrink-0">
        {/* Countdown/Date near totals */}
        {status === 'upcoming' ? (
          <div className="flex items-center justify-center gap-2">
            {[
              { value: timeLeft.days, label: 'দিন' },
              { value: timeLeft.hours, label: 'ঘণ্টা' },
              { value: timeLeft.minutes, label: 'মিনিট' },
              { value: timeLeft.seconds, label: 'সেকেন্ড' },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center bg-blue-50 rounded-lg px-3 py-2 border border-blue-100">
                <span className="text-lg font-bold text-blue-700 leading-none">
                  {toBengaliNumber(item.value)}
                </span>
                <span className="text-[10px] text-blue-600 font-medium mt-1">{item.label}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-linear-to-r from-amber-50 to-gray-50 border border-gray-200 rounded-xl py-3 px-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              {/* Winner - Top on mobile, left on desktop */}
              {winner && (
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">🏆</span>
                  <div>
                    <div className="text-xs text-amber-700 font-semibold">বিজয়ী</div>
                    <div className="text-base font-bold text-amber-900">
                      {toBengaliNumber(winner.phone_number.slice(0, 3))}
                      <span className="text-amber-600">****</span>
                      {toBengaliNumber(winner.phone_number.slice(-3))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Date - Bottom on mobile, right on desktop */}
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-semibold whitespace-nowrap">
                  {formatBengaliDate(endDate)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Total Votes */}
        <p className="text-2xl font-bold text-gray-900 text-center">
          {toBengaliNumber(animatedVoteCount)} ভোট
        </p>

        {creatorName && (
          <p className="text-xs text-gray-500 text-center">
            তৈরিঃ <span className="font-medium text-gray-700">{creatorName}</span>
          </p>
        )}

        <div className={`flex items-center ${isDetailPage ? 'justify-center' : 'justify-between'} gap-3`}>
          <ShareButton
            pollId={pollId}
            pollUid={pollUid}
            question={question}
            endDate={endDate}
            totalVotes={liveVoteCount}
            isEnded={status === 'ended'}
          />
          
          {!isDetailPage && (
            <motion.a
              href={`/poll/${pollUid || pollId}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center px-5 py-2.5 bg-purple-50 border border-purple-200 text-purple-600 hover:bg-purple-100 rounded-xl transition-all"
            >
              <LiaLongArrowAltRightSolid className="w-6 h-6" />
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
