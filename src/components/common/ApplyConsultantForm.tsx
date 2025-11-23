import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import closeIcon from '@/assets/close.svg';
import { useApplyConsultantApplication } from '@/queries';
import type { ApplyConsultantFormValues } from '@/types/users/forms';
import { applyConsultantSchema } from '@/schemas/validation';

interface ConsultantFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const ConsultantForm: React.FC<ConsultantFormProps> = ({
  onSuccess,
  onClose,
}) => {
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
        phoneNumber: values.phoneNumber.replace(/\s+/g, ''),
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
      className="apply-consultant-form-container max-h-[90vh] w-screen max-w-[35rem] overflow-y-auto px-4 lg:overflow-visible"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={onClose}
        className="bg-primary absolute -top-3 right-0 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white hover:bg-red-600"
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
        {({ isSubmitting, errors, touched }) => (
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
                <Field
                  name="phoneNumber"
                  type="tel"
                  placeholder="+959123456789"
                  className={`w-full rounded-lg border px-3 py-2 ${
                    errors.phoneNumber && touched.phoneNumber
                      ? 'border-red-500'
                      : ''
                  }`}
                  required
                />
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
              className="bg-primary text-h4 hover:bg-primary/90 mb-3 w-full cursor-pointer rounded-lg py-2 font-semibold text-white transition-colors"
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
