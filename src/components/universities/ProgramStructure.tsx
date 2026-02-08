import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import caretDown from '@/assets/caret-down.svg';
import type { ProgramStructureItem } from '@/types/users/program';
import '@/components/common/TextEditor/QuillContent.css';

interface ProgramStructureProps {
  engFoundation?: string;
  bachelorRequirements?: string;
  masterRequirements?: string;
  entryRequirements?: string;
  scholarRequirements?: string;
}

const ProgramStructure: React.FC<ProgramStructureProps> = ({
  engFoundation,
  bachelorRequirements,
  masterRequirements,
  entryRequirements,
  scholarRequirements,
}) => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const accordionData: ProgramStructureItem[] = [
    {
      id: 'eng-foundation',
      title: 'English Foundation',
      content: engFoundation || 'No Information Available',
    },
    {
      id: 'bachelor-requirements',
      title: 'Bachelor',
      content: bachelorRequirements || 'No Information Available',
    },
    {
      id: 'master-requirements',
      title: 'Master',
      content: masterRequirements || 'No Information Available',
    },
    {
      id: 'entry-requirements',
      title: 'Entry Requirements',
      content: entryRequirements || 'No Information Available',
    },
    {
      id: 'scholar-requirements',
      title: 'Scholarships Requirements',
      content: scholarRequirements || 'No Information Available',
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
    <div className="py-2">
      <h2 className="text-h3 lg:text-h2 text-text-primary mb-6 font-semibold">
        Program Structure - International Program
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
              className="flex w-full cursor-pointer items-start bg-white py-9"
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
                    <div
                      className="quill-content text-body-3 lg:text-body-3 text-text-secondary"
                      dangerouslySetInnerHTML={{ __html: item.content }}
                    />
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
