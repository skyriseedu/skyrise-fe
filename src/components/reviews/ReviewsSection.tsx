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

const ReviewsSection: React.FC = () => {
  return (
    <section className="w-full py-6 lg:py-16 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-6">
        <h2 className="mb-8 text-center text-3xl font-bold text-[var(--color-text-primary)] lg:text-4xl">
          Student Reviews
        </h2>

        {reviewsData.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">No reviews at the moment</p>
          </div>
        ) : (
          <div className="relative">
            <div className="overflow-hidden pt-12">
              <div className="flex animate-scroll-reviews">
                {[...Array(2)]?.map((_, setIndex) => (
                  <React.Fragment key={setIndex}>
                    {reviewsData.map((review) => (
                      <div
                        key={`${review.id}-${setIndex}`}
                        className="min-w-[280px] sm:min-w-[340px] lg:min-w-[370px] px-2.5"
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
