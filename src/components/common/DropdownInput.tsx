import React, { useState, useEffect, useRef } from 'react';
import CaretDown from '@/assets/caret-down.svg?react';
import CaretUp from '@/assets/caret-up.svg?react';

type Option = {
  value: string;
  label: string;
  disabled?: boolean;
};

type DropdownInputProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

const DropdownInput: React.FC<DropdownInputProps> = ({
  options,
  value,
  onChange,
  placeholder,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleSelectOption = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedLabel =
    options.find((option) => option.value === value)?.label || placeholder;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggleDropdown}
        className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-left focus:outline-none"
      >
        <span>{selectedLabel}</span>
        {isOpen ? (
          <CaretUp className="ml-2 h-4 w-4 text-gray-500" />
        ) : (
          <CaretDown className="ml-2 h-4 w-4 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`w-full px-3 py-2 text-left first:rounded-t-lg last:rounded-b-lg hover:bg-gray-100 ${
                value === option.value ? 'text-primary bg-secondary' : ''
              } ${option.disabled ? 'cursor-not-allowed opacity-50' : ''}`}
              onClick={() =>
                !option.disabled && handleSelectOption(option.value)
              }
              disabled={option.disabled}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownInput;
