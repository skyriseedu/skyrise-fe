import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import caretDownIcon from '@/assets/caret-down.svg';
import Button from '@/components/common/Button';
import type { ExploreFilters, FilterSection } from '@/types/users/explore';

interface DesktopFilterDropdownProps {
  filters: ExploreFilters;
  onApplyFilters: (filters: ExploreFilters) => void;
  activeFiltersCount: number;
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

const DesktopFilterDropdown: React.FC<DesktopFilterDropdownProps> = ({
  filters: initialFilters,
  onApplyFilters,
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'degrees',
    'programs',
    'duration',
    'tuition',
  ]);
  const [localFilters, setLocalFilters] =
    useState<ExploreFilters>(initialFilters);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleFilterChange = (
    sectionId: keyof ExploreFilters,
    value: string
  ) => {
    setLocalFilters((prev) => {
      const currentValues = prev[sectionId] as string[];
      const updatedValues = currentValues.includes(value)
        ? currentValues?.filter((v) => v !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [sectionId]: updatedValues,
      };
    });
  };

  const handleConfirm = () => {
    onApplyFilters(localFilters);
  };

  return (
    <div className="bg-secondary hidden h-[calc(100vh-140px)] w-80 flex-col lg:flex">
      <div className="flex-1 overflow-y-auto p-6">
        <h2 className="text-h3 text-text-primary mx-2 mb-4 font-semibold">
          Filters
        </h2>

        {/* Filter Sections */}
        <div className="space-y-3">
          {filterSections.map((section) => (
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
                              (localFilters[section.id] as string[])?.includes(
                                option.value
                              ) || false
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

          <div className="overflow-hidden rounded-lg bg-white">
            <button
              onClick={() => toggleSection('tuition')}
              className="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-gray-50"
            >
              <span className="text-body-3 text-text-primary font-medium">
                Total Tuition Fees
              </span>
              <img
                src={caretDownIcon}
                alt=""
                className={`h-4 w-4 transition-transform duration-200 ${
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
                  <div className="space-y-3 bg-white px-4 pb-4">
                    <label className="flex cursor-pointer items-center gap-2 rounded p-2 transition-colors hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={
                          localFilters.tuitionRanges?.includes('0-200000') ||
                          false
                        }
                        onChange={() =>
                          handleFilterChange('tuitionRanges', '0-200000')
                        }
                        className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                      />
                      <span className="text-body-2 text-text-primary">
                        0 - 200,000 THB
                      </span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 rounded p-2 transition-colors hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={
                          localFilters.tuitionRanges?.includes(
                            '200000-400000'
                          ) || false
                        }
                        onChange={() =>
                          handleFilterChange('tuitionRanges', '200000-400000')
                        }
                        className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                      />
                      <span className="text-body-2 text-text-primary">
                        200,000 - 400,000 THB
                      </span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 rounded p-2 transition-colors hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={
                          localFilters.tuitionRanges?.includes(
                            '400000-600000'
                          ) || false
                        }
                        onChange={() =>
                          handleFilterChange('tuitionRanges', '400000-600000')
                        }
                        className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                      />
                      <span className="text-body-3 text-text-primary">
                        400,000 - 600,000 THB
                      </span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 rounded p-2 transition-colors hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={
                          localFilters.tuitionRanges?.includes(
                            '600000-800000'
                          ) || false
                        }
                        onChange={() =>
                          handleFilterChange('tuitionRanges', '600000-800000')
                        }
                        className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                      />
                      <span className="text-body-3 text-text-primary">
                        600,000 - 800,000 THB
                      </span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 rounded p-2 transition-colors hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={
                          localFilters.tuitionRanges?.includes('800000+') ||
                          false
                        }
                        onChange={() =>
                          handleFilterChange('tuitionRanges', '800000+')
                        }
                        className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                      />
                      <span className="text-body-3 text-text-primary">
                        800,000+ THB
                      </span>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="p-6 pt-4">
        <Button onClick={handleConfirm} size="lg" primary className="w-full">
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default DesktopFilterDropdown;
