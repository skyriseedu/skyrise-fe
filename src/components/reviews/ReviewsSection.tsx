import React from 'react';
import ReviewCard from './ReviewCard';
import type { Review as ApiReview } from '@/types/users/review';

interface ReviewsSectionProps {
  title?: string;
  reviews?: ApiReview[];
}

type DisplayReview = {
  id: string | number;
  name: string;
  program: string;
  testimonial: string;
  imageUrl?: string;
};

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  title = 'Student Reviews',
  reviews,
}) => {
  const [isPaused, setIsPaused] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    setIsPaused(true);
    // Resume animation after 3 seconds of no scrolling
    setTimeout(() => setIsPaused(false), 3000);
  };

  // Normalize backend reviews to the card-friendly shape
  const displayReviews: DisplayReview[] = React.useMemo(() => {
    if (Array.isArray(reviews)) {
      return reviews.map((r) => ({
        id: r._id,
        name: r.studentName,
        program: r.major,
        testimonial: r.review,
        imageUrl: r.studentImage,
      }));
    }
    return [];
  }, [reviews]);

  return (
    <section className="mb-4 w-full overflow-hidden py-2">
      <div className="container">
        <h2 className="text-h3 lg:text-h2 mb-1 text-left font-semibold text-[var(--color-text-primary)]">
          {title}
        </h2>

        {displayReviews?.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-primary text-lg">No reviews at the moment</p>
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
                    {displayReviews?.map((review) => (
                      <div
                        key={`${review.id}-${setIndex}`}
                        className="w-[260px] flex-shrink-0 sm:w-[300px] lg:w-[340px]"
                      >
                        <ReviewCard
                          name={review.name}
                          program={review.program}
                          testimonial={review.testimonial}
                          imageUrl={review.imageUrl}
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
