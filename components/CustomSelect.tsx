'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Search } from 'lucide-react';
import { getImageUrl } from '@/lib/admin/api';

interface Option {
  value: string;
  label: string;
  icon?: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  variant?: 'light' | 'dark';
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  icon,
  className = '',
  variant = 'light',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Helper to render icon (either emoji or image URL)
  const renderIcon = (iconValue?: string) => {
    if (!iconValue) return null;
    
    // Check if it's an image URL (starts with / or http)
    if (iconValue.startsWith('/') || iconValue.startsWith('http')) {
      return (
        <img 
          src={getImageUrl(iconValue)} 
          alt="" 
          className="w-5 h-5 object-contain"
        />
      );
    }
    
    // Otherwise it's an emoji or text
    return <span>{iconValue}</span>;
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setSearchQuery('');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDropdown();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const filteredOptions = searchQuery 
    ? options.filter(opt => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : options;

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    closeDropdown();
  };

  const isDark = variant === 'dark';

  return (
    <div ref={containerRef} className="relative overflow-visible w-full" style={{ zIndex: isOpen ? 9999 : 'auto' }}>
      {/* Select Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
          }
        }}
        className={`
          relative w-full flex items-center justify-between gap-3
          px-4 py-3 rounded-lg
          border transition-all duration-200 outline-none
          ${className}
          ${
            isDark
              ? 'bg-gray-800 border-gray-700 text-white hover:border-gray-600'
              : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300'
          }
          ${
            isOpen
              ? isDark
                ? 'border-blue-500'
                : 'border-blue-500 ring-2 ring-blue-100'
              : ''
          }
        `}
      >
        {/* Icon */}
        {icon && (
          <span className={`shrink-0 transition-transform ${isOpen ? 'scale-110' : ''}`}>
            {icon}
          </span>
        )}

        {/* Selected Text */}
        <span className="flex-1 text-left text-sm font-medium truncate">
          {selectedOption ? (
            <span className="flex items-center gap-2">
              {renderIcon(selectedOption.icon)}
              {selectedOption.label}
            </span>
          ) : (
            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{placeholder}</span>
          )}
        </span>

        {/* Dropdown Arrow */}
        <ChevronDown
          className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          } ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{ zIndex: 9999 }}
            className={`
              absolute w-full mt-2 left-0
              rounded-lg shadow-xl
              border overflow-hidden
              ${
                isDark
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
              }
            `}
          >
            {/* Search Input - only show if 8+ options */}
            {options.length > 8 && (
              <div className={`p-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className={`
                      w-full pl-9 pr-3 py-2 rounded-lg text-sm
                      outline-none transition-all duration-200
                      ${
                        isDark
                          ? 'bg-gray-700 text-white placeholder-gray-400 focus:bg-gray-600'
                          : 'bg-gray-50 text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-100'
                      }
                    `}
                  />
                </div>
              </div>
            )}

            {/* Options List */}
            <div className="max-h-64 overflow-y-auto overflow-x-hidden custom-scrollbar">
              {filteredOptions.length > 0 ? (
                <div className="py-1">
                  {filteredOptions.map((option, index) => {
                    const isSelected = option.value === value;
                    return (
                      <motion.button
                        key={option.value}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        onClick={() => handleSelect(option.value)}
                        className={`
                          w-full flex items-center justify-between gap-3
                          px-4 py-3 text-left text-sm
                          transition-colors duration-150
                          ${
                            isSelected
                              ? isDark
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-50 text-blue-700'
                              : isDark
                              ? 'text-gray-200 hover:bg-gray-700'
                              : 'text-gray-700 hover:bg-gray-50'
                          }
                        `}
                      >
                        <span className="flex items-center gap-2 flex-1 truncate">
                          {renderIcon(option.icon)}
                          <span className="font-medium">{option.label}</span>
                        </span>
                        {isSelected && (
                          <Check className={`w-4 h-4 shrink-0 ${isDark ? 'text-white' : 'text-blue-600'}`} />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              ) : (
                <div className={`px-4 py-8 text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  No options found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
