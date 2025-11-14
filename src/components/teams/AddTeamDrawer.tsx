import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import clsx from 'clsx';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

import CloseIcon from '@/assets/close.svg?react';
import Button from '@/components/common/Button';
import GalleryAdd from '@/assets/gallery-add.svg?react';

export interface AddTeamMemberFormValues {
  memberName: string;
  role: string;
  major: string;
  university: string;
  socialMediaLink: string;
  profilePicture: File | null;
}

const defaultFormValues: AddTeamMemberFormValues = {
  memberName: '',
  role: '',
  major: '',
  university: '',
  socialMediaLink: '',
  profilePicture: null,
};

export interface AddTeamDrawerProps {
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

const AddTeamDrawer: React.FC<AddTeamDrawerProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  initialProfilePictureUrl,
  title = 'Add Team Member',
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
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const profilePreviewRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const updateProfilePreview = useCallback((file: File | null) => {
    if (profilePreviewRef.current) {
      URL.revokeObjectURL(profilePreviewRef.current);
      profilePreviewRef.current = null;
    }

    if (file) {
      const url = URL.createObjectURL(file);
      profilePreviewRef.current = url;
      setProfilePreview(url);
    } else {
      setProfilePreview(null);
    }
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    setValues(mergedInitialValues);
    setErrors({});

    if (mergedInitialValues.profilePicture) {
      updateProfilePreview(mergedInitialValues.profilePicture);
      return;
    }

    updateProfilePreview(null);

    if (initialProfilePictureUrl) {
      setProfilePreview(initialProfilePictureUrl);
    }
  }, [
    open,
    mergedInitialValues,
    updateProfilePreview,
    initialProfilePictureUrl,
  ]);

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
    return () => {
      updateProfilePreview(null);
    };
  }, [updateProfilePreview]);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleTextFieldChange = (field: TextField, value: string) => {
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setValues((prev) => ({ ...prev, profilePicture: file }));
    updateProfilePreview(file);

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
    updateProfilePreview(null);
  };

  const validate = (): FieldErrors => {
    const newErrors: FieldErrors = {};

    if (!values.memberName.trim()) {
      newErrors.memberName = 'Member name is required';
    }
    if (!values.role.trim()) {
      newErrors.role = 'Role is required';
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
      memberName: values.memberName.trim(),
      role: values.role.trim(),
      major: values.major.trim(),
      university: values.university.trim(),
      socialMediaLink: values.socialMediaLink.trim(),
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
                      Member Name
                    </label>
                    <input
                      id="team-member-name"
                      type="text"
                      value={values.memberName}
                      onChange={(event) =>
                        handleTextFieldChange('memberName', event.target.value)
                      }
                      placeholder="Enter member name"
                      className={inputClassName(Boolean(errors.memberName))}
                      aria-invalid={Boolean(errors.memberName)}
                    />
                    {errors.memberName ? (
                      <p className="text-sm text-red-500">
                        {errors.memberName}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="team-member-role"
                      className="text-sm font-medium text-gray-700"
                    >
                      Role
                    </label>
                    <input
                      id="team-member-role"
                      type="text"
                      value={values.role}
                      onChange={(event) =>
                        handleTextFieldChange('role', event.target.value)
                      }
                      placeholder="Enter role"
                      className={inputClassName(Boolean(errors.role))}
                      aria-invalid={Boolean(errors.role)}
                    />
                    {errors.role ? (
                      <p className="text-sm text-red-500">{errors.role}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="team-member-major"
                      className="text-sm font-medium text-gray-700"
                    >
                      Major <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      id="team-member-major"
                      type="text"
                      value={values.major}
                      onChange={(event) =>
                        handleTextFieldChange('major', event.target.value)
                      }
                      placeholder="Enter major"
                      className={inputClassName()}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="team-member-university"
                      className="text-sm font-medium text-gray-700"
                    >
                      University{' '}
                      <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      id="team-member-university"
                      type="text"
                      value={values.university}
                      onChange={(event) =>
                        handleTextFieldChange('university', event.target.value)
                      }
                      placeholder="Enter university"
                      className={inputClassName()}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="team-member-social-link"
                      className="text-sm font-medium text-gray-700"
                    >
                      Social Media Link
                    </label>
                    <input
                      id="team-member-social-link"
                      type="url"
                      value={values.socialMediaLink}
                      onChange={(event) =>
                        handleTextFieldChange(
                          'socialMediaLink',
                          event.target.value
                        )
                      }
                      placeholder="https://"
                      className={inputClassName(
                        Boolean(errors.socialMediaLink)
                      )}
                      aria-invalid={Boolean(errors.socialMediaLink)}
                    />
                    {errors.socialMediaLink ? (
                      <p className="text-sm text-red-500">
                        {errors.socialMediaLink}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        Import Profile Picture
                      </label>
                      {values.profilePicture ? (
                        <button
                          type="button"
                          className="text-sm font-medium text-red-500"
                          onClick={handleRemoveProfilePicture}
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleFileChange}
                    />

                    <div
                      className={clsx(
                        'flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed px-6 py-10 text-center text-sm text-gray-500',
                        profilePreview ? 'bg-white' : 'bg-[#FFFDF9]',
                        errors.profilePicture
                          ? 'border-red-400'
                          : 'border-gray-200'
                      )}
                    >
                      {profilePreview ? (
                        <div className="flex w-full flex-col items-center gap-4">
                          <img
                            src={profilePreview}
                            alt="Profile preview"
                            className="max-h-48 w-full rounded-2xl object-cover"
                          />
                          <Button
                            type="button"
                            secondary
                            className="min-w-[140px]"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            Replace Image
                          </Button>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="flex flex-col items-center justify-center text-center text-[#85868A]"
                        >
                          <GalleryAdd />
                          <p className="text-sm font-medium">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs mt-1.5">
                            Maximum size 1MB
                            <br></br>
                            Supported JPG, JPEG
                          </p>
                        </div>
                      )}
                    </div>
                    {errors.profilePicture ? (
                      <p className="text-sm text-red-500">
                        {errors.profilePicture}
                      </p>
                    ) : null}
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

export default AddTeamDrawer;
