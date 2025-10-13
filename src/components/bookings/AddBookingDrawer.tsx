import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

import CloseIcon from '@/assets/close.svg?react';
import CalendarTimeIcon from '@/assets/calendar-time.svg?react';
import CheckboxCheckedIcon from '@/assets/checkbox-checked.svg?react';
import CloseSquareIcon from '@/assets/close-square.svg?react';
import CaretDownIcon from '@/assets/caret-down.svg?react';
import CalendarIcon from '@/assets/calendar.svg?react';
import Button from '@/components/common/Button';
import CustomCalendar from '@/components/common/CustomCalendar';
import { bookingStatusOptions, type BookingStatus } from '@/types/bookings';

export type AddBookingFormValues = {
  status: BookingStatus;
  submittedPlatform: string;
  name: string;
  email: string;
  countryDialCode: string;
  phoneNumber: string;
  facebookAccount: string;
  bookingTimeSchedule: string;
  bookingDateSchedule: string;
  location: string;
  question: string;
};

export type PlatformOption =
  | {
      value: string;
      label: string;
    }
  | string;

const defaultPlatforms: PlatformOption[] = [
  { value: 'Website', label: 'Website' },
  { value: 'Social Media', label: 'Social Media' },
];

const bookingTimeOptions = ['08:00 a.m', '12:00 p.m', '03:00 p.m', '08:00 p.m'];
const bookingLocationOptions = ['Myanmar', 'Thailand', 'Singapore'];

export interface BookingDrawerBaseProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (values: AddBookingFormValues) => void;
  statusOptions?: BookingStatus[];
  platformOptions?: PlatformOption[];
  initialValues: AddBookingFormValues;
  title: string;
  submitLabel: string;
}

const cloneFormValues = (input: AddBookingFormValues): AddBookingFormValues => ({
  ...input,
});

const initialFormValues: AddBookingFormValues = {
  status: 'Scheduled',
  submittedPlatform: 'Website',
  name: '',
  email: '',
  countryDialCode: '+95',
  phoneNumber: '',
  facebookAccount: '',
  bookingTimeSchedule: '',
  bookingDateSchedule: '',
  location: 'Myanmar',
  question: '',
};

