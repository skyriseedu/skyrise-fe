import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import caretDownIcon from '@/assets/caret-down.svg';
import closeIcon from '@/assets/close.svg';
import type { ExploreFilters, FilterSection } from '@/types/users/explore';

interface MobileFilterProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ExploreFilters;
  onApplyFilters: (filters: ExploreFilters) => void;
}

const filterSections: FilterSection[] = [
  {
    id: 'degrees',
    label: 'Degrees',
    options: [
      { label: 'Bachelor', value: 'bachelor' },
      { label: 'Master', value: 'master' },
      { label: 'PhD', value: 'phd' },
    ],
  },
  {
    id: 'programs',
    label: 'Programs',
    options: [
      { label: 'Information Technology', value: 'it' },
      { label: 'Business Administration', value: 'business' },
      { label: 'Engineering', value: 'engineering' },
      { label: 'Medicine', value: 'medicine' },
    ],
  },
  {
    id: 'duration',
    label: 'Duration',
    options: [
      { label: '1 year', value: '1' },
      { label: '2 years', value: '2' },
      { label: '3 years', value: '3' },
      { label: '4 years', value: '4' },
      { label: '5+ years', value: '5+' },
    ],
  },
];

const MobileFilter: React.FC<MobileFilterProps> = ({
  isOpen,
  onClose,
  filters: initialFilters,
  onApplyFilters,
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [localFilters, setLocalFilters] = useState<ExploreFilters>(initialFilters);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleFilterChange = (sectionId: keyof ExploreFilters, value: string) => {
    setLocalFilters((prev) => {
      const currentValues = prev[sectionId] as string[];
      const updatedValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [sectionId]: updatedValues,
      };
    });
  };

  const handleConfirm = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed rounded-[var(--border-radius-md)] inset-0 z-40 bg-secondary sm:hidden flex flex-col">
      <div className="bg-secondary px-6 py-8 shadow-sm mt-[72px]">
        <div className="flex items-center justify-between">
          <h2 className="text-h2 font-semibold  text-text-primary">Filters</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary hover:bg-primary/90 transition-colors"
          >
            <img src={closeIcon} alt="Close" className="h-6 w-6 filter brightness-0 invert" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 bg-secondary">
        {filterSections?.map((section) => (
          <div key={section.id} className="mb-3">
            <button
              onClick={() => toggleSection(section.id)}
              className="flex w-full items-center justify-between rounded-[var(--border-radius-sm)] bg-white p-4"
            >
              <span className="text-body-1 font-semibold  text-text-primary">{section.label}</span>
              <img
                src={caretDownIcon}
                alt=""
                className={`h-6 w-6 ml-2 flex-shrink-0 transition-transform ${
                  expandedSections.includes(section.id) ? 'rotate-180' : ''
                }`}
              />
            </button>
            <AnimatePresence>
              {expandedSections?.includes(section.id) && section.options && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 rounded-[var(--border-radius-sm)] bg-white p-4">
                    {section.options?.map((option) => (
                  <label key={option.value} className="mb-3 flex items-center last:mb-0">
                    <input
                      type="checkbox"
                      checked={(localFilters[section.id] as string[])?.includes(option.value) || false}
                      onChange={() => handleFilterChange(section.id, option.value)}
                      className="mr-3 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-body-2 text-text-primary">{option.label}</span>
                    </label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        <div className="mb-3">
          <button
            onClick={() => toggleSection('tuition')}
            className="flex w-full items-center justify-between rounded-[var(--border-radius-sm)] bg-white p-4"
          >
            <span className="text-body-1 font-semibold text-text-primary whitespace-nowrap">Total Tuition Fees</span>
            <img
              src={caretDownIcon}
              alt=""
              className={`h-6 w-6 ml-2 flex-shrink-0 transition-transform ${
                expandedSections.includes('tuition') ? 'rotate-180' : ''
              }`}
            />
          </button>
          <AnimatePresence>
            {expandedSections.includes('tuition') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="mt-2 rounded-[var(--border-radius-sm)] bg-white p-4">
                  <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.tuitionRanges?.includes('0-200000') || false}
                    onChange={() => handleFilterChange('tuitionRanges', '0-200000')}
                    className="mr-3 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-body-2  text-text-primary">0 - 200,000 THB</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.tuitionRanges?.includes('200000-400000') || false}
                    onChange={() => handleFilterChange('tuitionRanges', '200000-400000')}
                    className="mr-3 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-body-2  text-text-primary">200,000 - 400,000 THB</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.tuitionRanges?.includes('400000-600000') || false}
                    onChange={() => handleFilterChange('tuitionRanges', '400000-600000')}
                    className="mr-3 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-body-2  text-text-primary">400,000 - 600,000 THB</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.tuitionRanges?.includes('600000-800000') || false}
                    onChange={() => handleFilterChange('tuitionRanges', '600000-800000')}
                    className="mr-3 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-body-2  text-text-primary">600,000 - 800,000 THB</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.tuitionRanges?.includes('800000+') || false}
                    onChange={() => handleFilterChange('tuitionRanges', '800000+')}
                    className="mr-3 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-body-2 text-text-primary">800,000+ THB</span>
                </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="bg-secondary p-5 shadow-lg">
        <button
          onClick={handleConfirm}
          className="w-full rounded-[var(--border-radius-sm)] bg-primary hover:bg-primary/90 py-3 text-center text-white font-roboto text-body-2 transition-colors"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default MobileFilter;