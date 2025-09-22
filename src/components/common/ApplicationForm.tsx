import React from 'react';
import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import CustomCalendar from './CustomCalendar';
import CaretDown from '../../assets/caret-down.svg?react';
import CaretUp from '../../assets/caret-up.svg?react';
import Calendar from '../../assets/calendar.svg?react';
import closeIcon from '@/assets/close.svg';
import { useSubmitApplication } from '@/queries';
import type { BookConsultationFormValues } from '@/types/users/forms';
import { convertTo24HourFormat, convertToISODate } from '@/helpers';
import { applicationSchema } from '@/schemas/validation';

interface ConsultationFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const timeOptions = ['08:00 a.m', '12:00 p.m', '15:00 p.m', '20:00 p.m'];
const locationOptions = ['Myanmar', 'Thailand'];
const countryCodeOptions = ['+95', '+66'];

const ConsultationForm: React.FC<ConsultationFormProps> = ({
  onClose,
  onSuccess,
}) => {
  const submitApplicationMutation = useSubmitApplication();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+95');
  const [showCalendar, setShowCalendar] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');

  const initialValues: BookConsultationFormValues = {
    name: '',
    email: '',
    phoneNumber: '',
    bookingTimeSchedule: '',
    bookingDateSchedule: '',
    location: '',
    question: '',
  };

  const handleSubmit = async (values: BookConsultationFormValues) => {
    try {
      const transformedData: BookConsultationFormValues = {
        ...values,
        bookingTimeSchedule: convertTo24HourFormat(values.bookingTimeSchedule),
        bookingDateSchedule: convertToISODate(values.bookingDateSchedule),
        phoneNumber: values.phoneNumber.replace(/\s+/g, ''), // Remove all spaces
      };

      await submitApplicationMutation.mutateAsync(transformedData);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error submitting consultation form:', error);
    }
  };

  return (
    <div
      className="application-form-container max-h-[90vh] w-screen max-w-[35rem] overflow-y-auto px-4 lg:overflow-visible"
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
        validationSchema={applicationSchema}
        validateOnMount
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting, errors, touched }) => (
          <Form className="w-full rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-h3 mb-6 text-center font-semibold">
              Apply with SkyRise
            </h2>

            {/* Error display */}
            {submitApplicationMutation.error && (
              <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                {submitApplicationMutation.error.message}
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

              <div className="relative mb-4">
                <label className="text-h5 absolute -top-2 left-3 z-10 bg-white px-1 font-semibold text-gray-500">
                  Phone Number
                </label>
                <div className="flex rounded-lg border">
                  <div className="relative border-r">
                    <button
                      type="button"
                      className="flex h-full min-w-[70px] items-center justify-between px-3 py-2 text-left"
                      onClick={() => {
                        setShowCalendar(false);
                        setOpenDropdown(
                          openDropdown === 'countryCode' ? null : 'countryCode'
                        );
                      }}
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
                              // Update phoneNumber with new country code
                              setFieldValue(
                                'phoneNumber',
                                `${option} ${phoneInput}`
                              );
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
                      setPhoneInput(e.target.value);
                      setFieldValue(
                        'phoneNumber',
                        `${selectedCountryCode} ${e.target.value}`
                      );
                    }}
                    required
                  />
                </div>
                <ErrorMessage
                  name="phoneNumber"
                  component="div"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              <div className="relative mb-4">
                <label className="text-h5 absolute -top-2 left-3 bg-white px-1 font-semibold text-gray-500">
                  Booking Time Schedule
                </label>
                <button
                  type="button"
                  className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left ${
                    errors.bookingTimeSchedule && touched.bookingTimeSchedule
                      ? 'border-red-500'
                      : ''
                  }`}
                  onClick={() => {
                    setShowCalendar(false);
                    setOpenDropdown(openDropdown === 'time' ? null : 'time');
                  }}
                >
                  <span>{values.bookingTimeSchedule || 'Select time'}</span>
                  {openDropdown === 'time' ? (
                    <CaretUp className="text-primary" />
                  ) : (
                    <CaretDown className="text-primary" />
                  )}
                </button>
                {openDropdown === 'time' && (
                  <div className="absolute top-full right-0 left-0 z-50 mt-1 rounded-lg border bg-white shadow-lg">
                    {timeOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className="w-full px-3 py-2 text-left first:rounded-t-lg last:rounded-b-lg hover:bg-gray-100"
                        onClick={() => {
                          setFieldValue('bookingTimeSchedule', option);
                          setOpenDropdown(null);
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
                <ErrorMessage
                  name="bookingTimeSchedule"
                  component="div"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              <div className="relative mb-4">
                <label className="text-h5 absolute -top-2 left-3 z-10 bg-white px-1 font-semibold text-gray-500">
                  Booking Date Schedule
                </label>
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <input
                    className="w-full cursor-pointer rounded-lg border px-3 py-2 pr-10"
                    type="text"
                    value={
                      values.bookingDateSchedule
                        ? new Date(
                            values.bookingDateSchedule
                          ).toLocaleDateString('en-GB')
                        : ''
                    }
                    placeholder="dd/mm/yyyy"
                    readOnly
                    onClick={() => {
                      setOpenDropdown(null);
                      setShowCalendar(!showCalendar);
                    }}
                    required
                  />
                  <Calendar
                    className="text-primary absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                    onClick={() => {
                      setOpenDropdown(null);
                      setShowCalendar(!showCalendar);
                    }}
                  />
                  {showCalendar && (
                    <div className="absolute top-full right-0 left-0 z-50 mt-1">
                      <CustomCalendar
                        selectedDate={
                          values.bookingDateSchedule
                            ? new Date(values.bookingDateSchedule)
                            : null
                        }
                        onDateSelect={(date) => {
                          // Format date as YYYY-MM-DD without timezone conversion
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(
                            2,
                            '0'
                          );
                          const day = String(date.getDate()).padStart(2, '0');
                          const dateString = `${year}-${month}-${day}`;
                          setFieldValue('bookingDateSchedule', dateString);
                          setShowCalendar(false);
                        }}
                        className="border-0 shadow-lg"
                      />
                    </div>
                  )}
                </div>
                <ErrorMessage
                  name="bookingDateSchedule"
                  component="div"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              <div className="relative mb-4">
                <label className="text-h5 absolute -top-2 left-3 bg-white px-1 font-semibold text-gray-500">
                  Your Location
                </label>
                <button
                  type="button"
                  className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left ${
                    errors.location && touched.location ? 'border-red-500' : ''
                  }`}
                  onClick={() => {
                    setShowCalendar(false);
                    setOpenDropdown(
                      openDropdown === 'location' ? null : 'location'
                    );
                  }}
                >
                  <span>{values.location || 'Select location'}</span>
                  {openDropdown === 'location' ? (
                    <CaretUp className="text-primary" />
                  ) : (
                    <CaretDown className="text-primary" />
                  )}
                </button>
                {openDropdown === 'location' && (
                  <div className="absolute top-full right-0 left-0 z-50 mt-1 rounded-lg border bg-white shadow-lg">
                    {locationOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className="w-full px-3 py-2 text-left first:rounded-t-lg last:rounded-b-lg hover:bg-gray-100"
                        onClick={() => {
                          setFieldValue('location', option);
                          setOpenDropdown(null);
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
                <ErrorMessage
                  name="location"
                  component="div"
                  className="mt-1 text-sm text-red-600"
                />
              </div>
            </div>

            <div className="relative mt-2 mb-6">
              <label className="text-h5 absolute -top-2 left-3 bg-white px-1 font-semibold text-gray-500">
                Your Question
              </label>
              <Field
                as="textarea"
                name="question"
                className={`w-full rounded-lg border px-3 py-2 ${
                  errors.question && touched.question ? 'border-red-500' : ''
                }`}
                placeholder="Anything you want to ask?"
                rows={3}
              />
              <ErrorMessage
                name="question"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <button
              type="submit"
              className="bg-primary text-h4 hover:bg-primary/90 mb-3 w-full cursor-pointer rounded-lg py-2 font-semibold text-white transition-colors disabled:opacity-50"
              disabled={isSubmitting || submitApplicationMutation.isPending}
            >
              {isSubmitting || submitApplicationMutation.isPending
                ? 'Submitting...'
                : 'Submit'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ConsultationForm;
