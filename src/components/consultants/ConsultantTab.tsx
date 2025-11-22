import React from 'react';
import JoinUsCard from './joinUsCard';
import coverImage from '../../assets/images/consultant-cover.png';
import { useConsultantCount } from '@/queries/consultants';
import UniversityList from './UniversityList';
import SuccessModal from '../common/SuccessModal';
import ApplyConsultantForm from '../common/ApplyConsultantForm';
import { useAllUniversityLogos } from '@/queries/university-logos';
import Loading from '../common/Loading';

const ConsultantTab: React.FC = () => {
  const { data: consultantCountResponse, isLoading: isLoadingConsultantCount } =
    useConsultantCount();

  let consultantCount = consultantCountResponse?.data.total || 0;
  consultantCount -= consultantCount % 10; // Round down to nearest 10

  const [isOpen, setIsOpen] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);

  const handleFormSuccess = () => {
    setIsOpen(false);
    setShowSuccessModal(true);
  };

  const { data: universityLogoData, isLoading: isLoadingUniversityLogos } =
    useAllUniversityLogos();

  console.log('University Logos:', universityLogoData);
  const universityLogos = universityLogoData?.data?.logos || [];

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-64 overflow-hidden">
        <img
          src={coverImage}
          alt="Students studying"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 mb-6 flex w-full items-end">
          <h1 className="text-h3 lg:text-h2 w-full bg-black/50 py-4 text-center font-semibold text-white">
            "Calling Students Studying Around the World! Make an Impact. Inspire
            the Next Generation."
          </h1>
        </div>
      </div>

      <div className="w-full px-6 py-8 lg:px-16">
        <div className="mb-4 flex items-start gap-4">
          <div className="flex-1">
            <h2 className="lg:text-h2 text-h3 text-text-primary mb-4 font-semibold">
              Requirements for applying 'Consultant'
            </h2>
            <div className="lg:text-body-2 text-body-3 mb-4 text-gray-600">
              Are you currently studying in aboard, both in private and public
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
          <h3 className="lg:text-h2 text-h3 text-text-primary mb-4 font-semibold">
            What We're Looking For:
          </h3>
          <ul className="text-body-2 lg:text-body-2 space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="mt-1 text-red-500">•</span>
              <span>
                Current international students who enrolled in a university or
                college in aboard.
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
                story, experiences, and campus life with honesty.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-red-500">•</span>
              <span>
                Reliable and responsible individuals who can commit time
                (ONLINE) to support younger students.
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
          <h3 className="lg:text-h2 text-h3 text-text-primary mb-6 font-semibold">
            Why Join Us?
          </h3>
          <div className="lg:text-body-2 mb-6 text-sm text-gray-600">
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
          <h3 className="text-h3 text-text-primary mb-4 font-semibold">
            What You'll do:
          </h3>
          <ul className="text-text-secondary space-y-3">
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
        <div className="mb-4 p-4">
          {/* Mobile Layout - 2 columns */}
          <div className="flex items-center justify-between space-x-8 lg:hidden">
            <div>
              <div className="text-h2 lg:text-h1 font-semibold text-gray-600">
                <div>Join an inspiring (RISE) community</div>
              </div>
              <div className="mb-2 text-[48px] font-semibold text-gray-900">
                {isLoadingConsultantCount ? (
                  <Loading size="md" color="primary" />
                ) : (
                  `${consultantCount}+`
                )}
              </div>
            </div>
            <div className="text-body-2 lg:text-body-1 text-gray-600">
              We're proud of our consultants - scholarship winners, top
              students, competition champions, and community (RISE)ers. At
              SKYRISE, we celebrate students' journeys while empowering others.
            </div>
          </div>

          {/* Large Screen Layout - 3 columns */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:items-center lg:gap-8">
            <div className="text-center">
              <div className="text-text-primary text-[84px] font-semibold">
                {isLoadingConsultantCount ? (
                  <div className="flex justify-center">
                    <Loading size="lg" color="primary" />
                  </div>
                ) : (
                  `${consultantCount}+`
                )}
              </div>
            </div>
            <div className="text-center">
              <div className="text-h2 font-semibold text-gray-600">
                Join an inspiring (RISE) community
              </div>
            </div>
            <div className="text-body-2 text-gray-600">
              We're proud of our consultants - scholarship winners, top
              students, competition champions, and community (RISE)ers. At
              SKYRISE, we celebrate students' journeys while empowering others.
            </div>
          </div>
        </div>

        <div className="mb-8 text-center">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-primary w-full cursor-pointer rounded-lg px-8 py-3 font-medium text-white transition-colors hover:bg-red-600 lg:w-[40%]"
          >
            Join with us!
          </button>
        </div>

        <div className="mb-8">
          <h3 className="text-h3 lg:text-h2 text-text-primary mb-6 font-semibold">
            Our Ambassadors from Leading Universities
          </h3>
          {isLoadingUniversityLogos ? (
            <Loading />
          ) : (
            <UniversityList logos={universityLogos} />
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 pt-4"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <ApplyConsultantForm
              onClose={() => setIsOpen(false)}
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Applied Successfully!"
        message="Thank you for applying with us. We will contact you shortly via email to confirm your application details."
      />
    </div>
  );
};

export default ConsultantTab;
