'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, CheckCircle, Clock, Calendar, XCircle, Phone, X, Loader2, Send } from 'lucide-react';
import { toBengaliNumber, formatBengaliDate } from '@/lib/utils';

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
  endDate: string;
  status: 'upcoming' | 'ended';
  winnerPhone?: string;
}

export default function PollCard({ question, creatorName, options, totalVotes, pollId, endDate, status, winnerPhone }: PollCardProps) {
  const [voted, setVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [votingStep, setVotingStep] = useState<'select' | 'phone' | 'otp' | 'success'>('select');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

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

  const handleOptionClick = (optionId: string) => {
    if (!voted && status === 'upcoming') {
      setSelectedOption(optionId);
      setVotingStep('phone');
      setPhoneNumber('');
      setOtp('');
      setOtpError('');
    }
  };

  const handlePhoneSubmit = () => {
    if (phoneNumber.length >= 11) {
      // Simulate sending OTP via WhatsApp
      setVotingStep('otp');
      setOtpError('');
    }
  };

  const handleOtpSubmit = () => {
    setIsVerifying(true);
    setOtpError('');
    
    // Simulate OTP verification (in real app, this would be an API call)
    setTimeout(() => {
      // For demo, accept "1234" as correct OTP
      if (otp === '১২৩৪' || otp === '1234') {
        setVoted(true);
        setVotingStep('success');
      } else {
        setOtpError('ভুল OTP! আবার চেষ্টা করুন।');
      }
      setIsVerifying(false);
    }, 1500);
  };

  const handleCancel = () => {
    setVotingStep('select');
    setSelectedOption(null);
    setPhoneNumber('');
    setOtp('');
    setOtpError('');
  };

  const getPercentage = (votes: number) => {
    return ((votes / totalVotes) * 100).toFixed(1);
  };



  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition-shadow duration-300 flex flex-col min-h-[450px]"
    >
      {/* Main Content */}
      <div className="flex-1">
        {/* Status and Timer Header */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
        {/* Status Badge */}
        {status === 'upcoming' ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full border border-red-200 h-9">
            <div className="relative flex items-center justify-center w-4 h-4">
              {/* Live Pulsing Rings */}
              <div className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75"></div>
              <div className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full animate-pulse opacity-50"></div>
              {/* Center solid circle */}
              <div className="relative w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
            <span className="text-sm font-semibold text-red-700">লাইভ</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200 h-9">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700">সম্পন্ন</span>
          </div>
        )}

        {/* Countdown Timer or End Date */}
        {status === 'upcoming' ? (
          <div className="flex items-center gap-1 bg-linear-to-r from-blue-50 to-purple-50 rounded-full px-3 py-2 border border-blue-200 h-9">
            {[
              { value: timeLeft.days, label: 'দিন' },
              { value: timeLeft.hours, label: 'ঘণ্টা' },
              { value: timeLeft.minutes, label: 'মিনিট' },
              { value: timeLeft.seconds, label: 'সেকেন্ড' },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-0.5">
                {index > 0 && <span className="text-blue-400 mx-0.5 text-sm">:</span>}
                <span className="text-sm font-bold text-blue-700">
                  {toBengaliNumber(item.value)}
                </span>
                <span className="text-sm text-blue-600 font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-200 h-9">
            <Calendar className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">
              {formatBengaliDate(endDate)}
            </span>
          </div>
        )}
      </div>

      {/* Poll Question - Full Width */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 leading-tight">{question}</h3>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option) => {
          const percentage = getPercentage(option.votes);
          const isSelected = selectedOption === option.id;
          const showResults = voted || status === 'ended';

          return (
            <motion.button
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              disabled={voted || status === 'ended'}
              whileHover={!voted && status === 'upcoming' ? { scale: 1.01, x: 4 } : {}}
              whileTap={!voted && status === 'upcoming' ? { scale: 0.99 } : {}}
              className={`w-full text-left transition-all rounded-xl ${
                !voted && status === 'upcoming'
                  ? 'cursor-pointer hover:shadow-lg border-2 hover:border-blue-200' 
                  : 'cursor-default border-2 border-transparent'
              } ${
                isSelected && !showResults && status === 'upcoming'
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-transparent'
              }`}
            >
              <div className={`relative overflow-hidden rounded-xl border ${
                isSelected && !showResults && status === 'upcoming'
                  ? 'bg-blue-50 border-blue-300'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                {/* Progress Bar */}
                {showResults && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
                    className="absolute inset-0 opacity-20"
                    style={{ backgroundColor: option.color }}
                  />
                )}
                
                {/* Content */}
                <div className="relative z-10 py-4 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {/* Radio/Check indicator */}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      isSelected && showResults
                        ? 'border-blue-600 bg-blue-600' 
                        : !showResults 
                        ? 'border-gray-300 hover:border-blue-400'
                        : 'border-gray-300'
                    }`}>
                      {isSelected && showResults && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                        >
                          <CheckCircle className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </div>
                    
                    <span className="font-semibold text-gray-900 text-sm">
                      {option.text}
                    </span>
                  </div>

                  {/* Percentage Display */}
                  {showResults && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-xl font-bold" style={{ color: option.color }}>
                        {toBengaliNumber(percentage)}%
                      </span>
                      <span className="text-xs text-gray-500">
                        ({toBengaliNumber(option.votes)})
                      </span>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Seamless Voting Flow */}
      {selectedOption && !voted && status === 'upcoming' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="mt-6 overflow-hidden"
        >
          <div className="bg-blue-50 rounded-2xl p-5 border-2 border-blue-200">

            <AnimatePresence mode="wait">
              <motion.div
                key={votingStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {/* Input field with inline button */}
                <div className="relative">
                  <motion.input
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
                        } else if (votingStep === 'otp' && otp.length >= 4 && !isVerifying) {
                          handleOtpSubmit();
                        }
                      }
                    }}
                    placeholder={votingStep === 'phone' ? 'হোয়াটসঅ্যাপ নাম্বার দিন' : votingStep === 'otp' ? 'OTP কোড দিন' : ''}
                    className={`w-full px-4 ${votingStep === 'otp' ? 'pr-40' : 'pr-32'} py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 font-semibold transition-all ${
                      otpError
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100 text-base'
                        : votingStep === 'otp'
                        ? 'border-green-400 focus:border-green-500 focus:ring-green-100 text-base'
                        : 'border-blue-400 focus:border-blue-500 focus:ring-blue-100 text-base'
                    } text-center`}
                    maxLength={votingStep === 'phone' ? 11 : 4}
                    autoFocus
                  />

                  {/* Inline Submit Button */}
                  <motion.button
                    onClick={votingStep === 'phone' ? handlePhoneSubmit : handleOtpSubmit}
                    disabled={
                      (votingStep === 'phone' && phoneNumber.length < 11) ||
                      (votingStep === 'otp' && (otp.length < 4 || isVerifying))
                    }
                    whileHover={{
                      scale:
                        (votingStep === 'phone' && phoneNumber.length >= 11) ||
                        (votingStep === 'otp' && otp.length >= 4 && !isVerifying)
                          ? 1.02
                          : 1,
                    }}
                    whileTap={{
                      scale:
                        (votingStep === 'phone' && phoneNumber.length >= 11) ||
                        (votingStep === 'otp' && otp.length >= 4 && !isVerifying)
                          ? 0.98
                          : 1,
                    }}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl transition-all font-semibold text-sm whitespace-nowrap flex items-center gap-1.5 ${
                      (votingStep === 'phone' && phoneNumber.length >= 11) ||
                      (votingStep === 'otp' && otp.length >= 4 && !isVerifying)
                        ? votingStep === 'otp'
                          ? 'bg-linear-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                          : 'bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>যাচাই...</span>
                      </>
                    ) : votingStep === 'otp' ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>ভোট জমা দিন</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>এগিয়ে যান</span>
                      </>
                    )}
                  </motion.button>
                </div>

                {otpError && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-medium flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4 shrink-0" />
                    {otpError}
                  </motion.div>
                )}

                {votingStep === 'otp' && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => {
                      setVotingStep('phone');
                      setOtp('');
                      setOtpError('');
                    }}
                    className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    নম্বর পরিবর্তন করুন
                  </motion.button>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Total Votes */}
      <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">মোট ভোটার</span>
        </div>
        <span className="text-lg font-bold text-gray-900">
          {toBengaliNumber(totalVotes)}
        </span>
      </div>

      {/* Winner Display for Ended Polls */}
      {status === 'ended' && winnerPhone && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4"
        >
          {/* Winner Badge */}
          <div className="bg-linear-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                className="text-3xl"
              >
                🏆
              </motion.div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-amber-700 mb-1">নির্বাচিত বিজয়ী</div>
                <div className="text-lg font-bold text-amber-900">
                  {toBengaliNumber(winnerPhone.slice(0, 3))}
                  <span className="text-amber-600">********</span>
                  {toBengaliNumber(winnerPhone.slice(-3))}
                </div>
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-3 h-3 bg-amber-500 rounded-full shadow-lg"
              />
            </div>
          </div>
        </motion.div>
      )}

        {/* Vote Status */}
        {voted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">আপনার ভোট সফলভাবে জমা হয়েছে!</span>
          </motion.div>
        )}
      </div>

      {/* Creator Name - Always at bottom */}
      {creatorName && (
        <div className="mt-auto pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            জরিপ তৈরি করেছেনঃ <span className="font-medium text-gray-700">{creatorName}</span>
          </p>
        </div>
      )}
    </motion.div>
  );
}
