import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

import CloseIcon from '@/assets/close.svg?react';
import Button from '@/components/common/Button';
import CaretDown from '@/assets/caret-down.svg?react';
import CaretUp from '@/assets/caret-up.svg?react';
import ImageUpload from '@/components/program-setup/ImageUpload';

export interface AddTeamMemberFormValues {
  consultantName: string;
  major: string;
  university: string;
  email: string;
  countryDialCode: string;
  phoneNumber: string;
  facebookAccount: string;
  pinned?: boolean;
  profilePicture: File | null;
}

const defaultFormValues: AddTeamMemberFormValues = {
  consultantName: '',
  major: '',
  university: '',
  email: '',
  countryDialCode: '+95',
  phoneNumber: '',
  facebookAccount: '',
  pinned: false,
  profilePicture: null,
};

export interface AddConsultantDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (values: AddTeamMemberFormValues) => void;
  initialValues?: Partial<AddTeamMemberFormValues>;
  initialProfilePictureUrl?: string | null;
  title?: string;
  submitLabel?: string;
  isSubmitting?: boolean;
  secondaryAction?: {
    label: string;
    onClick: () => void;
    kind?: 'secondary' | 'destructive';
    disabled?: boolean;
    loading?: boolean;
  };
}

type TextField = Exclude<keyof AddTeamMemberFormValues, 'profilePicture'>;

type FieldErrors = Partial<Record<keyof AddTeamMemberFormValues, string>>;

const mergeWithDefaults = (
  values?: Partial<AddTeamMemberFormValues>
): AddTeamMemberFormValues => ({
  ...defaultFormValues,
  ...values,
  profilePicture: values?.profilePicture ?? null,
});

const inputClassName = (hasError?: boolean) =>
  clsx(
    'w-full rounded-3xl border px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 transition focus:outline-none focus:ring-2 focus:ring-primary/30',
    hasError
      ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
      : 'border-gray-200 focus:border-primary'
  );

