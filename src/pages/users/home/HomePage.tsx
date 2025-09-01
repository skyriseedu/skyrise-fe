import { AdmissionProcess } from '@/components/home/AdmissionProcess';
import OurServices from '@/components/home/OurServices';
import HeroSection from '@/components/home/HeroSection';
import React, { useState } from 'react';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import StatsSection from '@/components/home/StatsSection';
import Button from '@/components/common/Button';
import ConsultationForm from '@/components/common/ConsultationForm';
import type { ConsultationFormValues } from '@/components/common/ConsultationForm';

const HomePage: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<ConsultationFormValues>({
    name: '',
    email: '',
    phone: '',
    time: '',
    date: '',
    location: '',
    question: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof ConsultationFormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setIsOpen(false);
      setFormValues({
        name: '',
        email: '',
        phone: '',
        time: '',
        date: '',
        location: '',
        question: '',
      });
      // Optionally show success message
    }, 1200);
  };

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative">
            <button
              className="hover:text-primary absolute top-2 right-2 text-xl text-gray-400"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <ConsultationForm
              values={formValues}
              onChange={handleChange}
              onSubmit={handleSubmit}
              loading={loading}
              headerText="Tell Me Where You Want To Study?"
              onClose={() => setIsOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
