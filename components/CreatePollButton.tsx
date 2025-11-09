'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle, Plus, ArrowRight, ArrowLeft } from 'lucide-react';

interface PollOption {
  id: string;
  text: string;
}

export default function CreatePollButton() {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<'title' | 'options' | 'details' | 'otp' | 'success'>('title');
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState<PollOption[]>([
    { id: '1', text: '' },
    { id: '2', text: '' }
  ]);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const resetForm = () => {
    setStep('title');
    setTitle('');
    setOptions([{ id: '1', text: '' }, { id: '2', text: '' }]);
    setName('');
    setPhone('');
    setOtp('');
    setOtpError('');
  };

  const handleTitleNext = () => {
    if (title.trim()) {
      setStep('options');
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], text: value };
    setOptions(newOptions);

    // Auto-add new empty option when user types in the last input
    if (index === options.length - 1 && value.trim()) {
      setOptions([...newOptions, { id: Date.now().toString(), text: '' }]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.filter(o => o.text.trim()).length > 2 && index < options.length - 1) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionsNext = () => {
    const filledOptions = options.filter(o => o.text.trim());
    if (filledOptions.length >= 2) {
      setStep('details');
    }
  };

  const handleDetailsNext = () => {
    if (name.trim() && phone.length >= 11) {
      setStep('otp');
    }
  };

  const handleVerifyOtp = () => {
    setIsVerifying(true);
    setOtpError('');
    
    setTimeout(() => {
      if (otp === '১২৩৪' || otp === '1234') {
        setStep('success');
        setTimeout(() => {
          setShowModal(false);
          resetForm();
        }, 2500);
      } else {
        setOtpError('ভুল OTP! আবার চেষ্টা করুন।');
      }
      setIsVerifying(false);
    }, 1500);
  };

  const filledOptions = options.filter(o => o.text.trim());

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 hover:scale-105"
      >
        <Plus className="w-5 h-5" />
        জরিপ তৈরি করুন
      </button>

      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
                {step !== 'success' && (
                  <>
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-linear-to-r from-blue-50 to-purple-50">
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900">নতুন জরিপ তৈরি করুন</h2>
                        {/* Progress Bar */}
                        <div className="flex items-center gap-2 mt-3">
                          {['title', 'options', 'details', 'otp'].map((s, i) => (
                            <div key={s} className="flex items-center">
                              <motion.div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                  step === s
                                    ? 'bg-blue-600 text-white'
                                    : ['title', 'options', 'details', 'otp'].indexOf(step) > i
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200 text-gray-500'
                                }`}
                                animate={{ scale: step === s ? [1, 1.2, 1] : 1 }}
                                transition={{ duration: 0.5 }}
                              >
                                {['title', 'options', 'details', 'otp'].indexOf(step) > i ? '✓' : i + 1}
                              </motion.div>
                              {i < 3 && (
                                <div
                                  className={`w-8 h-1 mx-1 rounded-full transition-all ${
                                    ['title', 'options', 'details', 'otp'].indexOf(step) > i
                                      ? 'bg-green-500'
                                      : 'bg-gray-200'
                                  }`}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      <motion.button
                        onClick={() => setShowModal(false)}
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 hover:bg-white rounded-full transition-colors"
                      >
                        <X className="w-6 h-6 text-gray-600" />
                      </motion.button>
                    </div>
                  </>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <AnimatePresence mode="wait">
                    {step === 'title' && (
                      <motion.div
                        key="title"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="space-y-6"
                      >
                        <div>
                          <label className="block text-lg font-bold text-gray-900 mb-3">
                            আপনার জরিপের প্রশ্ন কি?
                          </label>
                          <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleTitleNext()}
                            placeholder="উদাহরণ: আগামী নির্বাচনে কোন দল জিতবে?"
                            className="w-full px-5 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-lg"
                            autoFocus
                          />
                        </div>
                        <motion.button
                          onClick={handleTitleNext}
                          disabled={!title.trim()}
                          whileHover={{ scale: title.trim() ? 1.02 : 1 }}
                          whileTap={{ scale: title.trim() ? 0.98 : 1 }}
                          className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                            title.trim()
                              ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          এগিয়ে যান
                          <ArrowRight className="w-5 h-5" />
                        </motion.button>
                      </motion.div>
                    )}

                    {step === 'options' && (
                      <motion.div
                        key="options"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="space-y-4"
                      >
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            অপশন যোগ করুন (সর্বনিম্ন ২টি)
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">নতুন অপশনের জন্য স্বয়ংক্রিয়ভাবে নতুন ফিল্ড তৈরি হবে</p>
                        </div>

                        {/* Options Input Fields */}
                        <div className="space-y-3">
                          {options.map((option, index) => (
                            <motion.div
                              key={option.id}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="relative"
                            >
                              <input
                                type="text"
                                value={option.text}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`অপশন ${index + 1} লিখুন...`}
                                className="w-full px-5 py-4 pr-12 border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-lg"
                                autoFocus={index === 0}
                              />
                              {option.text && index >= 2 && index < options.length - 1 && (
                                <motion.button
                                  onClick={() => handleRemoveOption(index)}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                >
                                  <X className="w-5 h-5" />
                                </motion.button>
                              )}
                            </motion.div>
                          ))}
                        </div>

                        <div className="flex gap-3 pt-2">
                          <motion.button
                            onClick={() => setStep('title')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 py-4 rounded-xl font-bold text-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                          >
                            <ArrowLeft className="w-5 h-5" />
                            পেছনে
                          </motion.button>
                          <motion.button
                            onClick={handleOptionsNext}
                            disabled={filledOptions.length < 2}
                            whileHover={{ scale: filledOptions.length >= 2 ? 1.02 : 1 }}
                            whileTap={{ scale: filledOptions.length >= 2 ? 0.98 : 1 }}
                            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                              filledOptions.length >= 2
                                ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            এগিয়ে যান
                            <ArrowRight className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    {step === 'details' && (
                      <motion.div
                        key="details"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="space-y-5"
                      >
                        <h3 className="text-lg font-bold text-gray-900 mb-4">আপনার তথ্য</h3>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            নাম *
                          </label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="আপনার নাম লিখুন"
                            className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                            autoFocus
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            হোয়াটসঅ্যাপ নম্বর *
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="০১৭১২৩৪৫৬৭৮"
                            maxLength={11}
                            className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                          />
                        </div>

                        <div className="flex gap-3">
                          <motion.button
                            onClick={() => setStep('options')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 py-4 rounded-xl font-bold text-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                          >
                            <ArrowLeft className="w-5 h-5" />
                            পেছনে
                          </motion.button>
                          <motion.button
                            onClick={handleDetailsNext}
                            disabled={!name.trim() || phone.length < 11}
                            whileHover={{ scale: name.trim() && phone.length >= 11 ? 1.02 : 1 }}
                            whileTap={{ scale: name.trim() && phone.length >= 11 ? 0.98 : 1 }}
                            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                              name.trim() && phone.length >= 11
                                ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            এগিয়ে যান
                            <ArrowRight className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    {step === 'otp' && (
                      <motion.div
                        key="otp"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="space-y-6"
                      >
                        <div className="text-center">
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="w-20 h-20 bg-linear-to-br from-green-400 to-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl"
                          >
                            <CheckCircle className="w-12 h-12 text-white" />
                          </motion.div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">OTP যাচাই করুন</h3>
                          <p className="text-sm text-gray-600">
                            {phone} নম্বরে পাঠানো ৪ ডিজিটের কোড লিখুন
                          </p>
                        </div>

                        <div className="relative">
                          <input
                            type="text"
                            value={otp}
                            onChange={(e) => {
                              setOtp(e.target.value);
                              setOtpError('');
                            }}
                            onKeyPress={(e) => e.key === 'Enter' && otp.length >= 4 && !isVerifying && handleVerifyOtp()}
                            placeholder="১২৩৪"
                            className={`w-full px-4 pr-40 py-5 border-2 rounded-2xl focus:outline-none focus:ring-4 text-2xl font-bold text-center transition-all ${
                              otpError
                                ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                                : 'border-green-400 focus:border-green-500 focus:ring-green-100'
                            }`}
                            maxLength={4}
                            autoFocus
                          />
                          <motion.button
                            onClick={handleVerifyOtp}
                            disabled={otp.length < 4 || isVerifying}
                            whileHover={{ scale: otp.length >= 4 && !isVerifying ? 1.02 : 1 }}
                            whileTap={{ scale: otp.length >= 4 && !isVerifying ? 0.98 : 1 }}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-3 rounded-xl transition-all font-semibold text-sm whitespace-nowrap flex items-center gap-1.5 ${
                              otp.length >= 4 && !isVerifying
                                ? 'bg-linear-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {isVerifying ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                যাচাই...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                তৈরি করুন
                              </>
                            )}
                          </motion.button>
                        </div>

                        {otpError && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-3 bg-red-50 border-2 border-red-300 rounded-xl text-red-700 text-sm font-medium flex items-center gap-2"
                          >
                            <X className="w-5 h-5 shrink-0" />
                            {otpError}
                          </motion.div>
                        )}

                        <button
                          onClick={() => {
                            setStep('details');
                            setOtp('');
                            setOtpError('');
                          }}
                          className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          পেছনে যান
                        </button>
                      </motion.div>
                    )}

                    {step === 'success' && (
                      <motion.div
                        key="success"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="p-12 text-center"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                          transition={{ duration: 0.6 }}
                          className="w-32 h-32 bg-linear-to-br from-green-400 to-emerald-600 rounded-full mx-auto mb-8 flex items-center justify-center shadow-2xl"
                        >
                          <CheckCircle className="w-20 h-20 text-white" />
                        </motion.div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-3">সফলভাবে তৈরি হয়েছে!</h3>
                        <p className="text-lg text-gray-600">আপনার জরিপটি সফলভাবে প্রকাশিত হয়েছে</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
