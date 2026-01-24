import React, { useState } from 'react';
import ServicesShowcase from '@/components/services/consultation/ServicesShowcase';
import Button from '@/components/common/Button';
import BookConsultationForm from '@/components/common/BookConsultationForm';
import SuccessModal from '@/components/common/SuccessModal';
import consultation from '@/assets/images/Consultations.png';
import { useNavigate } from 'react-router-dom';
import StickyHeader from '@/components/common/StickyHeader';

const CounselingPage: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  return (
    <div className="min-h-screen">
      <StickyHeader
        title="Consultation"
        showBackButton={false}
        mobilePadding="px-6"
        desktopPadding="lg:px-15"
        useContainer={false}
      />
      <div className="relative w-full">
        <img
          src={consultation}
          alt="About us cover 1"
          className="sm-[70px] h-55 w-full object-cover lg:h-[450px]"
        />
        <div
          className="absolute inset-x-0 bottom-4 py-2 md:py-2 lg:bottom-8 lg:py-2"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="container mx-auto px-6 text-left lg:px-8">
            <h1 className="text-h3 md:text-h2 lg:text-h2 font-semibold text-white">
              “Your dream. Our guidance. Let’s build your future together!”
            </h1>
          </div>
        </div>
      </div>
      <section className="container mx-auto px-6 py-8 md:px-8">
        <div>
          <p className="text-text-primary text-body-2 lg:text-body-3 mb-10">
            Not Sure where to start? Seniors from your dream universities are
            helping to share genuine reviews <br />
            and insightful information for you to start your academic journey in
            aboard with clarity and <br />
            confidence.
          </p>

          <div className="mb-8">
            <h2 className="text-h4 lg:text-h2 text-text-primary mb-6 font-semibold">
              We Offer :
            </h2>

            <ul className="mb-8">
              <li className="mb-3 flex items-start">
                <span className="text-text-primary mr-2">•</span>
                <span className="text-text-primary text-h4 lg:text-body-3">
                  One-on-one free consultation
                </span>
              </li>
            </ul>

            <div className="flex gap-2">
              <Button
                className="bg-primary cursor-pointer rounded-[20px] px-4 py-3 text-white shadow-lg md:px-8 lg:px-8"
                primary={false}
                onClick={() => setOpen(true)}
              >
                Book Free Consultation
              </Button>

              <Button
                secondary
                className="text-text-primary cursor-pointer rounded-[20px] px-4 py-3 shadow-lg md:px-8 lg:px-8"
                onClick={() => navigate('/explore')}
              >
                Explore University
              </Button>
            </div>
          </div>
        </div>
      </section>
      <ServicesShowcase />

      {open && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 pt-4">
          <div className="relative">
            <BookConsultationForm
              onSuccess={() => setShowSuccessModal(true)}
              onClose={() => setOpen(false)}
            />
          </div>
        </div>
      )}

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Thank you for your submission"
        message="You have successfully submitted the form. Please check your email for further notices."
      />
    </div>
  );
};

export default CounselingPage;
