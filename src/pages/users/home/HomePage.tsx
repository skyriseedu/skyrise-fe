import { AdmissionProcess } from '@/components/home/AdmissionProcess';
import OurServices from '@/components/home/OurServices';
import HeroSection from '@/components/home/HeroSection';
import React, { useState } from 'react';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import StatsSection from '@/components/home/StatsSection';
import Button from '@/components/common/Button';
import SuccessModal from '@/components/common/SuccessModal';
import BookConsultationForm from '@/components/common/BookConsultationForm';

const HomePage: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  return (
    <div className="mb-4 min-h-screen">
      <HeroSection />
      <WhyChooseUs />
      <AdmissionProcess />
      <OurServices />
      <StatsSection />

      <div className="flex justify-center px-4 py-8">
        <Button
          size="lg"
          className="text-body-5 lg:text-body-3 w-full rounded-[10px] font-semibold sm:w-auto sm:px-12"
          onClick={() => setIsOpen(true)}
        >
          Book Free Consultation
        </Button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <BookConsultationForm
              onSuccess={() => setShowSuccessModal(true)}
              onClose={() => setIsOpen(false)}
            />
          </div>
        </div>
      )}

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Consultation Booked Successfully!"
        message="Thank you for booking a consultation with us. We will contact you shortly via email to confirm your appointment details."
      />
    </div>
  );
};

export default HomePage;
