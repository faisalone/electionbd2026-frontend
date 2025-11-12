'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Calendar, XCircle, Loader2, Send } from 'lucide-react';
import { LiaLongArrowAltRightSolid } from 'react-icons/lia';
import { toBengaliNumber, toEnglishNumber, formatBengaliDate } from '@/lib/utils';
import { api } from '@/lib/api';
import echo from '@/lib/echo';
import ShareButton from '@/components/ShareButton';

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
  const [votingStep, setVotingStep] = useState<'select' | 'phone' | 'otp'>('select');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [liveVoteCount, setLiveVoteCount] = useState(totalVotes);
  const [animatedVoteCount, setAnimatedVoteCount] = useState(totalVotes);

  // Sync live vote count
  useEffect(() => {
    setLiveVoteCount(totalVotes);
    setAnimatedVoteCount(totalVotes);
  }, [totalVotes]);

  // Animate number changes
  useEffect(() => {
    if (animatedVoteCount === liveVoteCount) return;

    const diff = liveVoteCount - animatedVoteCount;
    const step = diff > 0 ? 1 : -1;
    const duration = Math.min(Math.abs(diff) * 50, 1000); // Max 1 second
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
    });

    return () => {
      if (echo) {
        echo.leaveChannel(`poll.${pollId}`);
      }
    };
  }, [pollId]);

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

  // Restore vote from this browser session/localStorage so card remembers user's choice
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

  // no-op

  const handleOptionClick = (optionId: string) => {
    if (!voted && status === 'upcoming') {
      setSelectedOption(optionId);
      setVotingStep('phone');
      setPhoneNumber('');
      setOtp('');
      setOtpError('');
    }
  };

  const handlePhoneSubmit = async () => {
    // Convert Bengali numbers to English before validation
    const englishPhone = toEnglishNumber(phoneNumber);
    if (englishPhone.length >= 11) {
      setIsVerifying(true);
      try {
        await api.sendOTP({
          phone_number: englishPhone,
          purpose: 'poll_vote',
          poll_id: pollId,
        });
        setVotingStep('otp');
        setOtpError('');
      } catch (error) {
        setOtpError('OTP পাঠাতে ব্যর্থ। আবার চেষ্টা করুন।');
      } finally {
        setIsVerifying(false);
      }
    }
  };

  const handleOtpSubmit = async () => {
    if (!selectedOption) return;
    
    setIsVerifying(true);
    setOtpError('');
    
    try {
      // Convert Bengali numbers to English
      const englishPhone = toEnglishNumber(phoneNumber);
      const englishOtp = toEnglishNumber(otp);
      
      await api.votePoll(pollId, {
        option_id: parseInt(selectedOption),
        phone_number: englishPhone,
        otp_code: englishOtp,
      });
      
      // mark voted locally and remember selection for this session
      setVoted(true);
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(`poll_voted_${pollId}`, selectedOption);
          setRememberedVote(selectedOption);
        }
      } catch (e) {
        // ignore storage errors
      }
      setVotingStep('select');
      setLiveVoteCount(prev => prev + 1);
    } catch (error: any) {
      setOtpError(error.message || 'ভুল OTP! আবার চেষ্টা করুন।');
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
      className="group bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl hover:border-gray-200 transition-all duration-300 h-full flex flex-col"
    >
      <div className="p-6 flex-1 flex flex-col">
        {/* Countdown/Date Header */}
        {status === 'upcoming' ? (
          <div className="flex items-center justify-center gap-2 mb-6 pb-4 border-b border-gray-100">
            {[
              { value: timeLeft.days, label: 'দিন' },
              { value: timeLeft.hours, label: 'ঘণ্টা' },
              { value: timeLeft.minutes, label: 'মিনিট' },
              { value: timeLeft.seconds, label: 'সেকেন্ড' },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center bg-blue-50 rounded-lg px-3 py-2 border border-blue-200">
                <span className="text-lg font-bold text-blue-700 leading-none">
                  {toBengaliNumber(item.value)}
                </span>
                <span className="text-[10px] text-blue-600 font-medium mt-1">{item.label}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 mb-6 pb-4 border-b border-gray-100">
            <Calendar className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">
              {formatBengaliDate(endDate)}
            </span>
          </div>
        )}

        {/* Question */}
        <div className="mb-6">
          <div className="flex items-start gap-2">
            {status === 'upcoming' && (
              <div className="relative flex items-center justify-center w-4 h-4 mt-1 shrink-0">
                <div className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75"></div>
                <div className="relative w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
            )}
            {status === 'ended' && (
              <CheckCircle className="w-4 h-4 text-green-600 mt-1 shrink-0" />
            )}
            <h3 className="text-lg font-bold text-gray-900 leading-tight flex-1">{question}</h3>
          </div>
        </div>

        {/* Options */}
        <div className="mb-6">
          {(() => {
            const showResults = voted || status === 'ended';
            const isSelectionMode = !voted && status === 'upcoming';

            if (showResults) {
              return (
                <div className="space-y-3">
                  {options.map((option) => {
                    const percentage = getPercentage(option.votes);
                    const isRemembered = rememberedVote === option.id;
                    return (
                      <div key={option.id} className="w-full">
                        <div className={`relative overflow-hidden rounded-xl border bg-gray-50 ${isRemembered ? 'ring-2 ring-offset-2 ring-[#C8102E]/20 border-[#C8102E]' : 'border-gray-200'}`}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
                            className="absolute inset-0 opacity-20"
                            style={{ backgroundColor: option.color }}
                          />
                          <div className="relative z-10 py-4 px-4 flex items-center justify-between">
                            <span className="font-semibold text-gray-900 text-sm wrap-break-word whitespace-normal">
                              {option.text}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold" style={{ color: option.color }}>
                                {toBengaliNumber(percentage)}%
                              </span>
                              <span className="text-xs text-gray-500">
                                ({toBengaliNumber(option.votes)})
                              </span>
                              {isRemembered && (
                                <span className="ml-3 inline-flex items-center gap-1 text-xs bg-white/90 text-[#C8102E] px-2 py-1 rounded-full font-medium">
                                  <CheckCircle className="w-4 h-4" /> আপনি ভোট দিয়েছেন
                                </span>
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

            // Selection Mode: grid layout — try 2 columns, let very long options span full width.
            // single option: center it. three options: center third item without forcing full width.
            const gridContainerClasses = options.length === 1 ? 'grid-cols-1 justify-items-center' : 'grid-cols-2';
            return (
              <div className={`grid gap-3 ${gridContainerClasses}`}>
                {options.map((option, idx) => {
                  const isSelected = selectedOption === option.id;
                  // prefer full width if option text is long
                  const isLong = option.text.length > 80;
                  // if there are 3 options, put the third centered across both columns for nicer layout
                  const forceCenterThird = options.length === 3 && idx === 2;
                  const colSpanClass = isLong ? 'col-span-2' : 'col-span-1';
                  const selfAlignClass = forceCenterThird ? 'col-span-2 justify-self-center' : '';
                  // when item is single-column and not long, let width be auto so it wraps to content size
                  const sizeClass = isLong ? 'w-full' : (forceCenterThird ? 'w-auto max-w-[70%]' : 'w-auto');

                  return (
                    <motion.button
                      key={option.id}
                      onClick={() => handleOptionClick(option.id)}
                      disabled={!isSelectionMode}
                      whileHover={isSelectionMode ? { scale: 1.02 } : {}}
                      whileTap={isSelectionMode ? { scale: 0.98 } : {}}
                      className={`${colSpanClass} ${selfAlignClass} inline-flex ${sizeClass} text-left transition-all rounded-xl border px-4 py-3 text-sm font-semibold ${
                        isSelectionMode ? 'cursor-pointer' : 'cursor-default'
                      } ${isSelected ? 'text-white' : 'text-gray-900 bg-gray-50 border-gray-200 hover:border-gray-300'}`}
                      style={isSelected ? { backgroundColor: option.color, borderColor: option.color } : {}}
                    >
                      <span className={`whitespace-normal wrap-break-word` }>
                        {option.text}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            );
          })()}
        </div>

        {/* Voting Flow */}
        {selectedOption && !voted && status === 'upcoming' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-blue-50 rounded-2xl p-5 border-2 border-blue-200">
              <AnimatePresence mode="wait">
                <motion.div
                  key={votingStep}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  <div className="relative">
                    <input
                      type={votingStep === 'phone' ? 'tel' : 'text'}
                      value={votingStep === 'phone' ? phoneNumber : otp}
                      onChange={(e) => {
                        if (votingStep === 'phone') {
                          setPhoneNumber(e.target.value);
                        } else {
                          setOtp(e.target.value);
                          setOtpError('');
                        }
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          if (votingStep === 'phone' && phoneNumber.length >= 11) {
                            handlePhoneSubmit();
                          } else if (votingStep === 'otp' && otp.length >= 4) {
                            handleOtpSubmit();
                          }
                        }
                      }}
                      placeholder={votingStep === 'phone' ? 'হোয়াটসঅ্যাপ নাম্বার দিন' : 'OTP কোড দিন'}
                      className={`w-full px-4 pr-32 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 font-semibold transition-all text-center ${
                        otpError
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                          : votingStep === 'otp'
                          ? 'border-green-400 focus:border-green-500 focus:ring-green-100'
                          : 'border-blue-400 focus:border-blue-500 focus:ring-blue-100'
                      }`}
                      maxLength={votingStep === 'phone' ? 11 : 4}
                      autoFocus
                    />

                    <button
                      onClick={votingStep === 'phone' ? handlePhoneSubmit : handleOtpSubmit}
                      disabled={
                        (votingStep === 'phone' && toEnglishNumber(phoneNumber).length < 11) ||
                        (votingStep === 'otp' && (toEnglishNumber(otp).length < 4 || isVerifying))
                      }
                      className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${
                        (votingStep === 'phone' && toEnglishNumber(phoneNumber).length >= 11) ||
                        (votingStep === 'otp' && toEnglishNumber(otp).length >= 4 && !isVerifying)
                          ? votingStep === 'otp'
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : 'bg-[#25D366] hover:bg-[#1da851] text-white shadow-md'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isVerifying ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /><span>যাচাই...</span></>
                      ) : votingStep === 'otp' ? (
                        <><CheckCircle className="w-4 h-4" /><span>জমা দিন</span></>
                      ) : (
                        <><Send className="w-4 h-4" /><span>এগিয়ে যান</span></>
                      )}
                    </button>
                  </div>

                  {otpError && (
                    <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-medium flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      {otpError}
                    </div>
                  )}

                  {votingStep === 'otp' && (
                    <button
                      onClick={() => {
                        setVotingStep('phone');
                        setOtp('');
                        setOtpError('');
                      }}
                      className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      নম্বর পরিবর্তন করুন
                    </button>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Total Votes */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <p className="text-2xl font-bold text-gray-900 text-center mb-4">
            {toBengaliNumber(animatedVoteCount)} জন ভোট দিয়েছেন
          </p>
        </div>

        {/* Winner */}
        {status === 'ended' && winner && (
          <div className="mb-4">
            <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🏆</span>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-amber-700 mb-1">নির্বাচিত বিজয়ী</div>
                  <div className="text-lg font-bold text-amber-900">
                    {toBengaliNumber(winner.phone_number.slice(0, 3))}
                    <span className="text-amber-600">********</span>
                    {toBengaliNumber(winner.phone_number.slice(-3))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vote Success */}
        {voted && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">আপনার ভোট সফলভাবে জমা হয়েছে!</span>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 space-y-3 px-2">
          {creatorName && (
            <p className="text-xs text-gray-500 text-center">
              জরিপ তৈরি করেছেনঃ <span className="font-medium text-gray-700">{creatorName}</span>
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
                className="flex items-center justify-center px-6 py-2.5 bg-purple-50 border border-purple-200 text-purple-600 hover:bg-purple-100 hover:border-purple-300 rounded-lg transition-all shrink-0"
              >
                <LiaLongArrowAltRightSolid className="w-6 h-6" />
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
