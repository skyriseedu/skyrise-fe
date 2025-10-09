import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

import CloseIcon from '@/assets/close.svg?react';
import Button from '@/components/common/Button';
import { bookingStatusOptions, type BookingStatus } from '@/types/bookings';

export type AddBookingFormValues = {
  status: BookingStatus;
  submittedPlatform: string;
  name: string;
  email: string;
  countryDialCode: string;
  phoneNumber: string;
  facebookAccount: string;
};

interface AddBookingDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (values: AddBookingFormValues) => void;
  statusOptions?: BookingStatus[];
  platformOptions?: string[];
}

const defaultPlatforms = ['Website', 'Facebook', 'Messenger', 'Phone', 'Walk-in'];

const initialFormValues: AddBookingFormValues = {
  status: 'Scheduled',
  submittedPlatform: 'Website',
  name: '',
  email: '',
  countryDialCode: '+95',
  phoneNumber: '',
  facebookAccount: '',
};

const AddBookingDrawer: React.FC<AddBookingDrawerProps> = (
  props
) => {
  const {
    open,
    onClose,
    onSubmit,
    statusOptions = bookingStatusOptions,
    platformOptions = defaultPlatforms,
  } = props;

  const [values, setValues] = useState<AddBookingFormValues>(initialFormValues);

  useEffect(() => {
    if (open) {
      setValues(initialFormValues);
    }
  }, [open]);

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

  if (typeof document === 'undefined') {
    return null;
  }

  const handleFieldChange = (
    field: keyof AddBookingFormValues,
    value: string
  ) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(values);
  };

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-end px-4 sm:px-6"
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
            className="relative z-10 flex max-h-[650px] w-full max-w-[450px] px-3 flex-col overflow-y-scroll rounded-bl-xl rounded-tl-xl -mr-6  bg-white shadow-2xl "
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-booking-title"
          >
            <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div>
                  <p
                    id="add-booking-title"
                    className="text-base font-semibold text-gray-900"
                  >
                    Add Consultation Booking
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
              className="flex h-full flex-col"
            >
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="booking-status" className="text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <div className="relative">
                      <select
                        id="booking-status"
                        value={values.status}
                        onChange={(event) =>
                          handleFieldChange('status', event.target.value)
                        }
                        className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 pr-9 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 6L8 10L12 6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="booking-platform" className="text-sm font-medium text-gray-700">
                      Submitted Platform
                    </label>
                    <div className="relative">
                      <select
                        id="booking-platform"
                        value={values.submittedPlatform}
                        onChange={(event) =>
                          handleFieldChange('submittedPlatform', event.target.value)
                        }
                        className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 pr-9 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        {platformOptions.map((platform) => (
                          <option key={platform} value={platform}>
                            {platform}
                          </option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 6L8 10L12 6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
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
                </div>
              </div>

              <div className="border-t border-gray-100 px-6 py-4">
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    outline
                    className="min-w-[96px] border-gray-200 text-gray-600 hover:text-white"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="min-w-[96px]">
                    Add
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

export default AddBookingDrawer;
