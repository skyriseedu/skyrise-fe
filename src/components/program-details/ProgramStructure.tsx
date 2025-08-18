import React, { useState } from 'react';
import caretDown from '@/assets/caret-down.svg';

interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

const ProgramStructure: React.FC = () => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const accordionData: AccordionItem[] = [
    {
      id: 'credit',
      title: 'Total Credit Requirement',
      content: 'The program requires a total of 120 credits to graduate. This includes core courses (60 credits), major electives (30 credits), general education courses (24 credits), and free electives (6 credits).'
    },
    {
      id: 'requirements',
      title: 'Undergraduate Entry Requirements',
      content: 'Applicants must have completed high school with a minimum GPA of 2.5. English proficiency (TOEFL 550 or IELTS 6.0) is required. Additional requirements include official transcripts, recommendation letters, and a personal statement.'
    },
    {
      id: 'career',
      title: 'Career Paths',
      content: 'Graduates can pursue careers as Software Developers, Web Designers, Database Administrators, Network Engineers, IT Consultants, System Analysts, or pursue further studies in specialized ICT fields.'
    }
  ];

  const toggleItem = (id: string) => {
    setOpenItems(prevItems =>
      prevItems.includes(id)
        ? prevItems.filter(item => item !== id)
        : [...prevItems, id]
    );
  };

  return (
    <div className="py-10">
      <h2 className="text-h3 lg:text-h2 font-semibold mb-8 text-text-primary">
        Program Structure
      </h2>
      <div className="space-y-3">
        {accordionData.map((item) => (
          <div
            key={item.id}
            className=""
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full py-4 flex items-start bg-white cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-body-2 lg:text-body-2 font-medium text-text-primary">
                  {item.title}
                </span>
                <img
                  src={caretDown}
                  alt="Toggle"
                  className={`w-5 h-5 transition-transform duration-200 ${
                    openItems.includes(item.id) ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openItems.includes(item.id) ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="pb-4">
                <p className="text-body-3 lg:text-body-3 text-text-secondary">
                  {item.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramStructure;