import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import caretDownIcon from '@/assets/caret-down.svg';
import type {
  UniversityFilters,
  UniversityFilterSection,
} from '@/types/users/university-filters';

interface DesktopUniversityFilterProps {
  filters: UniversityFilters;
  onApplyFilters: (filters: UniversityFilters) => void;
  activeFiltersCount: number;
}

const universityFilterSections: UniversityFilterSection[] = [
  {
    id: 'universityType',
    label: 'University Type',
    options: [
      { label: 'Public', value: 'Public' },
      { label: 'Private', value: 'Private' },
    ],
  },
];

const DesktopUniversityFilter: React.FC<DesktopUniversityFilterProps> = ({
  filters,
  onApplyFilters,
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'universityType',
  ]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleFilterChange = (
    sectionId: keyof UniversityFilters,
    value: 'Public' | 'Private'
  ) => {
    const currentValues = filters[sectionId] as ('Public' | 'Private')[];
    const updatedValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    onApplyFilters({
      ...filters,
      [sectionId]: updatedValues,
    });
  };

  return (
    <div className="bg-secondary hidden h-[calc(100vh-140px)] w-80 flex-col lg:flex">
      <div className="flex-1 overflow-y-auto p-6">
        <h2 className="text-h3 text-text-primary mx-2 mb-4 font-semibold">
          Filters
        </h2>

        {/* Filter Sections */}
        <div className="space-y-3">
          {universityFilterSections.map((section) => (
            <div
              key={section.id}
              className="overflow-hidden rounded-lg bg-white"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-gray-50"
              >
                <span className="text-body-3 text-text-primary font-medium">
                  {section.label}
                </span>
                <img
                  src={caretDownIcon}
                  alt="caretDownIcon"
                  className={`h-4 w-4 transition-transform duration-200 ${
                    expandedSections?.includes(section.id) ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {expandedSections.includes(section.id) && section.options && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 bg-white px-4 pb-4">
                      {section.options.map((option) => (
                        <label
                          key={option.value}
                          className="flex cursor-pointer items-center gap-2 rounded p-2 transition-colors hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={
                              (
                                filters[section.id] as ('Public' | 'Private')[]
                              )?.includes(option.value) || false
                            }
                            onChange={() =>
                              handleFilterChange(section.id, option.value)
                            }
                            className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                          />
                          <span className="text-body-2 text-text-primary">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesktopUniversityFilter;
