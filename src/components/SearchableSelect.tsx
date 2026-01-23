import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface SearchableSelectProps {
  options: Array<{ id: number; name: string; slug: string }>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  detectedCategories?: string[];
  allowCustom?: boolean;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Search and select...',
  className = '',
  detectedCategories = [],
  allowCustom = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Get selected option
  const selectedOption = options.find((opt) => opt.slug === value);

  // Filter and prioritize options
  const filterAndSortOptions = () => {
    let filtered = options.filter((option) =>
      option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // If we have detected categories and search term is empty, prioritize them
    if (detectedCategories.length > 0 && !searchTerm) {
      const detected = filtered.filter(opt => 
        detectedCategories.some(detected => 
          opt.name.toLowerCase().includes(detected.toLowerCase())
        )
      );
      const others = filtered.filter(opt => 
        !detectedCategories.some(detected => 
          opt.name.toLowerCase().includes(detected.toLowerCase())
        )
      );
      return [...detected, ...others];
    }

    return filtered;
  };

  const filteredOptions = filterAndSortOptions();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement;
      if (item) {
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [highlightedIndex]);

  const handleSelect = (slug: string) => {
    onChange(slug);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setIsOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelect(filteredOptions[highlightedIndex].slug);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
      setHighlightedIndex(-1);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input Field */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : selectedOption?.name || ''}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-gray-200 pr-20"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X size={16} className="text-gray-500" />
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setIsOpen(!isOpen);
              if (!isOpen) {
                inputRef.current?.focus();
              }
            }}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ChevronDown
              size={20}
              className={`text-gray-500 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length > 0 ? (
            <ul ref={listRef} className="py-1">
              {filteredOptions.map((option, index) => {
                const isDetected = detectedCategories.length > 0 && 
                  detectedCategories.some(detected => 
                    option.name.toLowerCase().includes(detected.toLowerCase())
                  );
                return (
                  <li
                    key={option.id}
                    onClick={() => handleSelect(option.slug)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`px-4 py-2.5 cursor-pointer text-sm transition-colors ${
                      value === option.slug
                        ? 'bg-primary/10 text-primary font-medium'
                        : highlightedIndex === index
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isDetected && (
                        <span className="text-xs text-primary font-medium">✨</span>
                      )}
                      <span>{option.name}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              Loading categories...
            </div>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              {allowCustom && searchTerm ? (
                <div>
                  <p className="mb-2">No match found for "{searchTerm}"</p>
                  <button
                    type="button"
                    onClick={() => {
                      // Allow custom category creation
                      onChange(searchTerm);
                      setIsOpen(false);
                    }}
                    className="text-primary hover:underline font-medium"
                  >
                    Create "{searchTerm}"
                  </button>
                </div>
              ) : (
                'No categories found'
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}