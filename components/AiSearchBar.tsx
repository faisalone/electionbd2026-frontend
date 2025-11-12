'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Search, Loader2, X, Brain, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AiSearchBar() {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [displayedResponse, setDisplayedResponse] = useState('');
  const [thinking, setThinking] = useState<string | null>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [dataFound, setDataFound] = useState<Record<string, number>>({});
  const [results, setResults] = useState<any>(null);
  const [thinkingExpanded, setThinkingExpanded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Typing animation effect
  useEffect(() => {
    if (aiResponse && !isTyping) {
      setIsTyping(true);
      setDisplayedResponse('');
      let currentIndex = 0;
      
      const typingInterval = setInterval(() => {
        if (currentIndex < aiResponse.length) {
          setDisplayedResponse(aiResponse.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, 15); // 15ms per character for smooth typing
      
      return () => clearInterval(typingInterval);
    }
  }, [aiResponse]);

  // Load suggestions on mount and when input focuses
  useEffect(() => {
    fetchSuggestions();
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const fetchSuggestions = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/suggestions`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.suggestions || []);
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setShowSuggestions(false);
    setAiResponse(null);
    setDisplayedResponse('');
    setDataFound({});
    setResults(null);
    setThinkingExpanded(false);
    setIsTyping(false);
    
    // Show thinking immediately with generic message
    setThinking('আপনার প্রশ্ন বিশ্লেষণ করছি...');
    setTopics([]);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        // Update thinking with actual AI analysis
        setThinking(data.thinking || 'আপনার প্রশ্ন বিশ্লেষণ করছি...');
        setTopics(data.topics_identified || []);
        setDataFound(data.data_found || {});
        setResults(data.results);
        
        // Small delay before showing response for better UX
        setTimeout(() => {
          setAiResponse(data.response);
        }, 500);
        
        // Refresh suggestions after search
        fetchSuggestions();
      } else {
        setAiResponse(data.message || 'কিছু খুঁজে পাওয়া যায়নি, নির্বাচন সম্পর্কিত প্রশ্ন জিজ্ঞাসা করুন।');
      }
    } catch (error) {
      console.error('Search error:', error);
      setAiResponse('সার্ভার এরর হয়েছে, আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    // Auto-submit
    setTimeout(() => {
      handleSubmit();
    }, 100);
  };

  const removeSuggestion = async (suggestion: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the suggestion click
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/suggestions`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: suggestion }),
      });

      if (res.ok) {
        // Remove from local state immediately
        setSuggestions(prev => prev.filter(s => s !== suggestion));
      }
    } catch (error) {
      console.error('Failed to remove suggestion:', error);
    }
  };

  const filtered = query.trim() 
    ? suggestions.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    : suggestions;

  return (
    <div ref={containerRef} className="w-full max-w-3xl mx-auto mb-16">
      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow-lg rounded-[28px] p-2.5 relative">
          <div className="flex items-center gap-2 px-3 min-h-14">
            <div className="text-[#C8102E] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            
            <textarea
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
                if (!showSuggestions && e.target.value.trim()) {
                  setShowSuggestions(true);
                }
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="ভোটমামুকে জিজ্ঞেস করুন"
              rows={1}
              className="flex-1 bg-transparent outline-none text-base text-gray-900 placeholder-gray-400 resize-none overflow-hidden leading-normal py-3"
              style={{ maxHeight: '200px' }}
              disabled={isLoading}
            />

            {query && !isLoading && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setAiResponse(null);
                  setDisplayedResponse('');
                  setThinking(null);
                  setTopics([]);
                  setDataFound({});
                  setResults(null);
                  setThinkingExpanded(false);
                  setIsTyping(false);
                }}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="bg-black text-white p-2.5 rounded-full hover:opacity-70 disabled:opacity-30 transition-opacity shrink-0 self-end mb-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && filtered.length > 0 && !aiResponse && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
        >
          {filtered.map((suggestion, i) => (
            <div
              key={i}
              className="group w-full flex items-center justify-between gap-2 px-6 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <button
                onClick={() => handleSuggestionClick(suggestion)}
                className="flex-1 flex items-center gap-2 text-left"
              >
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-gray-700">{suggestion}</span>
              </button>
              
              {/* Remove button - only show on hover */}
              <button
                onClick={(e) => removeSuggestion(suggestion, e)}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 rounded-full transition-all shrink-0"
                title="সাজেশন সরান"
              >
                <X className="w-3.5 h-3.5 text-red-500" />
              </button>
            </div>
          ))}
        </motion.div>
      )}

      {/* AI Response */}
      <AnimatePresence>
        {(thinking || aiResponse) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 space-y-4"
          >
            {/* Thinking Process - Collapsible with shimmer during loading */}
            {thinking && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className={`relative overflow-hidden border rounded-2xl transition-all duration-300 ${
                  isLoading
                    ? 'bg-linear-to-r from-amber-50 via-amber-100 to-amber-50 bg-size-[200%_100%] animate-shimmer border-amber-300 shadow-lg shadow-amber-200/50'
                    : 'bg-amber-50 border-amber-200'
                }`}
              >
                {/* Shimmer effect during loading */}
                {isLoading && (
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent animate-shimmer-sweep" />
                )}
                
                <div className="relative">
                  {/* Collapsed Header */}
                  <button
                    onClick={() => setThinkingExpanded(!thinkingExpanded)}
                    className="w-full p-4 flex items-center gap-3 hover:bg-amber-100/30 transition-colors"
                  >
                    <div className={`p-1.5 rounded-lg shrink-0 transition-all ${
                      isLoading ? 'bg-amber-200 animate-pulse' : 'bg-amber-100'
                    }`}>
                      <Brain className={`w-4 h-4 text-amber-600 ${isLoading ? 'animate-bounce' : ''}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm text-amber-800 font-medium flex items-center gap-2">
                        {isLoading ? (
                          <>
                            <span className="inline-block w-1.5 h-1.5 bg-amber-600 rounded-full animate-ping" />
                            মামু ওয়েট, চিন্তা করছি...
                          </>
                        ) : (
                          'চিন্তা প্রক্রিয়া'
                        )}
                      </p>
                    </div>
                    <div className="shrink-0">
                      {thinkingExpanded ? (
                        <ChevronUp className="w-5 h-5 text-amber-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-amber-600" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {thinkingExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 space-y-3 border-t border-amber-200/50 pt-3">
                          {/* Thinking Message */}
                          <p className="text-sm text-amber-700 leading-relaxed">
                            {thinking}
                          </p>
                          
                          {/* Topics inside thinking box */}
                          {topics.length > 0 && (
                            <div className="pt-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                                  <Tag className="w-3.5 h-3.5" />
                                  <span>বিষয়:</span>
                                </div>
                                {topics.map((topic, i) => (
                                  <motion.span
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="inline-flex items-center gap-1 text-xs bg-amber-200/60 text-amber-800 px-2.5 py-1 rounded-full border border-amber-300"
                                  >
                                    {topic}
                                  </motion.span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* Main AI Response with typing effect */}
            {aiResponse && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 shadow-lg border border-blue-100"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-full shadow-sm shrink-0">
                    <Sparkles className="w-5 h-5 text-[#C8102E]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-3">ভোটমামুর উত্তর:</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {displayedResponse}
                      {isTyping && (
                        <span className="inline-block w-0.5 h-5 bg-gray-700 ml-0.5 animate-blink" />
                      )}
                    </p>
                    
                    {/* Data Found Summary - only show when typing is complete */}
                    {!isTyping && Object.keys(dataFound).length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-5 pt-4 border-t border-blue-200"
                      >
                        <p className="text-xs text-gray-500 mb-2 font-medium">পাওয়া তথ্য:</p>
                        <div className="flex flex-wrap gap-2">
                          {dataFound.candidates && (
                            <span className="inline-flex items-center gap-1.5 text-xs bg-white/80 px-3 py-1.5 rounded-full text-gray-700 border border-blue-100">
                              <span className="text-base">👤</span>
                              <span className="font-medium">{dataFound.candidates}</span> প্রার্থী
                            </span>
                          )}
                          {dataFound.parties && (
                            <span className="inline-flex items-center gap-1.5 text-xs bg-white/80 px-3 py-1.5 rounded-full text-gray-700 border border-blue-100">
                              <span className="text-base">🏛️</span>
                              <span className="font-medium">{dataFound.parties}</span> দল
                            </span>
                          )}
                          {dataFound.news && (
                            <span className="inline-flex items-center gap-1.5 text-xs bg-white/80 px-3 py-1.5 rounded-full text-gray-700 border border-blue-100">
                              <span className="text-base">📰</span>
                              <span className="font-medium">{dataFound.news}</span> খবর
                            </span>
                          )}
                          {dataFound.polls && (
                            <span className="inline-flex items-center gap-1.5 text-xs bg-white/80 px-3 py-1.5 rounded-full text-gray-700 border border-blue-100">
                              <span className="text-base">📊</span>
                              <span className="font-medium">{dataFound.polls}</span> পোল
                            </span>
                          )}
                          {dataFound.seats && (
                            <span className="inline-flex items-center gap-1.5 text-xs bg-white/80 px-3 py-1.5 rounded-full text-gray-700 border border-blue-100">
                              <span className="text-base">🪑</span>
                              <span className="font-medium">{dataFound.seats}</span> আসন
                            </span>
                          )}
                          {dataFound.timeline && (
                            <span className="inline-flex items-center gap-1.5 text-xs bg-white/80 px-3 py-1.5 rounded-full text-gray-700 border border-blue-100">
                              <span className="text-base">📅</span>
                              <span className="font-medium">{dataFound.timeline}</span> সময়সূচী
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
