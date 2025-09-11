import React from 'react';
import ReviewCard from './ReviewCard';

const reviewsData = [
  {
    id: 1,
    name: 'Mike Kyaw Zin',
    program: 'Information and Communication Technology',
    testimonial:
      'SkyRise made the entire application process so much easier for me. They guided me step-by-step, from choosing the right program to submitting my documents on time."',
  },
  {
    id: 2,
    name: 'Eain Si',
    program: 'Information and Communication Technology',
    testimonial:
      'I had no idea where to start with my application abroad, but SkyRise was there every step of the way. They were super patient and answered all my questions quickly. Thanks to them, I\'m now enrolled in a program I truly love!"',
  },
  {
    id: 3,
    name: 'Eain Si',
    program: 'Information and Communication Technology',
    testimonial:
      'The team at SkyRise is incredibly professional and supportive. They helped me craft a strong personal statement and made sure all my paperwork was perfect. I highly recommend them to anyone applying for international programs."',
  },
  {
    id: 4,
    name: 'Andrew A',
    program: 'Information and Communication Technology',
    testimonial:
      'What I appreciated most about SkyRise was how personalized their service was. They really took the time to understand my goals and found programs that matched perfectly. I\'m so grateful for their guidance!"',
  },
];

interface ReviewsSectionProps {
  title?: string;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  title = 'Student Reviews',
}) => {
  const [isPaused, setIsPaused] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    setIsPaused(true);
    // Resume animation after 3 seconds of no scrolling
    setTimeout(() => setIsPaused(false), 3000);
  };

  return (
    <section className="mb-4 w-full overflow-hidden py-2">
      <div className="container">
        <h2 className="text-h3 lg:text-h2 mb-1 text-left font-semibold text-[var(--color-text-primary)]">
          {title}
        </h2>

        {reviewsData.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">No reviews at the moment</p>
          </div>
        ) : (
          <div className="relative">
            <div
              ref={scrollRef}
              className="scrollbar-hide cursor-grab overflow-x-auto pt-12 active:cursor-grabbing"
              onScroll={handleScroll}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setTimeout(() => setIsPaused(false), 3000)}
            >
              <div
                className={`flex gap-5 ${!isPaused ? 'animate-scroll-reviews' : ''}`}
              >
                {[...Array(3)]?.map((_, setIndex) => (
                  <React.Fragment key={setIndex}>
                    {reviewsData.map((review) => (
                      <div
                        key={`${review.id}-${setIndex}`}
                        className="w-[260px] flex-shrink-0 sm:w-[300px] lg:w-[340px]"
                      >
                        <ReviewCard
                          name={review.name}
                          program={review.program}
                          testimonial={review.testimonial}
                        />
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
