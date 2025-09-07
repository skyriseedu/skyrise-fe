import React from 'react';
import SkyRiseLogo from '../../assets/skyrise-logo.svg?react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title = 'Thank you for your submission',
  message = 'You have successfully submitted the form. Please check your email for further notices.',
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="relative mx-4 w-full max-w-md rounded-lg bg-white p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-auto items-center justify-center">
            <SkyRiseLogo className="h-full w-auto" />
          </div>
        </div>

        <h2 className="text-h3 text-text-primary mb-4 text-center font-semibold">
          {title}
        </h2>

        <p className="text-body-2 mb-6 text-center leading-relaxed text-gray-600">
          {message}
        </p>

        <button
          onClick={onClose}
          className="bg-primary w-full rounded-xl py-3 font-semibold text-white transition-colors hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
