import React from 'react';
import ReviewCard from './ReviewCard';

const reviewsData = [
  {
    id: 1,
    name: 'Mike Kyaw Zin',
    program: 'Information and Communication Technology',
    testimonial: 'SkyRise made the entire application process so much easier for me. They guided me step-by-step, from choosing the right program to submitting my documents on time. Their support really boosted my confidence, and I got accepted into my dream university!"'
  },
  {
    id: 2,
    name: 'Eain Si',
    program: 'Information and Communication Technology',
    testimonial: 'I had no idea where to start with my application abroad, but SkyRise was there every step of the way. They were super patient and answered all my questions quickly. Thanks to them, I\'m now enrolled in a program I truly love!"'
  },
  {
    id: 3,
    name: 'Eain Si',
    program: 'Information and Communication Technology',
    testimonial: 'The team at SkyRise is incredibly professional and supportive. They helped me craft a strong personal statement and made sure all my paperwork was perfect. I highly recommend them to anyone applying for international programs."'
  },
  {
    id: 4,
    name: 'Andrew A',
    program: 'Information and Communication Technology',
    testimonial: 'What I appreciated most about SkyRise was how personalized their service was. They really took the time to understand my goals and found programs that matched perfectly. I\'m so grateful for their guidance!"'
  }
];

const ReviewsSection: React.FC = () => {
  return (
    <section className="w-full py-12 lg:py-20">
      <div className="container mx-auto px-4 lg:px-6">
        <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-center text-[var(--color-text-primary)]">
          Student Reviews
        </h2>
        
        {reviewsData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">No reviews at the moment</p>
          </div>
        ) : (
          <div className="relative max-w-[1200px] mx-auto">
            <div className="overflow-x-auto pb-6 pt-12 scrollbar-hide">
              <div className="flex gap-5">
                {reviewsData.map((review) => (
                  <div
                    key={review.id}
                    className="flex-none w-[280px] sm:w-[340px] lg:w-[370px]"
                  >
                    <ReviewCard
                      name={review.name}
                      program={review.program}
                      testimonial={review.testimonial}
                    />
                  </div>
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