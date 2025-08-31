import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface FilterContextType {
  isMobileFilterOpen: boolean;
  setIsMobileFilterOpen: (isOpen: boolean) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  return (
    <FilterContext.Provider value={{ isMobileFilterOpen, setIsMobileFilterOpen }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};