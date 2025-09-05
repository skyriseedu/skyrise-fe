import React from 'react';
import AmbassadorCard from './AmbassadorCard';
import type {
  Ambassador,
  AmbassadorSectionProps,
} from '@/types/users/about-us';

const AmbassadorSection: React.FC<AmbassadorSectionProps> = ({
  title = 'Student Ambassadors',
  className = '',
}) => {
  const list: Ambassador[] = [
    {
      id: 1,
      image:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
      name: 'Kay Thwe San',
      department: 'International Business',
      university: 'Rangsit University',
    },
    {
      id: 2,
      image:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
      name: 'Kay Thwe San',
      department: 'International Business',
      university: 'Rangsit University',
    },
    {
      id: 3,
      image:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
      name: 'Kay Thwe San',
      department: 'International Business',
      university: 'Rangsit University',
    },
    {
      id: 4,
      image:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
      name: 'Kay Thwe San',
      department: 'International Business',
      university: 'Rangsit University',
    },
    {
      id: 5,
      image:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
      name: 'Kay Thwe San',
      department: 'International Business',
      university: 'Rangsit University',
    },
    {
      id: 6,
      image:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
      name: 'Kay Thwe San',
      department: 'International Business',
      university: 'Rangsit University',
    },
    {
      id: 7,
      image:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
      name: 'Kay Thwe San',
      department: 'International Business',
      university: 'Rangsit University',
    },
  ];

  return (
    <section className={`w-full py-12 lg:py-16 ${className}`}>
      <h2 className="text-h3 md:text-h2 lg:text-h2 text-text-primary mb-8 text-center font-semibold">
        {title}
      </h2>

      <div className="mx-auto max-w-[1200px] overflow-hidden">
        <div className="px-8">
          <div className="flex gap-3 overflow-x-auto pb-4 -mx-8 px-8 scrollbar-hide">
            {list?.map((data) => (
              <AmbassadorCard
                key={data.id}
                image={data.image}
                name={data.name}
                department={data.department}
                university={data.university}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AmbassadorSection;