const AddConsultantDrawer: React.FC<AddConsultantDrawerProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  initialProfilePictureUrl,
  title = 'Add Consultant',
  submitLabel = 'Add',
  isSubmitting = false,
  secondaryAction,
}) => {
  const mergedInitialValues = useMemo(
    () => mergeWithDefaults(initialValues),
    [initialValues]
  );

  const [values, setValues] =
    useState<AddTeamMemberFormValues>(mergedInitialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [phoneInput, setPhoneInput] = useState<string>('');
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('+95');

  const countryCodeOptions = ['+95', '+66'];

  useEffect(() => {
    if (!open) {
      return;
    }

    setValues(mergedInitialValues);
    setErrors({});

    // Set country code from initial values or default to +95
    const countryCode = mergedInitialValues.countryDialCode || '+95';
    setSelectedCountryCode(countryCode);

    // Set phone input (should already be just the number part)
    setPhoneInput(mergedInitialValues.phoneNumber || '');
  }, [open, mergedInitialValues]);

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

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleFieldChange = (field: TextField, value: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleImageUpload = (file: File) => {
    setValues((prev) => ({ ...prev, profilePicture: file }));
    if (errors.profilePicture) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.profilePicture;
        return next;
      });
    }
  };

  const handleRemoveProfilePicture = () => {
    setValues((prev) => ({ ...prev, profilePicture: null }));
    if (errors.profilePicture) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.profilePicture;
        return next;
      });
    }
  };

  const validate = (): FieldErrors => {
    const newErrors: FieldErrors = {};

    if (!values.consultantName.trim()) {
      newErrors.consultantName = 'Consultant name is required';
    }
    if (!values.email.trim()) {
      newErrors.email = 'Email is required';
    }

    return newErrors;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const sanitizedValues: AddTeamMemberFormValues = {
      consultantName: values.consultantName.trim(),
      major: values.major.trim(),
      university: values.university.trim(),
      email: values.email.trim(),
      countryDialCode: values.countryDialCode.trim() || '+95',
      phoneNumber: values.phoneNumber.trim(),
      facebookAccount: values.facebookAccount.trim(),
      pinned: values.pinned,
      profilePicture: values.profilePicture,
    };

    setValues(sanitizedValues);
    onSubmit?.(sanitizedValues);
  };

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-end px-4 py-6 sm:px-6"
          initial={false}
          onMouseDown={handleOverlayClick}
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
            className="relative z-10 -mr-7 flex h-[650px] max-h-[calc(100vh-48px)] w-full max-w-[420px] flex-col rounded-tl-[32px] rounded-bl-[32px] bg-white px-4 shadow-2xl sm:max-h-[calc(100vh-64px)]"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="team-drawer-title"
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
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="team-member-name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Consultant Name
                    </label>
                    <input
                      id="team-member-name"
                      type="text"
                      value={values.consultantName}
                      onChange={(event) =>
                        handleFieldChange('consultantName', event.target.value)
                      }
                      placeholder="Enter consultant name"
                      className={inputClassName(Boolean(errors.consultantName))}
                      aria-invalid={Boolean(errors.consultantName)}
                    />
                    {errors.consultantName ? (
                      <p className="text-sm text-red-500">
                        {errors.consultantName}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="team-member-major"
                      className="text-sm font-medium text-gray-700"
                    >
                      Major (optional)
                    </label>
                    <input
                      id="team-member-major"
                      type="text"
                      value={values.major}
                      onChange={(event) =>
                        handleFieldChange('major', event.target.value)
                      }
                      placeholder="Enter major"
                      className={inputClassName(Boolean(errors.major))}
                      aria-invalid={Boolean(errors.major)}
                    />
                    {errors.major ? (
                      <p className="text-sm text-red-500">{errors.major}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="team-member-university"
                      className="text-sm font-medium text-gray-700"
                    >
                      University(optional)
                    </label>
                    <input
                      id="team-member-university"
                      type="text"
                      value={values.university}
                      onChange={(event) =>
                        handleFieldChange('university', event.target.value)
                      }
                      placeholder="Enter university"
                      className={inputClassName()}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="team-member-email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      id="team-member-email"
                      type="email"
                      value={values.email}
                      onChange={(event) =>
                        handleFieldChange('email', event.target.value)
                      }
                      placeholder="name@example.com"
                      className={inputClassName(Boolean(errors.email))}
                      aria-invalid={Boolean(errors.email)}
                    />
                    {errors.email ? (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="flex rounded-lg border border-gray-200">
                      <div className="relative border-r">
                        <button
                          type="button"
                          className="flex h-full min-w-[70px] items-center justify-between px-3 py-2 text-left"
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === 'countryCode'
                                ? null
                                : 'countryCode'
                            )
                          }
                        >
                          <span className="text-sm">{selectedCountryCode}</span>
                          {openDropdown === 'countryCode' ? (
                            <CaretUp className="ml-1 h-5 w-5 text-black" />
                          ) : (
                            <CaretDown className="ml-1 h-5 w-5 text-black" />
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
                                  handleFieldChange('countryDialCode', option);
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
                          errors.phoneNumber ? 'border-red-500' : ''
                        }`}
                        value={phoneInput}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          setPhoneInput(inputValue);
                          handleFieldChange('phoneNumber', inputValue);
                        }}
                        placeholder="Enter phone number"
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="team-member-social-link"
                      className="text-sm font-medium text-gray-700"
                    >
                      Facebook Account
                    </label>
                    <input
                      id="team-member-social-link"
                      type="text"
                      value={values.facebookAccount}
                      onChange={(event) =>
                        handleFieldChange('facebookAccount', event.target.value)
                      }
                      placeholder="https://"
                      className={inputClassName(
                        Boolean(errors.facebookAccount)
                      )}
                      aria-invalid={Boolean(errors.facebookAccount)}
                    />
                    {errors.facebookAccount ? (
                      <p className="text-sm text-red-500">
                        {errors.facebookAccount}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Profile Picture
                    </label>
                    <ImageUpload
                      onImageUpload={handleImageUpload}
                      onRemove={handleRemoveProfilePicture}
                      image={
                        values.profilePicture ||
                        (initialProfilePictureUrl ?? undefined)
                      }
                    />
                    {errors.profilePicture && (
                      <p className="text-sm text-red-500">
                        {errors.profilePicture}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4">
                <div className="flex justify-between gap-3">
                  {secondaryAction ? (
                    <Button
                      type="button"
                      secondary={secondaryAction.kind !== 'destructive'}
                      destructive={secondaryAction.kind === 'destructive'}
                      className="min-w-[120px]"
                      onClick={secondaryAction.onClick}
                      disabled={secondaryAction.disabled}
                      loading={secondaryAction.loading}
                    >
                      {secondaryAction.label}
                    </Button>
                  ) : null}
                  <Button
                    type="submit"
                    className="min-w-[120px]"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
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

export default AddConsultantDrawer;
