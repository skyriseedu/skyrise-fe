import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import caretDown from '@/assets/caret-down.svg';
import type { ProgramStructureItem } from '@/types/users/program';

const ProgramStructure: React.FC = () => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const accordionData: ProgramStructureItem[] = [
    {
      id: 'credit',
      title: 'Total Credit Requirement',
      content:
        'The program requires a total of 120 credits to graduate. This includes core courses (60 credits), major electives (30 credits), general education courses (24 credits), and free electives (6 credits).',
    },
    {
      id: 'requirements',
      title: 'Undergraduate Entry Requirements',
      content:
        'Applicants must have completed high school with a minimum GPA of 2.5. English proficiency (TOEFL 550 or IELTS 6.0) is required. Additional requirements include official transcripts, recommendation letters, and a personal statement.',
    },
    {
      id: 'career',
      title: 'Career Paths',
      content:
        'Graduates can pursue careers as Software Developers, Web Designers, Database Administrators, Network Engineers, IT Consultants, System Analysts, or pursue further studies in specialized ICT fields.',
    },
  ];

  const toggleItem = (id: string) => {
    setOpenItems((prevItems) =>
      prevItems.includes(id)
        ? prevItems.filter((item) => item !== id)
        : [...prevItems, id]
    );
  };

  return (
    <div className="py-10">
      <h2 className="text-h3 lg:text-h2 text-text-primary mb-8 font-semibold">
        Program Structure
      </h2>
      <div className="space-y-3">
        {accordionData?.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="border-b border-gray-100 last:border-0"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="flex w-full cursor-pointer items-start bg-white py-4"
            >
              <div className="flex items-center gap-2">
                <span className="text-body-2 lg:text-body-2 text-text-primary font-medium">
                  {item.title}
                </span>
                <motion.img
                  src={caretDown}
                  alt="Toggle"
                  className="h-5 w-5"
                  animate={{ rotate: openItems.includes(item.id) ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                />
              </div>
            </button>
            <AnimatePresence initial={false}>
              {openItems?.includes(item.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: 0.3, ease: 'easeInOut' },
                    opacity: { duration: 0.3, ease: 'easeInOut' },
                  }}
                  className="overflow-hidden"
                >
                  <motion.div
                    className="pb-4"
                    initial={{ y: -10 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <p className="text-body-3 lg:text-body-3 text-text-secondary">
                      {item.content}
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProgramStructure;
