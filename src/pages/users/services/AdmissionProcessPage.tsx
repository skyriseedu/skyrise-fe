import React, { useState } from 'react';
import ServicesShowcase from '@/components/services/consultation/ServicesShowcase';
import Button from '@/components/common/Button';
import BookConsultationForm from '@/components/common/BookConsultationForm';
import ApplicationForm from '@/components/common/ApplicationForm';
import SuccessModal from '@/components/common/SuccessModal';
import support from '@/assets/images/admission-process-support.jpg';
import StickyHeader from '@/components/common/StickyHeader';

const AdmissionProcessPage: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [isApplicationOpen, setIsApplicationOpen] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [successTitle, setSuccessTitle] = useState<string>(
    'Applied Successfully!'
  );
  const [successMessage, setSuccessMessage] = useState<string>(
    'Thank you for applying with us. We will contact you shortly via email to confirm your application details.'
  );

  return (
    <div className="min-h-screen">
      <StickyHeader
        title="Admission Process Support"
        showBackButton={false}
        mobilePadding="px-6"
        desktopPadding="lg:px-15"
        useContainer={false}
      />
      <div className="relative w-full">
        <img
          src={support}
          alt="About us cover 1"
          className="sm-[70px] h-55 w-full object-cover lg:h-[450px]"
        />
        <div
          className="absolute inset-x-0 bottom-4 py-2 md:py-2 lg:bottom-8 lg:py-2"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="container mx-auto px-6 text-left lg:px-8">
            <h1 className="text-h3 md:text-h2 lg:text-h2 font-semibold text-white">
              “We make sure your study abroad dream One Step Closer”
            </h1>
          </div>
        </div>
      </div>
      <section className="container mx-auto px-4 py-8 md:px-8">
        <div>
          <p className="text-text-primary text-body-2 lg:text-body-3 mb-10">
            Applying to universities can feel overwhelming - forget submitting
            required documents?
            <br />
            Lost track on further admission registration when you arrive at Uni?
          </p>

          <p className="text-text-primary text-body-2 lg:text-body-3 mb-10">
            No worries, we make it simple and smooth.
          </p>

          <div className="mb-8">
            <h2 className="text-h4 lg:text-h2 text-text-primary mb-6 font-semibold">
              We assist with :
            </h2>

            <ul className="mb-8 px-4">
              <li className="mb-3 flex items-start">
                <span className="text-text-primary mr-2">•</span>
                <span className="text-text-primary text-h4 lg:text-body-3">
                  Application form completion and document preparation
                </span>
              </li>
              <li className="mb-3 flex items-start">
                <span className="text-text-primary mr-2">•</span>
                <span className="text-text-primary text-h4 lg:text-body-3">
                  English Test Interview Preparation (if needed)
                </span>
              </li>
              <li className="mb-3 flex items-start">
                <span className="text-text-primary mr-2">•</span>
                <span className="text-text-primary text-h4 lg:text-body-3">
                  Communication with university for updates and follow-up
                </span>
              </li>
              <li className="mb-3 flex items-start">
                <span className="text-text-primary mr-2">•</span>
                <span className="text-text-primary text-h4 lg:text-body-3">
                  Visa (Both Yangon and Laos) Visa Run Processes
                </span>
              </li>
              <li className="mb-3 flex items-start">
                <span className="text-text-primary mr-2">•</span>
                <span className="text-text-primary text-h4 lg:text-body-3">
                  Further admission registration ( Student IDs, Health
                  Insurance, Bank Account Applying and etc., )
                </span>
              </li>
            </ul>

            <div className="flex gap-2">
              <Button
                className="bg-primary cursor-pointer rounded-[20px] px-4 py-3 text-white shadow-lg md:px-8 lg:px-8"
                primary={false}
                onClick={() => setOpen(true)}
              >
                Get Free Consultation
              </Button>

              <Button
                secondary
                className="text-text-primary cursor-pointer rounded-[20px] px-8 py-3 shadow-lg"
                onClick={() => setIsApplicationOpen(true)}
              >
                Apply with SkyRise Now!
              </Button>
            </div>
          </div>
        </div>
      </section>
      <ServicesShowcase />

      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-50 px-4">
            <BookConsultationForm
              onSuccess={() => {
                setSuccessTitle('Thank you for your submission');
                setSuccessMessage(
                  'You have successfully submitted the form. Please check your email for further notices.'
                );
                setShowSuccessModal(true);
              }}
              onClose={() => setOpen(false)}
            />
          </div>
        </div>
      )}

      {isApplicationOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 pt-4"
          onClick={() => setIsApplicationOpen(false)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <ApplicationForm
              onClose={() => setIsApplicationOpen(false)}
              onSuccess={() => {
                setSuccessTitle('Thank you for your submission');
                setSuccessMessage(
                  'You have successfully submitted the form. Please check your email for further notices.'
                );
                setShowSuccessModal(true);
              }}
            />
          </div>
        </div>
      )}

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={successTitle}
        message={successMessage}
      />
    </div>
  );
};

export default AdmissionProcessPage;