const BookingDrawerBase: React.FC<BookingDrawerBaseProps> = (
  props
) => {
  const {
    open,
    onClose,
    onSubmit,
    statusOptions = bookingStatusOptions,
    platformOptions = defaultPlatforms,
    initialValues,
    title,
    submitLabel,
  } = props;

  const [values, setValues] = useState<AddBookingFormValues>(() =>
    cloneFormValues(initialValues)
  );
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [isPlatformMenuOpen, setIsPlatformMenuOpen] = useState(false);
  const [isTimeMenuOpen, setIsTimeMenuOpen] = useState(false);
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement | null>(null);
  const platformDropdownRef = useRef<HTMLDivElement | null>(null);
  const timeDropdownRef = useRef<HTMLDivElement | null>(null);
  const locationDropdownRef = useRef<HTMLDivElement | null>(null);
  const calendarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      setValues(cloneFormValues(initialValues));
    }
  }, [open, initialValues]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    const { style } = document.body;
    const previousOverflow = style.overflow;
    style.overflow = 'hidden';

    return () => {
      style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setIsStatusMenuOpen(false);
      setIsPlatformMenuOpen(false);
      setIsTimeMenuOpen(false);
      setIsLocationMenuOpen(false);
      setIsCalendarOpen(false);
    }
  }, [open]);

  useEffect(() => {
    if (!isStatusMenuOpen) {
      return undefined;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!statusDropdownRef.current) return;
      if (!statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isStatusMenuOpen]);

  useEffect(() => {
    if (!isPlatformMenuOpen) {
      return undefined;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!platformDropdownRef.current) return;
      if (!platformDropdownRef.current.contains(event.target as Node)) {
        setIsPlatformMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPlatformMenuOpen]);

  useEffect(() => {
    if (!isTimeMenuOpen) {
      return undefined;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!timeDropdownRef.current) return;
      if (!timeDropdownRef.current.contains(event.target as Node)) {
        setIsTimeMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTimeMenuOpen]);

  useEffect(() => {
    if (!isLocationMenuOpen) {
      return undefined;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!locationDropdownRef.current) return;
      if (!locationDropdownRef.current.contains(event.target as Node)) {
        setIsLocationMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLocationMenuOpen]);

  useEffect(() => {
    if (!isCalendarOpen) {
      return undefined;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!calendarRef.current) return;
      if (!calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCalendarOpen]);

  const handleFieldChange = <K extends keyof AddBookingFormValues>(
    field: K,
    value: AddBookingFormValues[K]
  ) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const statusVisuals: Record<BookingStatus, {
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    iconClassName: string;
    textClassName: string;
  }> = {
    Scheduled: {
      Icon: CalendarTimeIcon,
      iconClassName: 'text-gray-600',
      textClassName: 'text-gray-600',
    },
    Completed: {
      Icon: CheckboxCheckedIcon,
      iconClassName: 'text-primary',
      textClassName: 'text-primary',
    },
    Cancelled: {
      Icon: CloseSquareIcon,
      iconClassName: 'text-white',
      textClassName: 'text-gray-900',
    },
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(values);
  };

  const normalizedPlatformOptions = useMemo(() => {
    return platformOptions.map((option) =>
      typeof option === 'string'
        ? { value: option, label: option }
        : option
    );
  }, [platformOptions]);

  const selectedPlatformOption = normalizedPlatformOptions.find(
    (option) => option.value === values.submittedPlatform
  ) ?? { value: values.submittedPlatform, label: values.submittedPlatform };

  const parsedSelectedDate = values.bookingDateSchedule
    ? new Date(values.bookingDateSchedule)
    : undefined;

  const safeSelectedDate =
    parsedSelectedDate && !Number.isNaN(parsedSelectedDate.getTime())
      ? parsedSelectedDate
      : undefined;

  const formattedBookingDate = safeSelectedDate
    ? safeSelectedDate.toLocaleDateString('en-GB')
    : '';

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-end px-4 py-6 sm:px-6"
          initial={false}
        >
          <motion.div
            className="absolute inset-0 bg-gray-900/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.aside
            className="relative z-10 flex h-[650px] w-full px-4 max-w-[420px] flex-col  rounded-bl-[32px] rounded-tl-[32px] -mr-7 bg-white shadow-2xl max-h-[calc(100vh-48px)] sm:max-h-[calc(100vh-64px)]"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-drawer-title"
          >
            <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-3">
              
                <div>
                  <p
                    id="booking-drawer-title"
                    className="text-base font-semibold text-gray-900"
                  >
                    {title}
                  </p>
              
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 transition-colors hover:text-gray-600"
                aria-label="Close"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex max-h-[600px] flex-col overflow-y-scroll"
            >
              <div className="flex-1 px-6 pt-5 pb-8">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="booking-status" className="text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <div ref={statusDropdownRef} className="relative">
                      <button
                        id="booking-status"
                        type="button"
                        onClick={() => {
                          setIsStatusMenuOpen((prev) => !prev);
                          setIsPlatformMenuOpen(false);
                          setIsTimeMenuOpen(false);
                          setIsLocationMenuOpen(false);
                          setIsCalendarOpen(false);
                        }}
                        className="flex w-full items-center justify-between gap-4 rounded-full  bg-white px-5 py-3 text-sm font-medium text-gray-700 transition focus:outline-none "
                        aria-haspopup="listbox"
                        aria-expanded={isStatusMenuOpen}
                      >
                        <span className="flex items-center gap-3">
                          {(() => {
                            const { Icon, iconClassName } =
                              statusVisuals[values.status];
                            return (
                              <span
                                className={`flex h-9 w-9 items-center justify-center rounded-full `}
                              >
                                <Icon className={`h-5 w-5 ${iconClassName}`} />
                              </span>
                            );
                          })()}
                          <span
                            className={`text-base font-semibold ${statusVisuals[values.status].textClassName}`}
                          >
                            {values.status}
                          </span>
                        </span>
                        <CaretDownIcon
                          className={`h-4 w-4 text-gray-500 transition-transform ${
                            isStatusMenuOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isStatusMenuOpen ? (
                        <div
                          role="listbox"
                          aria-labelledby="booking-status"
                          className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl"
                        >
                          <div className="py-2">
                            {statusOptions.map((status) => {
                              const { Icon, iconClassName, textClassName } =
                                statusVisuals[status];
                              const isSelected = values.status === status;

                              return (
                                <button
                                  key={status}
                                  type="button"
                                  role="option"
                                  aria-selected={isSelected}
                                  onClick={() => {
                                    handleFieldChange('status', status);
                                    setIsStatusMenuOpen(false);
                                  }}
                                  className={`flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-gray-50 ${
                                    isSelected ? 'bg-gray-50' : ''
                                  }`}
                                >
                                  <span
                                    className={`flex h-9 w-9 items-center justify-center rounded-full`}
                                  >
                                    <Icon className={`h-5 w-5 ${iconClassName}`} />
                                  </span>
                                  <span
                                    className={`text-base ${textClassName} ${
                                      isSelected ? 'font-semibold' : 'font-medium'
                                    }`}
                                  >
                                    {status}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="booking-platform" className="text-sm font-medium text-gray-700">
                      Submitted Platform
                    </label>
                    <div ref={platformDropdownRef} className="relative">
                      <button
                        id="booking-platform"
                        type="button"
                        onClick={() => {
                          setIsPlatformMenuOpen((prev) => !prev);
                          setIsStatusMenuOpen(false);
                          setIsTimeMenuOpen(false);
                          setIsLocationMenuOpen(false);
                          setIsCalendarOpen(false);
                        }}
                        className="flex w-full items-center justify-between gap-4 rounded-full bg-white px-5 py-3 text-left text-sm font-medium text-gray-700 transition focus:outline-none"
                        aria-haspopup="listbox"
                        aria-expanded={isPlatformMenuOpen}
                      >
                        <span className="flex flex-col text-sm">
                          <span className="text-base font-semibold text-gray-900">
                            {selectedPlatformOption.label}
                          </span>
                        </span>
                        <CaretDownIcon
                          className={`h-4 w-4 text-gray-500 transition-transform ${
                            isPlatformMenuOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isPlatformMenuOpen ? (
                        <div
                          role="listbox"
                          aria-labelledby="booking-platform"
                          className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl"
                        >
                          <div className="py-2">
                            {normalizedPlatformOptions.map((platform) => {
                              const isSelected =
                                values.submittedPlatform === platform.value;

                              return (
                                <button
                                  key={platform.value}
                                  type="button"
                                  role="option"
                                  aria-selected={isSelected}
                                  onClick={() => {
                                    handleFieldChange(
                                      'submittedPlatform',
                                      platform.value
                                    );
                                    setIsPlatformMenuOpen(false);
                                  }}
                                  className={`flex w-full items-center justify-between gap-3 px-5 py-3 text-left transition hover:bg-gray-50 ${
                                    isSelected ? 'bg-gray-50' : ''
                                  }`}
                                >
                                  <span>
                                    <span className="block text-base font-medium text-gray-900">
                                      {platform.label}
                                    </span>
                                   
                                  </span>
                                  {isSelected ? (
                                    <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                                  ) : null}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="booking-name" className="text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      id="booking-name"
                      value={values.name}
                      onChange={(event) => handleFieldChange('name', event.target.value)}
                      placeholder="Enter full name"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="booking-email" className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      id="booking-email"
                      type="email"
                      value={values.email}
                      onChange={(event) => handleFieldChange('email', event.target.value)}
                      placeholder="example@email.com"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="flex gap-3">
                      <input
                        id="booking-country-code"
                        value={values.countryDialCode}
                        onChange={(event) =>
                          handleFieldChange('countryDialCode', event.target.value)
                        }
                        className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                      <input
                        id="booking-phone"
                        value={values.phoneNumber}
                        onChange={(event) => handleFieldChange('phoneNumber', event.target.value)}
                        placeholder="Enter phone number"
                        className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="booking-facebook" className="text-sm font-medium text-gray-700">
                      Facebook Account
                    </label>
                    <input
                      id="booking-facebook"
                      value={values.facebookAccount}
                      onChange={(event) =>
                        handleFieldChange('facebookAccount', event.target.value)
                      }
                      placeholder="Link or account name"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="booking-time" className="text-sm font-medium text-gray-700">
                      Booking Time Schedule
                    </label>
                    <div ref={timeDropdownRef} className="relative">
                      <button
                        id="booking-time"
                        type="button"
                        onClick={() => {
                          setIsTimeMenuOpen((prev) => !prev);
                          setIsStatusMenuOpen(false);
                          setIsPlatformMenuOpen(false);
                          setIsLocationMenuOpen(false);
                          setIsCalendarOpen(false);
                        }}
                        className="flex w-full items-center justify-between gap-4 rounded-full bg-white px-5 py-3 text-left text-sm font-medium text-gray-700 transition focus:outline-none"
                        aria-haspopup="listbox"
                        aria-expanded={isTimeMenuOpen}
                      >
                        <span className="text-base font-semibold text-gray-900">
                          {values.bookingTimeSchedule || 'Select time'}
                        </span>
                        <CaretDownIcon
                          className={`h-4 w-4 text-gray-500 transition-transform ${
                            isTimeMenuOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isTimeMenuOpen ? (
                        <div
                          role="listbox"
                          aria-labelledby="booking-time"
                          className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl"
                        >
                          <div className="py-2">
                            {bookingTimeOptions.map((option) => {
                              const isSelected = values.bookingTimeSchedule === option;

                              return (
                                <button
                                  key={option}
                                  type="button"
                                  role="option"
                                  aria-selected={isSelected}
                                  onClick={() => {
                                    handleFieldChange('bookingTimeSchedule', option);
                                    setIsTimeMenuOpen(false);
                                  }}
                                  className={`flex w-full items-center justify-between gap-3 px-5 py-3 text-left transition hover:bg-gray-50 ${
                                    isSelected ? 'bg-gray-50' : ''
                                  }`}
                                >
                                  <span className="text-base font-medium text-gray-900">
                                    {option}
                                  </span>
                                  {isSelected ? (
                                    <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                                  ) : null}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="booking-date" className="text-sm font-medium text-gray-700">
                      Booking Date Schedule
                    </label>
                    <div ref={calendarRef} className="relative">
                      <button
                        id="booking-date"
                        type="button"
                        onClick={() => {
                          setIsCalendarOpen((prev) => !prev);
                          setIsStatusMenuOpen(false);
                          setIsPlatformMenuOpen(false);
                          setIsTimeMenuOpen(false);
                          setIsLocationMenuOpen(false);
                        }}
                        className="flex w-full items-center justify-between gap-4 rounded-full bg-white px-5 py-3 text-left text-sm font-medium text-gray-700 transition focus:outline-none"
                        aria-haspopup="dialog"
                        aria-expanded={isCalendarOpen}
                      >
                        <span className="text-base font-semibold text-gray-900">
                          {formattedBookingDate || 'dd / mm / yyyy'}
                        </span>
                        <CalendarIcon className="h-5 w-5 text-gray-500" />
                      </button>

                      {isCalendarOpen ? (
                        <div className="absolute left-1/2 top-full z-30 mt-2 -translate-x-1/2">
                          <CustomCalendar
                            selectedDate={safeSelectedDate}
                            onDateSelect={(date) => {
                              handleFieldChange('bookingDateSchedule', date.toISOString());
                              setIsCalendarOpen(false);
                            }}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="booking-location" className="text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <div ref={locationDropdownRef} className="relative">
                      <button
                        id="booking-location"
                        type="button"
                        onClick={() => {
                          setIsLocationMenuOpen((prev) => !prev);
                          setIsStatusMenuOpen(false);
                          setIsPlatformMenuOpen(false);
                          setIsTimeMenuOpen(false);
                          setIsCalendarOpen(false);
                        }}
                        className="flex w-full items-center justify-between gap-4 rounded-full bg-white px-5 py-3 text-left text-sm font-medium text-gray-700 transition focus:outline-none"
                        aria-haspopup="listbox"
                        aria-expanded={isLocationMenuOpen}
                      >
                        <span className="text-base font-semibold text-gray-900">
                          {values.location}
                        </span>
                        <CaretDownIcon
                          className={`h-4 w-4 text-gray-500 transition-transform ${
                            isLocationMenuOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isLocationMenuOpen ? (
                        <div
                          role="listbox"
                          aria-labelledby="booking-location"
                          className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl"
                        >
                          <div className="py-2">
                            {bookingLocationOptions.map((option) => {
                              const isSelected = values.location === option;

                              return (
                                <button
                                  key={option}
                                  type="button"
                                  role="option"
                                  aria-selected={isSelected}
                                  onClick={() => {
                                    handleFieldChange('location', option);
                                    setIsLocationMenuOpen(false);
                                  }}
                                  className={`flex w-full items-center justify-between gap-3 px-5 py-3 text-left transition hover:bg-gray-50 ${
                                    isSelected ? 'bg-gray-50' : ''
                                  }`}
                                >
                                  <span className="text-base font-medium text-gray-900">
                                    {option}
                                  </span>
                                  {isSelected ? (
                                    <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                                  ) : null}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="booking-question" className="text-sm font-medium text-gray-700">
                      Question
                    </label>
                    <textarea
                      id="booking-question"
                      value={values.question}
                      onChange={(event) => handleFieldChange('question', event.target.value)}
                      placeholder="Questions asked by student"
                      className="min-h-[120px] w-full resize-none rounded-3xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 py-4">
                <div className="flex justify-end gap-3">
                  {/* <Button
                    type="button"
                    outline
                    className="min-w-[96px] border-gray-200 text-gray-600 hover:text-white"
                    onClick={onClose}
                  >
                    Cancel
                  </Button> */}
                  <Button type="submit" className="min-w-[120px]">
                    {submitLabel}
                  </Button>
                </div>
              </div>
            </form>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
};

type AddBookingDrawerProps = Omit<BookingDrawerBaseProps, 'initialValues' | 'title' | 'submitLabel'>;

const AddBookingDrawer: React.FC<AddBookingDrawerProps> = (props) => (
  <BookingDrawerBase
    {...props}
    initialValues={initialFormValues}
    title="Add Consultation Booking"
    submitLabel="Add"
  />
);

export default AddBookingDrawer;
export { BookingDrawerBase };
