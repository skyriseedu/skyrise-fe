import React from 'react';
import { useState } from 'react';
import CaretDown from '../../assets/caret-down.svg?react';
import CaretUp from '../../assets/caret-up.svg?react';
import closeIcon from '@/assets/close.svg';
import { useApplyConsultantApplication } from '@/queries';
import type { ApplyConsultantFormValues } from '@/types/users/forms';

interface ConsultantFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const countryCodeOptions = ['+95', '+66'];

const ConsultantForm: React.FC<ConsultantFormProps> = ({
  onSuccess,
  onClose,
}) => {
  const [values, setValues] = useState<ApplyConsultantFormValues>({
    name: '',
    email: '',
    phoneNumber: '',
    reason: '',
  });

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+95');
  const [phoneInput, setPhoneInput] = useState('');

  const consultantApplicationMutation = useApplyConsultantApplication();

  const handleChange = (
    field: keyof ApplyConsultantFormValues,
    value: string
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const formattedData = {
        ...values,
        phoneNumber: values.phoneNumber.split(' ').join(''),
      };

      await consultantApplicationMutation.mutateAsync(formattedData);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error submitting consultant application:', error);
    }
  };

  return (
    <div
      className="consultation-form-container relative"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={onClose}
        className="bg-primary absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-red-600"
        aria-label="Close"
      >
        <img
          src={closeIcon}
          alt="Close"
          className="h-6 w-6 brightness-0 invert filter"
        />
      </button>
      <form
        className="w-full rounded-lg bg-white p-6 shadow-lg"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <h2 className="text-h3 mb-6 text-center font-semibold">
          Join our teams as a consultant
        </h2>

        {/* Error display */}
        {consultantApplicationMutation.error && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {consultantApplicationMutation.error.message}
          </div>
        )}

        <div className="lg:grid lg:grid-cols-2 lg:gap-4">
          {/* Name field */}
          <div className="relative mb-4">
            <label className="text-h5 absolute -top-2 left-3 bg-white px-1 font-semibold text-gray-500">
              Name
            </label>
            <input
              className="w-full rounded-lg border px-3 py-2"
              value={values.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div className="relative mb-4">
            <label className="text-h5 absolute -top-2 left-3 bg-white px-1 font-semibold text-gray-500">
              Email
            </label>
            <input
              className="w-full rounded-lg border px-3 py-2"
              type="email"
              value={values.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>

          <div className="relative mb-4 lg:col-span-2">
            <label className="text-h5 absolute -top-2 left-3 z-10 bg-white px-1 font-semibold text-gray-500">
              Phone Number
            </label>
            <div className="flex rounded-lg border">
              <div className="relative border-r">
                <button
                  type="button"
                  className="flex h-full min-w-[70px] items-center justify-between px-3 py-2 text-left"
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === 'countryCode' ? null : 'countryCode'
                    )
                  }
                >
                  <span className="text-sm">{selectedCountryCode}</span>
                  {openDropdown === 'countryCode' ? (
                    <CaretUp className="text-primary ml-1 h-5 w-5" />
                  ) : (
                    <CaretDown className="text-primary ml-1 h-5 w-5" />
                  )}
                </button>
                {openDropdown === 'countryCode' && (
                  <div className="absolute top-full left-0 z-50 mt-1 min-w-[100px] rounded-lg border bg-white shadow-lg">
                    {countryCodeOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className="w-full px-3 py-2 text-left text-sm first:rounded-t-lg last:rounded-b-lg hover:bg-gray-100"
                        onClick={() => {
                          setSelectedCountryCode(option);
                          setOpenDropdown(null);
                          // Update the phoneNumber with new country code
                          if (phoneInput) {
                            handleChange(
                              'phoneNumber',
                              `${option} ${phoneInput}`
                            );
                          }
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input
                className="flex-1 border-0 px-3 py-2 outline-none focus:ring-0"
                value={phoneInput}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  setPhoneInput(inputValue);
                  handleChange(
                    'phoneNumber',
                    `${selectedCountryCode} ${inputValue}`
                  );
                }}
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>
        </div>

        {/* Reason field */}
        <div className="relative mb-6">
          <label className="text-h5 absolute -top-2 left-3 bg-white px-1 font-semibold text-gray-500">
            Why do you want to join?
          </label>
          <textarea
            className="w-full rounded-lg border px-3 py-2"
            value={values.reason}
            onChange={(e) => handleChange('reason', e.target.value)}
            placeholder="Tell us about your university name, your contribution, etc."
            rows={3}
            required
          />
        </div>

        <div className="text-text-secondary mb-4 text-xs">
          * We will contact you for further more details via email
        </div>

        <button
          type="submit"
          className="bg-primary text-h4 hover:bg-primary/90 mb-3 w-full rounded-lg py-2 font-semibold text-white transition-colors"
          disabled={consultantApplicationMutation.isPending}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ConsultantForm;
