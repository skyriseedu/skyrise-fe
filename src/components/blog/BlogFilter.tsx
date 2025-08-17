import React, { useState, useRef, useEffect } from 'react';
import type { BlogCategory, BlogFilterProps } from '../../types/blog';
import CaretDown from '../../assets/caret-down.svg?react';

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
        className="text-h5 text-text-primary hover:text-primary flex min-w-[200px] items-center justify-start gap-3 rounded-full border-none bg-transparent px-4 py-2 font-semibold transition-colors"
      >
        <span>
          {categories.find((cat) => cat.value === selectedCategory)?.label ||
            selectedCategory}
        </span>

        <CaretDown
          className={`h-5 w-5 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="animate-in fade-in-0 zoom-in-95 absolute top-full left-0 z-50 mt-2 w-45 rounded-lg border border-gray-100 bg-white py-2 shadow-lg duration-200">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => handleCategorySelect(category.value)}
              className={`text-h5 block w-full px-4 py-2 text-left font-medium transition-colors ${
                selectedCategory === category.value
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-primary hover:bg-secondary hover:text-primary'
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
