import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import caretDown from '@/assets/caret-down.svg';

interface ProgramStructureProps {
  undergraduateEntryRequirement?: string;
  creditDetails?: string;
  careerPaths?: string;
}

type AccordionItem = {
  id: string;
  title: string;
  content?: string;
  htmlContent?: string;
};

const ProgramStructure: React.FC<ProgramStructureProps> = ({
  undergraduateEntryRequirement,
  creditDetails,
  careerPaths,
}) => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const accordionData: AccordionItem[] = [
    ...(creditDetails
      ? [
          {
            id: 'credit',
            title: 'Total Credit Requirement',
            content: creditDetails,
          } as AccordionItem,
        ]
      : []),
    ...(undergraduateEntryRequirement
      ? [
          {
            id: 'requirements',
            title: 'Undergraduate Entry Requirements',
            htmlContent: undergraduateEntryRequirement,
          } as AccordionItem,
        ]
      : []),
    ...(careerPaths
      ? [
          {
            id: 'career',
            title: 'Career Paths',
            content: careerPaths,
          } as AccordionItem,
        ]
      : []),
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
      { undergraduateEntryRequirement || creditDetails ||  careerPaths && <h2 className="text-h3 lg:text-h2 text-text-primary mb-8 font-semibold">
        Program Structure
      </h2> }
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
                    {item?.htmlContent ? (
                      <div
                        className="text-body-3 lg:text-body-3 text-text-secondary"
                        dangerouslySetInnerHTML={{ __html: item?.htmlContent }}
                      />
                    ) : (
                      <p className="text-body-3 lg:text-body-3 text-text-secondary">
                        {item.content}
                      </p>
                    )}
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
