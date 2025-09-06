import React from 'react';
import { Link } from 'react-router-dom';
import skyriseTeam from '@/assets/images/About us_join.jpeg';

const JoinUsCard: React.FC = () => {
  return (
    <div className="w-full py-12 lg:py-16">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-6 shadow-lg sm:p-8 lg:p-12 border-1 border-gray-100">
      <h3 className="text-h3 lg:text-h2 text-text-primary mb-6 font-semibold">Join Us!</h3>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
        <div>
          <img
            src={skyriseTeam}
            alt="SKYRISE team"
            className="h-44 w-full rounded-2xl object-cover sm:h-56 lg:h-[320px]"
          />
        </div>

        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-h2 lg:text-h2 text-text-primary font-semibold leading-snug">
            Studying in Thailand? Join the SKYRISE Education Team! Share your
            journey, support future students, and get rewarded.
          </p>

          <div className="mt-8 mb-4">
            <Link
              to="/universities"
              className="relative cursor-pointer inline-block text-h3 lg:text-h3 text-text-primary font-semibold hover:opacity-90"
            >
              Become our ambassador!
              <span className="absolute left-0 right-0 -bottom-1 h-1 rounded bg-primary/80"></span>
            </Link>
          </div>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default JoinUsCard;
