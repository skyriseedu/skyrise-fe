import React from 'react';
import { useState } from 'react';
import CaretDown from '../../assets/caret-down.svg?react';
import CaretUp from '../../assets/caret-up.svg?react';
import Calendar from '../../assets/calendar.svg?react';
import closeIcon from '@/assets/close.svg';
import { useBookConsultation } from '@/queries';
import type { BookConsultationFormValues } from '@/types/users/forms';
import { convertToISODate, convertTo24HourFormat } from '@/helpers';

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
  const [values, setValues] = useState<BookConsultationFormValues>({
    name: '',
    email: '',
    phoneNumber: '',
    bookingTimeSchedule: '',
    bookingDateSchedule: '',
    location: '',
    question: '',
  });

  const bookConsultationMutation = useBookConsultation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+95');
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());

  const handleChange = (
    field: keyof BookConsultationFormValues,
    value: string
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const transformedData: BookConsultationFormValues = {
        ...values,
        bookingTimeSchedule: convertTo24HourFormat(values.bookingTimeSchedule),
        bookingDateSchedule: convertToISODate(values.bookingDateSchedule),
        phoneNumber: values.phoneNumber.split(' ').join(''),
      };

      console.log('Transformed Data:', transformedData);

      await bookConsultationMutation.mutateAsync(transformedData);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error submitting consultation form:', error);
    }
  };

  // Generate calendar days
  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      days.push(currentDate);
    }
    return days;
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
          Book Consultation
        </h2>

        {/* Error display */}
        {bookConsultationMutation.error && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {bookConsultationMutation.error.message}
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

          <div className="relative mb-4">
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
                value={values.phoneNumber.replace(/^\+\d+\s/, '')}
                onChange={(e) =>
                  handleChange(
                    'phoneNumber',
                    `${selectedCountryCode} ${e.target.value}`
                  )
                }
                required
              />
            </div>
          </div>

          <div className="relative mb-4">
            <label className="text-h5 absolute -top-2 left-3 bg-white px-1 font-semibold text-gray-500">
              Booking Time Schedule
            </label>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left"
              onClick={() =>
                setOpenDropdown(openDropdown === 'time' ? null : 'time')
              }
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
                      handleChange('bookingTimeSchedule', option);
                      setOpenDropdown(null);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
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
                    ? new Date(values.bookingDateSchedule).toLocaleDateString(
                        'en-GB'
                      )
                    : ''
                }
                placeholder="dd/mm/yyyy"
                readOnly
                onClick={() => setShowCalendar(!showCalendar)}
                required
              />
              <Calendar
                className="text-primary absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                onClick={() => setShowCalendar(!showCalendar)}
              />
              {showCalendar && (
                <div className="absolute top-full right-0 left-0 z-50 mt-1 rounded-lg border bg-white p-4 shadow-lg">
                  <div className="mb-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() =>
                        setCalendarDate(
                          new Date(
                            calendarDate.getFullYear(),
                            calendarDate.getMonth() - 1
                          )
                        )
                      }
                      className="rounded p-1 hover:bg-gray-100"
                    >
                      ‹
                    </button>
                    <span className="font-semibold">
                      {calendarDate.toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setCalendarDate(
                          new Date(
                            calendarDate.getFullYear(),
                            calendarDate.getMonth() + 1
                          )
                        )
                      }
                      className="rounded p-1 hover:bg-gray-100"
                    >
                      ›
                    </button>
                  </div>
                  <div className="mb-2 grid grid-cols-7 gap-1">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                      <div
                        key={day}
                        className="p-2 text-center text-sm font-medium text-gray-500"
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {generateCalendarDays(calendarDate).map((day, index) => {
                      const isCurrentMonth =
                        day.getMonth() === calendarDate.getMonth();
                      const isToday =
                        day.toDateString() === new Date().toDateString();
                      const isSelected =
                        values.bookingDateSchedule ===
                        day.toISOString().split('T')[0];

                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            const dateString = day.toISOString().split('T')[0];
                            handleChange('bookingDateSchedule', dateString);
                            setShowCalendar(false);
                          }}
                          className={`rounded p-2 text-sm hover:bg-gray-100 ${
                            !isCurrentMonth
                              ? 'text-gray-300'
                              : isSelected
                                ? 'bg-primary hover:bg-primary/90 text-white'
                                : isToday
                                  ? 'bg-blue-100 text-blue-600'
                                  : 'text-gray-700'
                          }`}
                        >
                          {day.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="relative mb-4">
            <label className="text-h5 absolute -top-2 left-3 bg-white px-1 font-semibold text-gray-500">
              Your Location
            </label>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left"
              onClick={() =>
                setOpenDropdown(openDropdown === 'location' ? null : 'location')
              }
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
                      handleChange('location', option);
                      setOpenDropdown(null);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="relative mb-6">
          <label className="text-h5 absolute -top-2 left-3 bg-white px-1 font-semibold text-gray-500">
            Your Question
          </label>
          <textarea
            className="w-full rounded-lg border px-3 py-2"
            value={values.question}
            onChange={(e) => handleChange('question', e.target.value)}
            placeholder="Anything you want to ask?"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="bg-primary text-h4 hover:bg-primary/90 mb-3 w-full rounded-lg py-2 font-semibold text-white transition-colors disabled:opacity-50"
          disabled={bookConsultationMutation.isPending}
        >
          {bookConsultationMutation.isPending ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default ConsultationForm;
