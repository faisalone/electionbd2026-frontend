'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Search, Loader2, X, Brain, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AiSearchBar() {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<string[]>([]);
  const [isLoadingAutocomplete, setIsLoadingAutocomplete] = useState(false);
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
  const autocompleteTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    if (hasInteracted) {
      fetchSuggestions();
    }
  }, [hasInteracted]);

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

  // Live autocomplete as user types (Google-like)
  const fetchAutocomplete = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setAutocompleteSuggestions([]);
      return;
    }

    setIsLoadingAutocomplete(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ai/autocomplete?query=${encodeURIComponent(searchQuery)}`
      );
      if (res.ok) {
        const data = await res.json();
        setAutocompleteSuggestions(data.suggestions || []);
      }
    } catch (error) {
      console.error('Failed to fetch autocomplete:', error);
      setAutocompleteSuggestions([]);
    } finally {
      setIsLoadingAutocomplete(false);
    }
  };

  // Handle input change with debounced autocomplete
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);

    // Clear previous timer
    if (autocompleteTimerRef.current) {
      clearTimeout(autocompleteTimerRef.current);
    }

    // Debounce autocomplete API call (300ms)
    if (value.trim()) {
      autocompleteTimerRef.current = setTimeout(() => {
        fetchAutocomplete(value);
      }, 300);
    } else {
      setAutocompleteSuggestions([]);
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

  const handleSuggestionClick = async (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    
    // Auto-submit immediately - set query first, then submit
    setIsLoading(true);
    setAiResponse(null);
    setDisplayedResponse('');
    setDataFound({});
    setResults(null);
    setThinkingExpanded(false);
    setIsTyping(false);
    
    // Show thinking immediately with generic message
    setThinking('মামু ওয়েট, আমি বিশ্লেষণ করছি...');
    setTopics([]);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: suggestion.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        // Update thinking with actual AI analysis
        setThinking(data.thinking || 'মামু ওয়েট, আমি চিন্তা করছি...');
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
        <div className="bg-white shadow-lg rounded-[28px] p-2.5 relative border-2 border-gray-100">
          <div className="flex items-center gap-2 px-3 min-h-14">
            <div className="text-[#C8102E] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            
            <div className="flex-1 relative flex items-center">
              <textarea
                value={query}
                onChange={(e) => {
                  handleInputChange(e);
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
                onFocus={() => {
                  setHasInteracted(true);
                  setShowSuggestions(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="ভোটমামুকে জিজ্ঞেস করুন"
                rows={1}
                className="w-full bg-transparent outline-none text-base text-gray-900 placeholder:text-gray-400 placeholder:truncate resize-none overflow-hidden py-0"
                style={{ 
                  maxHeight: '200px',
                  lineHeight: '24px',
                  minHeight: '24px'
                }}
                disabled={isLoading}
              />
            </div>

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
              className="bg-black text-white p-2.5 rounded-full hover:opacity-70 disabled:opacity-30 transition-opacity shrink-0"
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

      {/* Live Autocomplete Dropdown (when typing) */}
      {hasInteracted && showSuggestions && query.trim() && autocompleteSuggestions.length > 0 && !aiResponse && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
        >
          {isLoadingAutocomplete && (
            <div className="px-6 py-3 text-gray-400 text-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              খুঁজছি...
            </div>
          )}
          {autocompleteSuggestions.map((suggestion, i) => (
            <button
              key={i}
              onClick={() => handleSuggestionClick(suggestion)}
              className="group w-full flex items-center gap-2 px-6 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors text-left"
            >
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-gray-700">{suggestion}</span>
            </button>
          ))}
        </motion.div>
      )}

      {/* Recent/Popular Suggestions Dropdown (when not typing) */}
      {hasInteracted && showSuggestions && !query.trim() && filtered.length > 0 && !aiResponse && (
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
              
              {/* Remove button - always visible (better for mobile) */}
              <button
                onClick={(e) => removeSuggestion(suggestion, e)}
                className="p-1.5 hover:bg-red-100 rounded-full transition-all shrink-0"
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
            {/* Main AI Response Card - Show First */}
            {aiResponse && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
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
