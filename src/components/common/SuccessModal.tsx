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
        {/* Logo Section */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-auto items-center justify-center">
            <SkyRiseLogo className="h-full w-auto" />
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-4 text-center text-xl font-semibold text-gray-800">
          {title}
        </h2>

        {/* Message */}
        <p className="mb-6 text-center leading-relaxed text-gray-600">
          {message}
        </p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full rounded-lg bg-red-500 py-3 font-semibold text-white transition-colors hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
