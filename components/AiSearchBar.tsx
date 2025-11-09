'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Search } from 'lucide-react';
import { searchSuggestions } from '@/lib/mockData';

export default function AiSearchBar() {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      console.log('Search:', query);
      setShowSuggestions(false);
    }
  };

  const filtered = query.trim() 
    ? searchSuggestions.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    : searchSuggestions;

  return (
    <div ref={containerRef} className="w-full max-w-3xl mx-auto mb-16">
      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow-lg rounded-[28px] p-2.5">
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
            />

            <button
              type="submit"
              disabled={!query.trim()}
              className="bg-black text-white p-2.5 rounded-full hover:opacity-70 disabled:opacity-30 transition-opacity shrink-0 self-end mb-2"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>

      {showSuggestions && filtered.length > 0 && (
        <div className="mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {filtered.map((suggestion, i) => (
            <button
              key={i}
              onClick={() => {
                setQuery(suggestion);
                setShowSuggestions(false);
              }}
              className="w-full text-left px-6 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <span className="text-gray-700">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
