import React, { useState, useRef, useEffect } from 'react';
import type { BlogCategory, BlogFilterProps } from '../../types/blog';

const BlogFilter: React.FC<BlogFilterProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories: { value: BlogCategory; label: string }[] = [
    { value: 'All Categories', label: 'All Categories' },
    { value: 'program', label: 'Program' },
    { value: 'university', label: 'University' },
    { value: 'visa', label: 'Visa' },
    { value: 'student reviews', label: 'Student Reviews' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCategorySelect = (category: BlogCategory) => {
    onCategoryChange(category);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-h4 text-text-primary hover:border-primary flex min-w-[200px] items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 font-medium shadow-sm transition-all duration-200 hover:shadow-md"
      >
        <span>
          Filter by:{' '}
          {categories.find((cat) => cat.value === selectedCategory)?.label ||
            selectedCategory}
        </span>
        <svg
          className={`h-4 w-4 transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m19 9-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full min-w-[200px] rounded-lg border border-gray-200 bg-white shadow-lg">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => handleCategorySelect(category.value)}
              className={`text-h4 block w-full px-4 py-3 text-left font-medium transition-colors first:rounded-t-lg last:rounded-b-lg hover:bg-gray-50 ${
                selectedCategory === category.value
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogFilter;
