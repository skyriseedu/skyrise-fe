import React from 'react';
import JoinUsCard from './joinUsCard';

const ConsultantTab: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-64 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Students studying"
          className="h-full w-full object-cover"
        />
        <div className="bg-opacity-40 absolute inset-0 bg-black" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="px-4 text-center text-xl font-medium text-white">
            "Calling Students Studying in Thailand. Make an Impact. Inspire the
            Next Generation."
          </h1>
        </div>
      </div>

      <div className="w-full px-6 py-8 lg:px-16">
        <div className="mb-8 flex items-start gap-4">
          <div className="flex-1">
            <h2 className="lg:text-h1 text-h3 mb-4 font-semibold text-gray-900">
              Requirements for applying 'Consultant'
            </h2>
            <div className="lg:text-body-1 text-body-3 mb-4 text-gray-600">
              Are you currently studying in Thailand, both in private and public
              universities? Join the{' '}
              <span className="font-medium text-red-500">
                SKYRISE Education Team
              </span>{' '}
              to support future students and get rewarded for your insights and
              experiences!
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="lg:text-h1 mb-4 text-lg font-semibold text-gray-900">
            What We're Looking For:
          </h3>
          <ul className="text-body-2 lg:text-body-1 space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="mt-1 text-red-500">•</span>
              <span>
                Current international or local student enrolled in a university
                or college in Thailand.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-red-500">•</span>
              <span>
                Good academic standing with relevant academic records or
                consistent performance.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-red-500">•</span>
              <span>
                Strong communication skills and a willingness to share your
                daily experiences, and campus life honestly.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-red-500">•</span>
              <span>
                Reliable and responsible individuals who can commit time
                (Online) to support younger students.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-red-500">•</span>
              <span>
                Stand out contributions in student communities, leadership,
                volunteering, or unique achievements as a plus!
              </span>
            </li>
          </ul>
        </div>

        <div className="mb-8">
          <h3 className="lg:text-h1 mb-6 text-lg font-semibold text-gray-900">
            Why Join Us?
          </h3>
          <div className="lg:text-h2 mb-6 text-sm text-gray-600">
            We value "Quality" over "Quantity", which is why selected
            ambassadors will enjoy:
          </div>

          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            <JoinUsCard
              number={1}
              content="Exclusive rewards and incentives (commissions, recognition, gifts, or event invites)"
            />
            <JoinUsCard
              number={2}
              content="Priority access (to opportunities, networking, and partnerships through ‘SKYRISE’)"
            />
            <JoinUsCard
              number={3}
              content="Feature your profile on our website (build your impressive portfolio)"
            />
            <JoinUsCard
              number={4}
              content="Chance to inspire others, just like someone may have once inspired you"
            />
          </div>
        </div>

        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            What You'll do:
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="mt-1 text-red-500">•</span>
              <span>
                <span className="font-semibold">Share</span> your real student
                life experiences (consultations, videos, blogs, or Q&A).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-red-500">•</span>
              <span>
                <span className="font-semibold">Share</span> answer students'
                inquiries (Q and A) on your university).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-red-500">•</span>
              <span>
                <span className="font-semibold">Represent SKYRISE</span> (with
                passion and positivity).
              </span>
            </li>
          </ul>
        </div>

        {/* Community Stats */}
        <div className="mb-8 p-4">
          <div className="flex items-center justify-between space-x-8">
            <div>
              <div className="text-h2 lg:text-h1 font-semibold text-gray-600">
                <div>Join an inspiring (RISE) community</div>
              </div>
              <div className="text-h1 mb-2 font-semibold text-gray-900">
                50+
              </div>
            </div>
            <div className="text-body-2 lg:text-body-1 text-gray-600">
              We're proud of our consultants - scholarship winners, top
              students, competition champions, and community (RISE)ers. At
              SKYRISE, we celebrate students' journeys while empowering others.
            </div>
          </div>
        </div>

        <div className="mb-8 text-center">
          <button className="bg-primary w-full rounded-lg px-8 py-3 font-medium text-white transition-colors hover:bg-red-600">
            Join with us!
          </button>
        </div>

        <div className="mb-8">
          <h3 className="text-h3 mb-6 font-semibold text-gray-900 lg:text-lg">
            Our Ambassadors from Leading Universities
          </h3>
          <div className="grid grid-cols-2 items-center justify-items-center gap-6 md:grid-cols-6">
            <img
              src="https://via.placeholder.com/80x40/E5E7EB/6B7280?text=RANGSIT"
              alt="Rangsit University"
              className="h-10 object-contain"
            />
            <img
              src="https://via.placeholder.com/80x40/E5E7EB/6B7280?text=BANGKOK"
              alt="Bangkok University"
              className="h-10 object-contain"
            />
            <img
              src="https://via.placeholder.com/80x40/E5E7EB/6B7280?text=UTCC"
              alt="UTCC"
              className="h-10 object-contain"
            />
            <img
              src="https://via.placeholder.com/80x40/E5E7EB/6B7280?text=RAFFLES"
              alt="Raffles University"
              className="h-10 object-contain"
            />
            <img
              src="https://via.placeholder.com/80x40/E5E7EB/6B7280?text=AIHM"
              alt="AIHM"
              className="h-10 object-contain"
            />
            <img
              src="https://via.placeholder.com/80x40/E5E7EB/6B7280?text=DUSIT"
              alt="Dusit Thani College"
              className="h-10 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantTab;
