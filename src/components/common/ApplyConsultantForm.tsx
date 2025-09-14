import React from 'react';
import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import CaretDown from '../../assets/caret-down.svg?react';
import CaretUp from '../../assets/caret-up.svg?react';
import closeIcon from '@/assets/close.svg';
import { useApplyConsultantApplication } from '@/queries';
import type { ApplyConsultantFormValues } from '@/types/users/forms';
import { applyConsultantSchema } from '@/schemas/validation';

interface ConsultantFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const countryCodeOptions = ['+95', '+66'];

const ConsultantForm: React.FC<ConsultantFormProps> = ({
  onSuccess,
  onClose,
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+95');
  const [phoneInput, setPhoneInput] = useState('');

  const consultantApplicationMutation = useApplyConsultantApplication();

  const initialValues: ApplyConsultantFormValues = {
    name: '',
    email: '',
    phoneNumber: '',
    reason: '',
  };

  const handleSubmit = async (values: ApplyConsultantFormValues) => {
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

      <Formik
        initialValues={initialValues}
        validationSchema={applyConsultantSchema}
        validateOnMount
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, isSubmitting, errors, touched }) => (
          <Form className="w-full rounded-lg bg-white p-6 shadow-lg">
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
                <Field
                  name="name"
                  className={`w-full rounded-lg border px-3 py-2 ${
                    errors.name && touched.name ? 'border-red-500' : ''
                  }`}
                  required
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              <div className="relative mb-4">
                <label className="text-h5 absolute -top-2 left-3 bg-white px-1 font-semibold text-gray-500">
                  Email
                </label>
                <Field
                  name="email"
                  type="email"
                  className={`w-full rounded-lg border px-3 py-2 ${
                    errors.email && touched.email ? 'border-red-500' : ''
                  }`}
                  required
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="mt-1 text-sm text-red-600"
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
                                setFieldValue(
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
                    className={`flex-1 border-0 px-3 py-2 outline-none focus:ring-0 ${
                      errors.phoneNumber && touched.phoneNumber
                        ? 'border-red-500'
                        : ''
                    }`}
                    value={phoneInput}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      setPhoneInput(inputValue);
                      setFieldValue(
                        'phoneNumber',
                        `${selectedCountryCode} ${inputValue}`
                      );
                    }}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                <ErrorMessage
                  name="phoneNumber"
                  component="div"
                  className="mt-1 text-sm text-red-600"
                />
              </div>
            </div>

            {/* Reason field */}
            <div className="relative mb-6">
              <label className="text-h5 absolute -top-2 left-3 bg-white px-1 font-semibold text-gray-500">
                Why do you want to join?
              </label>
              <Field
                as="textarea"
                name="reason"
                className={`w-full rounded-lg border px-3 py-2 ${
                  errors.reason && touched.reason ? 'border-red-500' : ''
                }`}
                placeholder="Tell us about your university name, your contribution, etc."
                rows={3}
                required
              />
              <ErrorMessage
                name="reason"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div className="text-text-secondary mb-4 text-xs">
              * We will contact you for further more details via email
            </div>

            <button
              type="submit"
              className="bg-primary text-h4 hover:bg-primary/90 mb-3 w-full rounded-lg py-2 font-semibold text-white transition-colors cursor-pointer"
              disabled={isSubmitting || consultantApplicationMutation.isPending}
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ConsultantForm;
