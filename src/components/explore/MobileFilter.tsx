import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import caretDownIcon from '@/assets/caret-down.svg';
import closeIcon from '@/assets/close.svg';
import type { ExploreFilters, FilterSection } from '@/types/users/explore';
import { useProgramOptionsStore } from '@/store/useProgramOptionsStore';

interface MobileFilterProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ExploreFilters;
  onApplyFilters: (filters: ExploreFilters) => void;
}

const MobileFilter: React.FC<MobileFilterProps> = ({
  isOpen,
  onClose,
  filters: initialFilters,
  onApplyFilters,
}) => {
  const {
    locations,
    degrees,
    programs,
    durations,
    fees,
    fetchFilters,
    loading,
  } = useProgramOptionsStore();

  useEffect(() => {
    fetchFilters(initialFilters.location);
  }, [fetchFilters, initialFilters.location]);

  const filterSections: FilterSection[] = useMemo(() => {
    return [
      { id: 'location', label: 'Location', options: locations },
      { id: 'degrees', label: 'Degrees', options: degrees },
      { id: 'programs', label: 'Programs', options: programs },
      { id: 'duration', label: 'Duration', options: durations },
    ];
  }, [locations, degrees, programs, durations]);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'degrees',
  ]);
  const [localFilters, setLocalFilters] =
    useState<ExploreFilters>(initialFilters);

  useEffect(() => {
    fetchFilters(localFilters.location);
  }, [fetchFilters, localFilters.location]);

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

  const handleFilterChange = (
    sectionId: keyof ExploreFilters,
    value: string
  ) => {
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

  const handleLocationChange = (value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      location: value,
      tuitionRanges: value === prev.location ? prev.tuitionRanges : [],
    }));
  };

  const handleConfirm = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="border-top-2 bg-secondary fixed inset-0 z-40 flex flex-col rounded-[var(--border-radius-md)] sm:hidden">
      <div className="bg-secondary mt-[72px] px-6 py-8 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-h2 text-text-primary font-semibold">Filters</h2>
          <button
            onClick={onClose}
            className="bg-primary hover:bg-primary/90 flex h-8 w-8 items-center justify-center rounded-full transition-colors"
          >
            <img
              src={closeIcon}
              alt="Close"
              className="h-6 w-6 brightness-0 invert filter"
            />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-secondary flex-1 overflow-y-auto p-5">
        {filterSections?.map((section) => (
          <div key={section.id} className="mb-3">
            <button
              onClick={() => toggleSection(section.id)}
              className="flex w-full items-center justify-between rounded-[var(--border-radius-sm)] bg-white p-4"
            >
              <span className="text-body-1 text-text-primary font-semibold">
                {section.label}
              </span>
              <img
                src={caretDownIcon}
                alt=""
                className={`ml-2 h-6 w-6 flex-shrink-0 transition-transform ${
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
                      <label
                        key={option.value}
                        className="mb-3 flex items-center last:mb-0"
                      >
                        <input
                          type={section.id === 'location' ? 'radio' : 'checkbox'}
                          name={section.id === 'location' ? 'program-location' : undefined}
                          checked={
                            section.id === 'location'
                              ? localFilters.location === option.value
                              : (localFilters[section.id] as string[])?.includes(
                                  option.value
                                ) || false
                          }
                          onChange={() =>
                            section.id === 'location'
                              ? handleLocationChange(option.value)
                              : handleFilterChange(section.id, option.value)
                          }
                          className="text-primary focus:ring-primary mr-3 h-4 w-4 rounded border-gray-300"
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

        <div className="mb-3">
          <button
            onClick={() => toggleSection('tuition')}
            className="flex w-full items-center justify-between rounded-[var(--border-radius-sm)] bg-white p-4"
          >
            <span className="text-body-1 text-text-primary font-semibold whitespace-nowrap">
              Total Tuition Fees
            </span>
            <img
              src={caretDownIcon}
              alt=""
              className={`ml-2 h-6 w-6 flex-shrink-0 transition-transform ${
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
                  {!localFilters.location ? null : loading ? (
                    <p className="text-body-2 text-gray-500 px-1 py-1">
                      Loading fee ranges...
                    </p>
                  ) : fees.length > 0 ? (
                    <div className="space-y-3">
                      {fees.map((fee) => (
                        <label key={fee.value} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={
                              localFilters.tuitionRanges?.includes(fee.value) ||
                              false
                            }
                            onChange={() =>
                              handleFilterChange('tuitionRanges', fee.value)
                            }
                            className="text-primary focus:ring-primary mr-3 h-4 w-4 rounded border-gray-300"
                          />
                          <span className="text-body-2 text-text-primary">
                            {fee.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-body-2 text-gray-500 px-1 py-1">
                      No fee ranges available for this location.
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="bg-secondary p-5 shadow-lg">
        <button
          onClick={handleConfirm}
          className="bg-primary hover:bg-primary/90 font-roboto text-body-2 w-full rounded-[var(--border-radius-sm)] py-3 text-center text-white transition-colors"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default MobileFilter;
