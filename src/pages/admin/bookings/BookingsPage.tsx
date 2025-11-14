import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

import DataTable, {
  type SortState,
  type TableColumn,
} from '@/components/common/DataTable';
import Button from '@/components/common/Button';
import SearchIcon from '@/assets/search.svg?react';
import FilterIcon from '@/assets/filter-alt.svg?react';
import RemoveIcon from '@/assets/bin.svg?react';
import CaretDownIcon from '@/assets/caret-down.svg?react';
import CalendarTimeIcon from '@/assets/calendar-time.svg?react';
import CheckboxCheckedIcon from '@/assets/checkbox-checked.svg?react';
import CloseSquareIcon from '@/assets/close-square.svg?react';
import AddBookingDrawer, {
  type AddBookingFormValues,
} from '@/components/bookings/AddBookingDrawer';
import EditBookingDrawer from '@/components/bookings/EditBookingDrawer';
import type { BookingStatus, PlatformStatus } from '@/types/bookings';
import { bookingStatusOptions, platformStatusOptions } from '@/types/bookings';
import {
  useConsultations,
  useCreateConsultation,
  useDeleteConsultation,
  useBulkDeleteConsultations,
  useApplications,
  useUpdateConsultation,
  useCreateApplicationBooking,
  useBulkDeleteApplications,
  useUpdateApplicationBooking,
  useUpdateApplicationStatus,
} from '@/queries';
import type {
  Consultation,
  CreateConsultationRequest,
  BookingStatusApi,
} from '@/types/bookings';
import EditIcon from '@/assets/edit.svg?react';

type BookingRecord = {
  id: string;
  status: BookingStatus;
  submittedPlatform: PlatformStatus;
  submittedDate: string; // ISO date string
  name: string;
  email: string;
  phoneNumber: string;
  facebookAccount?: string;
  bookingTimeSchedule?: string;
  bookingDateSchedule?: string;
  location?: string;
  question?: string;
};

type BookingTab = 'consultation' | 'admission';

type StatusVisualConfig = {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconWrapperClassName: string;
  iconClassName: string;
  textClassName: string;
};

type PlatformVisualConfig = {
  textClassName: string;
};

type DropdownPosition = {
  top: number;
  left: number;
  width: number;
};

const supportedDialCodes = ['+95', '+66'] as const;
const BOOKING_TABLE_MAX_BODY_HEIGHT = '35rem'; // header + 5 rows

const timeOptionToApiMap: Record<string, string> = {
  '08:00 a.m': '08:00',
  '12:00 p.m': '12:00',
  '15:00 p.m': '15:00',
  '20:00 p.m': '20:00',
};

const apiTimeToOptionMap = Object.entries(timeOptionToApiMap).reduce(
  (acc, [option, apiValue]) => {
    acc[apiValue] = option;
    const truncated = apiValue.slice(0, 5);
    acc[truncated] = option;
    return acc;
  },
  {} as Record<string, string>
);

const formatTimeValueForApi = (value: string): string => {
  if (!value) return '';
  const trimmed = value.trim();
  if (timeOptionToApiMap[trimmed]) {
    return timeOptionToApiMap[trimmed];
  }
  return trimmed.slice(0, 5);
};

const formatTimeValueForForm = (value?: string): string => {
  if (!value) return '';
  const trimmed = value.trim();
  if (apiTimeToOptionMap[trimmed]) {
    return apiTimeToOptionMap[trimmed];
  }
  const truncated = trimmed.slice(0, 5);
  return apiTimeToOptionMap[truncated] ?? trimmed;
};

const sanitizeTextValue = (value?: string | null, fallback = ''): string => {
  if (!value) return fallback;
  const trimmed = value.trim();
  if (!trimmed || trimmed.toUpperCase() === 'N/A') {
    return fallback;
  }
  return trimmed;
};

const removeOrdinalSuffixes = (input: string) =>
  input.replace(/\b(\d{1,2})(st|nd|rd|th)\b/gi, '$1');

const monthMap: Record<string, number> = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

const tryParseNamedMonth = (input: string): string | null => {
  const cleaned = removeOrdinalSuffixes(input).replace(/,/g, ' ').trim();
  const normalized = cleaned.replace(/\s+/g, ' ');

  const forwardMatch = normalized.match(
    /^(\d{1,2})\s+([A-Za-z]+)\s+(\d{2,4})(.*)$/
  );
  const reverseMatch = normalized.match(
    /^([A-Za-z]+)\s+(\d{1,2})\s+(\d{2,4})(.*)$/
  );

  const buildIsoFromMatch = (
    dayMatch: RegExpMatchArray,
    monthGroup: number,
    dayGroup: number,
    yearGroup: number
  ): string | null => {
    const monthName = dayMatch[monthGroup]?.toLowerCase();
    const monthIndex = monthName ? monthMap[monthName] : undefined;
    if (monthIndex === undefined) return null;

    const day = Number(dayMatch[dayGroup]);
    let year = Number(dayMatch[yearGroup]);
    if (Number.isNaN(day) || Number.isNaN(year)) return null;
    if (year < 100) {
      year += year >= 70 ? 1900 : 2000;
    }

    const date = new Date(Date.UTC(year, monthIndex, day));
    if (Number.isNaN(date.getTime())) return null;
    return date.toISOString();
  };

  if (forwardMatch) {
    const iso = buildIsoFromMatch(forwardMatch, 2, 1, 3);
    if (iso) return iso;
  }

  if (reverseMatch) {
    const iso = buildIsoFromMatch(reverseMatch, 1, 2, 3);
    if (iso) return iso;
  }

  return null;
};

const formatDateValueForForm = (value?: string): string => {
  const trimmed = sanitizeTextValue(value);
  if (!trimmed) return '';

  const tryParseToIso = (input: string): string | null => {
    const parsed = new Date(input);
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }
    return parsed.toISOString();
  };

  const isoCandidates = new Set<string>([trimmed]);

  if (trimmed.includes(' ') && !trimmed.includes('T')) {
    const spaced = trimmed.replace(' ', 'T');
    isoCandidates.add(spaced);
    if (!/[zZ]|[+-]\d{2}:?\d{2}$/.test(spaced)) {
      isoCandidates.add(`${spaced}Z`);
    }
  }

  if (trimmed.includes('/')) {
    const normalizedSlashes = trimmed.replace(/\//g, '-');
    isoCandidates.add(normalizedSlashes);
  }

  const namedMonthIso = tryParseNamedMonth(trimmed);
  if (namedMonthIso) {
    return namedMonthIso;
  }

  const cleanedOrdinal = removeOrdinalSuffixes(trimmed).replace(/,/g, ' ');
  if (cleanedOrdinal !== trimmed) {
    isoCandidates.add(cleanedOrdinal);
  }

  for (const candidate of isoCandidates) {
    const iso = tryParseToIso(candidate);
    if (iso) {
      return iso;
    }
  }

  const compact = cleanedOrdinal.replace(/\s+/g, '');
  const match = compact.match(/^(\d{1,2})([/-])(\d{1,2})\2(\d{2,4})$/);
  if (match) {
    const day = Number(match[1]);
    const month = Number(match[3]) - 1;
    const rawYear = match[4];
    const year = rawYear.length === 2 ? Number(`20${rawYear}`) : Number(rawYear);
    const manualDate = new Date(Date.UTC(year, month, day));
    if (!Number.isNaN(manualDate.getTime())) {
      return manualDate.toISOString();
    }
  }

  return trimmed;
};

const extractPhonePartsForForm = (rawPhone?: string) => {
  const defaultDial = supportedDialCodes[0];
  const sanitized = sanitizeTextValue(rawPhone);
  if (!sanitized) {
    return { dialCode: defaultDial, localNumber: '' };
  }

  const compact = sanitized.replace(/\s+/g, '');
  const digitsOnly = compact.startsWith('+') ? compact.slice(1) : compact;

  for (const dial of supportedDialCodes) {
    const digits = dial.slice(1);
    if (compact.startsWith(dial)) {
      return { dialCode: dial, localNumber: compact.slice(dial.length) };
    }

    if (digitsOnly.startsWith(digits)) {
      return { dialCode: dial, localNumber: digitsOnly.slice(digits.length) };
    }
  }

  return { dialCode: defaultDial, localNumber: digitsOnly || compact };
};

const statusVisuals: Record<BookingStatus, StatusVisualConfig> = {
  Scheduled: {
    Icon: CalendarTimeIcon,
    iconWrapperClassName: '',
    iconClassName: 'text-gray-700',
    textClassName: 'text-gray-700',
  },
  Completed: {
    Icon: CheckboxCheckedIcon,
    iconWrapperClassName: '',
    iconClassName: '',
    textClassName: '',
  },
  Cancelled: {
    Icon: CloseSquareIcon,
    iconWrapperClassName: '',
    iconClassName: '',
    textClassName: '',
  },
};

const platformVisuals: Record<PlatformStatus, PlatformVisualConfig> = {
  Website: {
    textClassName: 'text-gray-700',
  },
  'Social Media': {
    textClassName: 'text-gray-700',
  },
};

type StatusDropdownProps = {
  value: BookingStatus;
  onChange: (nextStatus: BookingStatus) => void;
  disabled?: boolean;
};

type platformDropdownProps = {
  value: PlatformStatus;
  onChange: (nextStatus: PlatformStatus) => void;
  disabled?: boolean;
};

const StatusDropdown: React.FC<StatusDropdownProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuPosition, setMenuPosition] = useState<DropdownPosition | null>(
    null
  );

  useEffect(() => {
    if (!isOpen) {
      setMenuPosition(null);
      return;
    }

    const updatePosition = () => {
      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (
        buttonRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (status: BookingStatus) => {
    onChange(status);
    setIsOpen(false);
  };

  const selectedVisuals = statusVisuals[value];
  const SelectedIcon = selectedVisuals.Icon;
  const portalTarget =
    typeof document !== 'undefined' ? document.body : undefined;

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        ref={buttonRef}
        className={clsx(
          'flex cursor-pointer items-center gap-3 rounded-full px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed'
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span
          className={clsx(
            'flex h-9 w-9 items-center justify-center rounded-full',
            selectedVisuals.iconWrapperClassName
          )}
        >
          <SelectedIcon
            className={clsx('h-5 w-5', selectedVisuals.iconClassName)}
          />
        </span>
        <span className={clsx('text-base', selectedVisuals.textClassName)}>
          {value}
        </span>
        <CaretDownIcon
          className={clsx(
            'ml-1 h-4 w-4 text-gray-500 transition-transform',
            isOpen ? 'rotate-180' : ''
          )}
        />
      </button>

      {isOpen && menuPosition && portalTarget
        ? createPortal(
            <div
              ref={menuRef}
              style={{
                position: 'absolute',
                top: menuPosition.top + 8,
                left: menuPosition.left,
                width: menuPosition.width,
                zIndex: 1500,
              }}
            >
              <div className="rounded-3xl border border-gray-200 bg-white p-2 shadow-xl">
                <div className="space-y-1">
                  {bookingStatusOptions.map((status) => {
                    const visuals = statusVisuals[status];
                    const isSelected = status === value;
                    const OptionIcon = visuals.Icon;

                    return (
                      <button
                        key={status}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelect(status)}
                        className={clsx(
                          'flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition hover:bg-gray-100',
                          isSelected ? 'bg-gray-100 font-semibold' : 'font-medium'
                        )}
                      >
                        <span
                          className={clsx(
                            'flex h-9 w-9 items-center justify-center rounded-full',
                            visuals.iconWrapperClassName
                          )}
                        >
                          <OptionIcon
                            className={clsx('h-5 w-5', visuals.iconClassName)}
                          />
                        </span>
                        <span className={clsx('text-base', visuals.textClassName)}>
                          {status}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>,
            portalTarget
          )
        : null}
    </div>
  );
};

type ActionDropdownProps = {
  booking: BookingRecord;
  onEdit?: (booking: BookingRecord) => void;
  onRemove?: (bookingId: string) => void;
};

const ActionDropdown: React.FC<ActionDropdownProps> = ({
  booking,
  onEdit,
  onRemove,
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<DropdownPosition | null>(
    null
  );

  useEffect(() => {
    if (!isOpen) {
      setMenuPosition(null);
      return;
    }

    const updatePosition = () => {
      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right + window.scrollX - 192,
        width: 192,
      });
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (
        buttonRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleEdit = () => {
    onEdit?.(booking);
    setIsOpen(false);
  };

  const handleRemove = () => {
    if (!booking.id) {
      return;
    }
    onRemove?.(booking.id);
    setIsOpen(false);
  };

  const portalTarget =
    typeof document !== 'undefined' ? document.body : undefined;

  return (
    <div className="relative">
      <button
        className="cursor-pointer p-1 text-gray-500 hover:text-gray-700"
        onClick={toggleDropdown}
        ref={buttonRef}
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {isOpen && menuPosition && portalTarget
        ? createPortal(
            <div
              ref={menuRef}
              style={{
                position: 'absolute',
                top: menuPosition.top,
                left: menuPosition.left,
                width: menuPosition.width,
                zIndex: 1500,
              }}
            >
              <div className="mt-1 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
                <div className="py-1">
                  <button
                    onClick={handleEdit}
                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <EditIcon className="h-4 w-4 text-gray-500" />
                    Edit
                  </button>
                  <button
                    onClick={handleRemove}
                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                  >
                    <RemoveIcon className="h-4 w-4 text-red-600" />
                    Remove
                  </button>
                </div>
              </div>
            </div>,
            portalTarget
          )
        : null}
    </div>
  );
};

const PlatformDropdown: React.FC<platformDropdownProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuPosition, setMenuPosition] = useState<DropdownPosition | null>(
    null
  );

  useEffect(() => {
    if (!isOpen) {
      setMenuPosition(null);
      return;
    }

    const updatePosition = () => {
      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (
        buttonRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (status: PlatformStatus) => {
    onChange(status);
    setIsOpen(false);
  };

  const selectedVisuals = platformVisuals[value];
  const portalTarget =
    typeof document !== 'undefined' ? document.body : undefined;

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        ref={buttonRef}
        className={clsx(
          'flex cursor-pointer items-center gap-3 rounded-full px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed'
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={clsx('text-base', selectedVisuals.textClassName)}>
          {value}
        </span>
        <CaretDownIcon
          className={clsx(
            'ml-1 h-4 w-4 text-gray-500 transition-transform',
            isOpen ? 'rotate-180' : ''
          )}
        />
      </button>

      {isOpen && menuPosition && portalTarget
        ? createPortal(
            <div
              ref={menuRef}
              style={{
                position: 'absolute',
                top: menuPosition.top + 8,
                left: menuPosition.left,
                width: menuPosition.width,
                zIndex: 1500,
              }}
            >
              <div className="rounded-3xl border border-gray-200 bg-white p-2 shadow-xl">
                <div className="space-y-1">
                  {platformStatusOptions?.map((status) => {
                    const visuals = platformVisuals[status];
                    const isSelected = status === value;

                    return (
                      <button
                        key={status}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelect(status)}
                        className={clsx(
                          'flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition hover:bg-gray-100',
                          isSelected ? 'bg-gray-100 font-semibold' : 'font-medium'
                        )}
                      >
                        <span className={clsx('text-base', visuals.textClassName)}>
                          {status}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>,
            portalTarget
          )
        : null}
    </div>
  );
};

const addOrdinalSuffix = (day: number) => {
  const remainderTen = day % 10;
  const remainderHundred = day % 100;

  if (remainderTen === 1 && remainderHundred !== 11) return `${day}st`;
  if (remainderTen === 2 && remainderHundred !== 12) return `${day}nd`;
  if (remainderTen === 3 && remainderHundred !== 13) return `${day}rd`;
  return `${day}th`;
};

const formatDisplayDate = (isoDate: string) => {
  const date = new Date(isoDate);
  const day = addOrdinalSuffix(date.getUTCDate());
  const month = date.toLocaleString('en-GB', { month: 'long' });
  const year = date.getUTCFullYear();

  return `${day} ${month} ${year}`;
};

const formatBookingDateSchedule = (value?: string) => {
  const normalizedValue = formatDateValueForForm(value);
  if (!normalizedValue) {
    return '—';
  }

  const parsed = new Date(normalizedValue);
  if (Number.isNaN(parsed.getTime())) {
    return sanitizeTextValue(value) || '—';
  }

  return formatDisplayDate(parsed.toISOString());
};

const formatBookingTimeSchedule = (value?: string) => {
  const formatted = formatTimeValueForForm(value);
  if (!formatted) {
    return '—';
  }

  if (/\b(?:a\.m|p\.m)\b/i.test(formatted)) {
    return formatted;
  }

  const normalized = formatted.includes(':')
    ? formatted
    : `${formatted.slice(0, 2)}:${formatted.slice(2)}`;

  const [hourPart, minutePart = '00'] = normalized.split(':');
  const hour = Number(hourPart);
  if (Number.isNaN(hour)) {
    return formatted;
  }

  const period = hour >= 12 ? 'p.m' : 'a.m';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  const minutes = minutePart.padStart(2, '0');

  return `${hour12}:${minutes} ${period}`;
};

const transformConsultationToBookingRecord = (
  consultation: Consultation
): BookingRecord => {
  const statusMap: Record<string, BookingStatus> = {
    scheduled: 'Scheduled',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };

  const extras = consultation as unknown as Record<string, unknown>;

  const pickString = (key: string) => {
    const value = extras[key];
    return typeof value === 'string' ? value : undefined;
  };

  const frontendStatus =
    statusMap[consultation.status.toLowerCase()] ?? consultation.status;

  const resolvedId = (() => {
    const primaryId = pickString('id');
    if (primaryId && primaryId.trim().length > 0) {
      return primaryId.trim();
    }

    const fallbackId = pickString('_id');
    if (fallbackId && fallbackId.trim().length > 0) {
      return fallbackId.trim();
    }

    return undefined;
  })();

  return {
    id: resolvedId ?? '',
    status: frontendStatus,
    submittedPlatform: (() => {
      const raw = pickString('submittedPlatform');
      if (!raw) return 'Website' as PlatformStatus;

      const cleaned = raw.trim().toLowerCase();
      if (cleaned === 'social media' || cleaned === 'social')
        return 'Social Media' as PlatformStatus;
      if (cleaned === 'website') return 'Website' as PlatformStatus;

      return 'Website' as PlatformStatus;
    })(),
    submittedDate: consultation.createdAt,
    name: consultation.user?.name ?? pickString('name') ?? 'N/A',
    email: consultation.user?.email ?? pickString('email') ?? 'N/A',
    phoneNumber: consultation.user?.phone ?? pickString('phoneNumber') ?? 'N/A',
    facebookAccount: pickString('facebookAccount'),
    bookingTimeSchedule:
      pickString('bookingTimeSchedule') ?? consultation.time ?? 'N/A',
    bookingDateSchedule:
      pickString('bookingDateSchedule') ?? pickString('bookingDate') ?? consultation.date,
    location: pickString('location') ?? 'N/A',
    question: pickString('question') ?? consultation.notes ?? 'N/A',
  };
};

const transformApplicationToBookingRecord = (application: any): BookingRecord => {
  const pick = (k: string) => {
    const v = application?.[k];
    if (typeof v === 'string') return v;
    if (v == null) return undefined;
    return String(v);
  };

  const resolvedId = pick('id') ?? pick('_id') ?? '';

  const rawPlatform = (pick('submittedPlatform') || pick('platform') || '').toLowerCase();
  const submittedPlatform = rawPlatform.includes('social') ? 'Social Media' : 'Website';

  const rawStatus = (pick('status') || pick('state') || '').toString().toLowerCase();
  const mapRawStatusToBookingStatus = (s: string): BookingStatus => {
    if (!s) return 'Scheduled';
    if (s.includes('complete') || s.includes('approved') || s.includes('accepted') || s.includes('done')) return 'Completed';
    if (s.includes('cancel') || s.includes('reject') || s.includes('rejected') || s.includes('declined')) return 'Cancelled';
    return 'Scheduled';
  };

  const normalizedStatus = mapRawStatusToBookingStatus(rawStatus);

  return {
    id: resolvedId,
    status: normalizedStatus,
    submittedPlatform: submittedPlatform as PlatformStatus,
    submittedDate: pick('createdAt') ?? pick('created_at') ?? pick('submittedAt') ?? '',
    name: pick('name') ?? pick('fullName') ?? (application.user?.name ?? 'N/A'),
    email: pick('email') ?? (application.user?.email ?? 'N/A'),
    phoneNumber: pick('phone') ?? pick('phoneNumber') ?? (application.user?.phone ?? 'N/A'),
    facebookAccount: pick('facebookAccount'),
    bookingTimeSchedule: pick('preferredTime') ?? pick('bookingTimeSchedule') ?? 'N/A',
    bookingDateSchedule: pick('preferredDate') ?? pick('bookingDateSchedule') ?? pick('createdAt') ?? '',
    location: pick('location') ?? 'N/A',
    question: pick('message') ?? pick('question') ?? 'N/A',
  };
};

const BookingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<BookingTab>('consultation');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortState, setSortState] = useState<SortState>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Set<string>>(
    () => new Set()
  );
  const [selectedConsultationIds, setSelectedConsultationIds] = useState<
    Set<string>
  >(() => new Set());
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | 'All'>(
    'All'
  );
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, BookingStatus>
  >({});
  const [applicationStatusOverrides, setApplicationStatusOverrides] = useState<
    Record<string, BookingStatus>
  >({});
  const [applicationPlatformOverrides, setApplicationPlatformOverrides] = useState<
    Record<string, PlatformStatus>
  >({});
  const [applicationFacebookOverrides, setApplicationFacebookOverrides] = useState<
    Record<string, string>
  >({});
  const [platformOverrides, setPlatformOverrides] = useState<
    Record<string, PlatformStatus>
  >({});
  const statusFilterRef = useRef<HTMLDivElement | null>(null);

  const statusQueryParam =
    selectedStatus === 'All' ? undefined : selectedStatus;

  const {
    data: consultationsData,
    isLoading,
    error,
    isError,
  } = useConsultations({
    status: statusQueryParam,
    page: currentPage,
    limit: 10,
  });

  const {
    data: applicationsData,
    isLoading: isApplicationsLoading,
    isError: isApplicationsError,
  } = useApplications({ page: currentPage, limit: 10 });

  

  const createConsultationMutation = useCreateConsultation();
  const createApplicationMutation = useCreateApplicationBooking();
  const consultationRows = useMemo(() => {
    if (!consultationsData?.data) {
      return [];
    }

    const transformedRows = consultationsData.data.map(
      transformConsultationToBookingRecord
    );
    return transformedRows;
  }, [consultationsData]);

  const applicationRows: BookingRecord[] = useMemo(() => {
    if (!applicationsData?.data) return [];
    try {
      return applicationsData.data.map(transformApplicationToBookingRecord);
    } catch (e) {
      console.error('Failed to transform applications:', e);
      return [];
    }
  }, [applicationsData]);

  useEffect(() => {
    setApplicationStatusOverrides((prev) => {
      if (Object.keys(prev).length === 0) {
        return prev;
      }

      const next: Record<string, BookingStatus> = {};

      applicationRows.forEach((row) => {
        if (!row.id) {
          return;
        }

        const override = prev[row.id];
        if (override && override !== row.status) {
          next[row.id] = override;
        }
      });

      const prevKeys = Object.keys(prev);
      const nextKeys = Object.keys(next);
      if (
        prevKeys.length === nextKeys.length &&
        prevKeys.every((key) => prev[key] === next[key])
      ) {
        return prev;
      }

      return next;
    });
  }, [applicationRows]);

  useEffect(() => {
    setApplicationPlatformOverrides((prev) => {
      if (Object.keys(prev).length === 0) {
        return prev;
      }

      const next: Record<string, PlatformStatus> = {};

      applicationRows.forEach((row) => {
        if (!row.id) {
          return;
        }

        const override = prev[row.id];
        if (override && override !== row.submittedPlatform) {
          next[row.id] = override;
        }
      });

      const prevKeys = Object.keys(prev);
      const nextKeys = Object.keys(next);
      if (
        prevKeys.length === nextKeys.length &&
        prevKeys.every((key) => prev[key] === next[key])
      ) {
        return prev;
      }

      return next;
    });
  }, [applicationRows]);

  useEffect(() => {
    setApplicationFacebookOverrides((prev) => {
      if (Object.keys(prev).length === 0) {
        return prev;
      }

      const next: Record<string, string> = {};

      applicationRows.forEach((row) => {
        if (!row.id) {
          return;
        }

        const override = prev[row.id];
        if (override !== undefined && override !== row.facebookAccount) {
          next[row.id] = override;
        }
      });

      const prevKeys = Object.keys(prev);
      const nextKeys = Object.keys(next);
      if (
        prevKeys.length === nextKeys.length &&
        prevKeys.every((key) => prev[key] === next[key])
      ) {
        return prev;
      }

      return next;
    });
  }, [applicationRows]);

  const applicationRowsWithOverrides = useMemo(() => {
    if (
      Object.keys(applicationStatusOverrides).length === 0 &&
      Object.keys(applicationPlatformOverrides).length === 0 &&
      Object.keys(applicationFacebookOverrides).length === 0
    ) {
      return applicationRows;
    }

    return applicationRows.map((row) => {
      if (!row.id) {
        return row;
      }

      let updatedRow = row;

      const statusOverride = applicationStatusOverrides[row.id];
      if (statusOverride && statusOverride !== row.status) {
        updatedRow = { ...updatedRow, status: statusOverride };
      }

      const platformOverride = applicationPlatformOverrides[row.id];
      if (platformOverride && platformOverride !== row.submittedPlatform) {
        updatedRow = { ...updatedRow, submittedPlatform: platformOverride };
      }

      const facebookOverride = applicationFacebookOverrides[row.id];
      if (
        facebookOverride !== undefined &&
        facebookOverride !== row.facebookAccount
      ) {
        updatedRow = { ...updatedRow, facebookAccount: facebookOverride };
      }

      return updatedRow;
    });
  }, [
    applicationRows,
    applicationStatusOverrides,
    applicationPlatformOverrides,
    applicationFacebookOverrides,
  ]);

  const updateApplicationStatusMutation = useUpdateApplicationStatus();
  const updateApplicationMutation = useUpdateApplicationBooking();

  useEffect(() => {
    setStatusOverrides((prev) => {
      const next: Record<string, BookingStatus> = {};

      consultationRows.forEach((row) => {
        if (!row.id) {
          return;
        }

        next[row.id] = prev[row.id] ?? row.status;
      });

      return next;
    });
  }, [consultationRows]);

  useEffect(() => {
    setPlatformOverrides((prev) => {
      const next: Record<string, PlatformStatus> = {};

      consultationRows.forEach((row) => {
        if (!row.id) return;
        next[row.id] = prev[row.id] ?? row.submittedPlatform;
      });

      return next;
    });
  }, [consultationRows]);

  const consultationRowsWithOverrides = useMemo(() => {
    if (
      Object.keys(statusOverrides).length === 0 &&
      Object.keys(platformOverrides).length === 0
    ) {
      return consultationRows;
    }

    return consultationRows.map((row) => {
      if (!row.id) {
        return row;
      }

      let updatedRow = row;

      const statusOverride = statusOverrides[row.id];
      if (statusOverride && statusOverride !== row.status) {
        updatedRow = { ...updatedRow, status: statusOverride };
      }

      const platformOverride = platformOverrides[row.id];
      if (platformOverride && platformOverride !== row.submittedPlatform) {
        updatedRow = { ...updatedRow, submittedPlatform: platformOverride };
      }

      return updatedRow;
    });
  }, [consultationRows, statusOverrides, platformOverrides]);

  const tabs: Array<{ key: BookingTab; label: string }> = useMemo(
    () => [
      { key: 'consultation', label: 'Consultation Booking' },
      { key: 'admission', label: 'Admission Application Booking' },
    ],
    []
  );

  const statusFilteredRows = useMemo(() => {
    const sourceRows = consultationRowsWithOverrides;

    if (selectedStatus === 'All') {
      return sourceRows;
    }

    return sourceRows.filter((row) => row.status === selectedStatus);
  }, [consultationRowsWithOverrides, selectedStatus]);

  const statusFilteredApplicationRows = useMemo(() => {
    if (selectedStatus === 'All') {
      return applicationRowsWithOverrides;
    }

    return applicationRowsWithOverrides.filter(
      (row) => row.status === selectedStatus
    );
  }, [applicationRowsWithOverrides, selectedStatus]);

  const filteredConsultationRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return statusFilteredRows;
    }

    return statusFilteredRows.filter((row) => {
      return [
        row.status,
        row.submittedPlatform,
        formatDisplayDate(row.submittedDate),
        row.name,
        row.email,
        row.phoneNumber,
        row.facebookAccount,
        row.bookingTimeSchedule,
        formatBookingDateSchedule(row.bookingDateSchedule),
        row.location,
        row.question,
      ]
        .join(' ')
        .toLowerCase()
        .includes(term);
    });
  }, [searchTerm, statusFilteredRows]);

  const sortedConsultationRows = useMemo(() => {
    if (!sortState) {
      return filteredConsultationRows;
    }

    const sortableKeys: Partial<Record<string, keyof BookingRecord>> = {
      status: 'status',
      submittedPlatform: 'submittedPlatform',
      submittedDate: 'submittedDate',
      name: 'name',
      email: 'email',
      phoneNumber: 'phoneNumber',
      bookingTimeSchedule: 'bookingTimeSchedule',
      bookingDateSchedule: 'bookingDateSchedule',
      location: 'location',
      question: 'question',
    };

    const key = sortableKeys[sortState.key];
    if (!key) {
      return filteredConsultationRows;
    }

    const rowsToSort = [...filteredConsultationRows];

    rowsToSort.sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        const comparison = valueA.localeCompare(valueB, undefined, {
          numeric: true,
          sensitivity: 'base',
        });
        return sortState.direction === 'asc' ? comparison : -comparison;
      }

      return 0;
    });

    return rowsToSort;
  }, [filteredConsultationRows, sortState]);

  const filteredApplicationRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return statusFilteredApplicationRows;

    return statusFilteredApplicationRows.filter((row) => {
      return [
        row.status,
        row.submittedPlatform,
        formatDisplayDate(row.submittedDate),
        row.name,
        row.email,
        row.phoneNumber,
        row.facebookAccount,
        row.bookingTimeSchedule,
        formatBookingDateSchedule(row.bookingDateSchedule),
        row.location,
        row.question,
      ]
        .join(' ')
        .toLowerCase()
        .includes(term);
    });
  }, [searchTerm, statusFilteredApplicationRows]);

  const sortedApplicationRows = useMemo(() => {
    if (!sortState) {
      return filteredApplicationRows;
    }

    const sortableKeys: Partial<Record<string, keyof BookingRecord>> = {
      status: 'status',
      submittedPlatform: 'submittedPlatform',
      submittedDate: 'submittedDate',
      name: 'name',
      email: 'email',
      phoneNumber: 'phoneNumber',
      bookingTimeSchedule: 'bookingTimeSchedule',
      bookingDateSchedule: 'bookingDateSchedule',
      location: 'location',
      question: 'question',
    };

    const key = sortableKeys[sortState.key];
    if (!key) {
      return filteredApplicationRows;
    }

    const rowsToSort = [...filteredApplicationRows];

    rowsToSort.sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        const comparison = valueA.localeCompare(valueB, undefined, {
          numeric: true,
          sensitivity: 'base',
        });
        return sortState.direction === 'asc' ? comparison : -comparison;
      }

      return 0;
    });

    return rowsToSort;
  }, [filteredApplicationRows, sortState]);

  const handleRowStatusChange = useCallback(
    (row: BookingRecord, nextStatus: BookingStatus) => {
      if (!row.id) {
        console.warn('Cannot update booking status without a valid id.', row);
        return;
      }

      if (activeTab === 'admission') {
        const hadExistingOverride =
          applicationStatusOverrides[row.id] !== undefined;
        const previousStatus = hadExistingOverride
          ? applicationStatusOverrides[row.id]
          : row.status;

        if (previousStatus === nextStatus) {
          return;
        }

        setApplicationStatusOverrides((prev) => ({
          ...prev,
          [row.id]: nextStatus,
        }));

        updateApplicationStatusMutation
          .mutateAsync({
            applicationId: row.id,
            status: nextStatus.toLowerCase() as BookingStatusApi,
          })
          .catch((error) => {
            console.error(
              'Failed to update admission application status:',
              error
            );

            setApplicationStatusOverrides((prev) => {
              if (!hadExistingOverride) {
                const rest = { ...prev };
                delete rest[row.id];
                return rest;
              }

              return {
                ...prev,
                [row.id]: previousStatus,
              };
            });
          });

        return;
      }

      setStatusOverrides((prev) => {
        if (prev[row.id] === nextStatus) {
          return prev;
        }

        return {
          ...prev,
          [row.id]: nextStatus,
        };
      });
    },
    [
      activeTab,
      applicationStatusOverrides,
      setApplicationStatusOverrides,
      setStatusOverrides,
      updateApplicationStatusMutation,
    ]
  );

  const handleRowPlatformChange = useCallback(
    (row: BookingRecord, nextPlatform: PlatformStatus) => {
      if (!row.id) {
        console.warn(
          'Cannot update consultation platform without a valid id.',
          row
        );
        return;
      }

      if (activeTab === 'admission') {
        const hadExistingOverride =
          applicationPlatformOverrides[row.id] !== undefined;
        const previousPlatform = hadExistingOverride
          ? applicationPlatformOverrides[row.id]
          : row.submittedPlatform;

        if (previousPlatform === nextPlatform) {
          return;
        }

        setApplicationPlatformOverrides((prev) => ({
          ...prev,
          [row.id]: nextPlatform,
        }));

        updateApplicationMutation
          .mutateAsync({
            applicationId: row.id,
            payload: {
              submittedPlatform: mapPlatformToApi(nextPlatform),
            },
          })
          .catch((error) => {
            console.error(
              'Failed to update admission application platform:',
              error
            );

            setApplicationPlatformOverrides((prev) => {
              if (!hadExistingOverride) {
                const rest = { ...prev };
                delete rest[row.id];
                return rest;
              }

              return {
                ...prev,
                [row.id]: previousPlatform,
              };
            });
          });

        return;
      }

      setPlatformOverrides((prev) => {
        if (prev[row.id] === nextPlatform) {
          return prev;
        }

        return {
          ...prev,
          [row.id]: nextPlatform,
        };
      });
    },
    [
      activeTab,
      applicationPlatformOverrides,
      setApplicationPlatformOverrides,
      setPlatformOverrides,
      updateApplicationMutation,
    ]
  );

  const bookingColumns = useMemo<TableColumn<BookingRecord>[]>(
    () => [
      {
        key: 'status',
        header: 'Status',
        minWidth: 200,
        align: 'center',
        headerClassName: 'text-center',
        headerContentClassName: 'flex w-full justify-center',
        render: (row) => (
          <StatusDropdown
            value={row.status}
            onChange={(nextStatus) => handleRowStatusChange(row, nextStatus)}
            disabled={!row.id}
          />
        ),
      },
      {
        key: 'submittedPlatform',
        header: 'Submitted Platform',
        minWidth: 200,
        sortable: true,
        headerClassName: 'whitespace-nowrap',
        headerContentClassName: 'whitespace-nowrap',
        render: (row) => (
          <PlatformDropdown
            value={row.submittedPlatform}
            onChange={(nextPlatform) =>
              handleRowPlatformChange(row, nextPlatform)
            }
            disabled={!row.id}
          />
        ),
      },
      {
        key: 'submittedDate',
        header: 'Submitted Date',
        sortable: true,
        headerClassName: 'whitespace-nowrap',
        headerContentClassName: 'whitespace-nowrap',
        cellClassName: 'whitespace-nowrap',
        render: (row) => formatDisplayDate(row.submittedDate),
      },
      {
        key: 'name',
        header: 'Name',
        minWidth: 200,
        sortable: true,
      },
      {
        key: 'email',
        header: 'Email',
        minWidth: 220,
        sortable: true,
      },
      {
        key: 'phoneNumber',
        header: 'Phone Number',
        minWidth: 160,
      },
      {
        key: 'facebookAccount',
        header: 'Facebook Account',
        minWidth: 180,
        render: (row) => (
          <div className="max-w-xs truncate" title={row.facebookAccount}>
            {row.facebookAccount || '—'}
          </div>
        ),
      },
      {
        key: 'bookingTimeSchedule',
        header: 'Booking Time',
        minWidth: 140,
        sortable: true,
        headerClassName: 'whitespace-nowrap',
        headerContentClassName: 'whitespace-nowrap',
        cellClassName: 'whitespace-nowrap',
        render: (row) => formatBookingTimeSchedule(row.bookingTimeSchedule),
      },
      {
        key: 'bookingDateSchedule',
        header: 'Booking Date',
        minWidth: 160,
        sortable: true,
        headerClassName: 'whitespace-nowrap',
        headerContentClassName: 'whitespace-nowrap',
        cellClassName: 'whitespace-nowrap',
        render: (row) => formatBookingDateSchedule(row.bookingDateSchedule),
      },
      {
        key: 'location',
        header: 'Location',
        minWidth: 120,
        sortable: true,
      },
      {
        key: 'question',
        header: 'Question',
        minWidth: 200,
        render: (row) => (
          <div className="max-w-xs truncate" title={row.question}>
            {row.question}
          </div>
        ),
      },
    ],
    [handleRowStatusChange, handleRowPlatformChange]
  );

  const tableData = useMemo<BookingRecord[]>(() => {
    if (activeTab === 'consultation') return sortedConsultationRows;
    return sortedApplicationRows;
  }, [activeTab, sortedConsultationRows, sortedApplicationRows]);

  useEffect(() => {
    setSelectedRowKeys(new Set());
    setSelectedConsultationIds(new Set());
    setSortState(undefined);
  }, [activeTab]);

  useEffect(() => {
    setSelectedRowKeys(new Set());
    setSelectedConsultationIds(new Set());
    setCurrentPage(1);
  }, [selectedStatus]);

  useEffect(() => {
    if (!showStatusFilter) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        statusFilterRef.current &&
        !statusFilterRef.current.contains(event.target as Node)
      ) {
        setShowStatusFilter(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatusFilter]);

  const getRowKey = useCallback((row: BookingRecord, index: number) => {
    return row.id ? `${row.id}::${index}` : `row-${index}`;
  }, []);

  const handleSelectRow = useCallback(
    (row: BookingRecord, rowIndex: number, selected: boolean) => {
      if (typeof row.id !== 'string' || row.id.trim().length === 0) {
        console.warn('Cannot select consultation row without a valid id.', row);
        return;
      }

      setSelectedRowKeys((prev) => {
        const next = new Set(prev);
        const key = getRowKey(row, rowIndex);
        if (selected) {
          next.add(key);
        } else {
          next.delete(key);
        }
        return next;
      });

      setSelectedConsultationIds((prev) => {
        const next = new Set(prev);
        if (selected) {
          next.add(row.id);
        } else {
          next.delete(row.id);
        }
        return next;
      });
    },
    [getRowKey]
  );

  const handleSelectAll = useCallback(
    (selected: boolean) => {
      if (!selected) {
        setSelectedRowKeys(new Set());
        setSelectedConsultationIds(new Set());
        return;
      }

      if (tableData.length === 0) {
        setSelectedRowKeys(new Set());
        setSelectedConsultationIds(new Set());
        return;
      }

      const nextRowKeys = new Set<string>();
      const nextIds = new Set<string>();

      tableData.forEach((row, index) => {
        if (typeof row.id !== 'string' || row.id.trim().length === 0) {
          console.warn('Skipping consultation row without a valid id.', row);
          return;
        }

        nextRowKeys.add(getRowKey(row, index));
        nextIds.add(row.id);
      });

      if (nextIds.size === 0) {
        console.warn(
          'No rows with valid consultation ids are available to select.'
        );
        setSelectedRowKeys(new Set());
        setSelectedConsultationIds(new Set());
        return;
      }

      setSelectedRowKeys(nextRowKeys);
      setSelectedConsultationIds(nextIds);
    },
    [getRowKey, tableData]
  );

  const isAllSelected =
    tableData.length > 0 &&
    tableData.every((row, index) => selectedRowKeys.has(getRowKey(row, index)));

  const bulkDeleteConsultationsMutation = useBulkDeleteConsultations();
  const bulkDeleteApplicationsMutation = useBulkDeleteApplications();
  const deleteConsultationMutation = useDeleteConsultation();
  const updateConsultationMutation = useUpdateConsultation();

  const isDeleteActionPending =
    activeTab === 'consultation'
      ? bulkDeleteConsultationsMutation.isPending ||
        deleteConsultationMutation.isPending
      : bulkDeleteApplicationsMutation.isPending;

  const [editingInitialValues, setEditingInitialValues] = useState<
    AddBookingFormValues | null
  >(null);
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [editingBookingType, setEditingBookingType] = useState<BookingTab>('consultation');
  const [isEditRemovePending, setIsEditRemovePending] = useState(false);

  const defaultEditInitialValues: AddBookingFormValues = {
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

  const handleEditClick = (booking: BookingRecord) => {
    if (!booking.id) {
      console.warn('Cannot edit consultation booking without a valid id.', booking);
      return;
    }

    const sanitizedTime = sanitizeTextValue(booking.bookingTimeSchedule);
    const normalizedDate = formatDateValueForForm(booking.bookingDateSchedule);
    const { dialCode, localNumber } = extractPhonePartsForForm(
      booking.phoneNumber
    );

    const initial: AddBookingFormValues = {
      status: booking.status,
      submittedPlatform: booking.submittedPlatform,
      name: sanitizeTextValue(booking.name),
      email: sanitizeTextValue(booking.email),
      countryDialCode: dialCode,
      phoneNumber: localNumber,
      facebookAccount: sanitizeTextValue(booking.facebookAccount),
      bookingTimeSchedule: sanitizedTime
        ? formatTimeValueForForm(sanitizedTime)
        : '',
      bookingDateSchedule: normalizedDate,
      location: sanitizeTextValue(booking.location, 'Myanmar') || 'Myanmar',
      question: sanitizeTextValue(booking.question),
    };

    setEditingBookingId(booking.id);
    setEditingBookingType(activeTab);
    setEditingInitialValues(initial);
    setIsEditDrawerOpen(true);
  };

  const handleRemove = useCallback(
    async (bookingId: string, bookingType?: BookingTab) => {
      const targetType = bookingType ?? activeTab;

      try {
        if (targetType === 'consultation') {
          await deleteConsultationMutation.mutateAsync(bookingId);
        } else {
          await bulkDeleteApplicationsMutation.mutateAsync([bookingId]);
        }

        // Clear selection if it included the removed id
        setSelectedConsultationIds((prev) => {
          const next = new Set(prev);
          next.delete(bookingId);
          return next;
        });
        setSelectedRowKeys(new Set());
      } catch (error) {
        const context =
          targetType === 'consultation'
            ? 'Failed to remove consultation booking:'
            : 'Failed to remove admission application:';
        console.error(context, error);
      }
    },
    [
      activeTab,
      bulkDeleteApplicationsMutation,
      deleteConsultationMutation,
      setSelectedConsultationIds,
      setSelectedRowKeys,
    ]
  );

  const handleRemoveFromEditDrawer = async () => {
    if (!editingBookingId) {
      return;
    }

    setIsEditRemovePending(true);
    try {
      await handleRemove(editingBookingId, editingBookingType);
      handleCloseEditDrawer();
    } finally {
      setIsEditRemovePending(false);
    }
  };

  const handleDeleteSelected = useCallback(async () => {
    if (selectedConsultationIds.size === 0) {
      return;
    }

    const rawIds = Array.from(selectedConsultationIds);
    const ids = rawIds.filter(
      (value): value is string =>
        typeof value === 'string' && value.trim().length > 0
    );

    if (ids.length === 0) {
      console.warn('No valid booking IDs selected for deletion.', rawIds);
      return;
    }

    if (ids.length < rawIds.length) {
      console.warn('Skipping booking IDs that are invalid or empty.', rawIds);
    }

    if (activeTab === 'consultation') {
      try {
        await bulkDeleteConsultationsMutation.mutateAsync(ids);
        setSelectedRowKeys(new Set());
        setSelectedConsultationIds(new Set());
      } catch (error) {
        console.error('Failed to delete consultation booking:', error);
        try {
          // Fallback to individual deletes if the bulk endpoint is unavailable
          for (const consultationId of ids) {
            await deleteConsultationMutation.mutateAsync(consultationId);
          }
          setSelectedRowKeys(new Set());
          setSelectedConsultationIds(new Set());
        } catch (singleDeleteError) {
          console.error('Fallback single delete failed:', singleDeleteError);
        }
      }
      return;
    }

    try {
      await bulkDeleteApplicationsMutation.mutateAsync(ids);
      setSelectedRowKeys(new Set());
      setSelectedConsultationIds(new Set());
    } catch (error) {
      console.error('Failed to delete admission applications:', error);
      try {
        for (const applicationId of ids) {
          await bulkDeleteApplicationsMutation.mutateAsync([applicationId]);
        }
        setSelectedRowKeys(new Set());
        setSelectedConsultationIds(new Set());
      } catch (singleDeleteError) {
        console.error('Fallback admission delete failed:', singleDeleteError);
      }
    }
  }, [
    activeTab,
    bulkDeleteApplicationsMutation,
    bulkDeleteConsultationsMutation,
    deleteConsultationMutation,
    selectedConsultationIds,
  ]);

  const handleSortChange = (state: SortState) => {
    setSortState(state);
  };

  const handleTabChange = (tabKey: BookingTab) => {
    setActiveTab(tabKey);
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusSelect = (status: BookingStatus | 'All') => {
    setSelectedStatus((prev) => {
      if (prev === status) {
        return status === 'All' ? prev : 'All';
      }
      return status;
    });
    setShowStatusFilter(false);
  };

  const selectedStatusesLabel =
    activeTab === 'consultation'
      ? selectedStatus === 'All'
        ? 'consultations'
        : `${selectedStatus} consultations`
      : 'applications';

  const emptyMessage =
    activeTab === 'consultation'
      ? isLoading
        ? 'Loading consultations...'
        : searchTerm
          ? 'No bookings match your search criteria.'
          : `No ${selectedStatusesLabel} available.`
      : isApplicationsLoading
        ? 'Loading applications...'
        : searchTerm
          ? 'No bookings match your search criteria.'
          : `No ${selectedStatusesLabel} available.`;

  const pagination = activeTab === 'consultation' ? consultationsData?.pagination : applicationsData?.pagination;

  const handleOpenAddDrawer = () => {
    setIsAddDrawerOpen(true);
  };

  const handleCloseAddDrawer = () => {
    setIsAddDrawerOpen(false);
  };

  const handleCloseEditDrawer = () => {
    setIsEditDrawerOpen(false);
    setEditingBookingId(null);
    setEditingInitialValues(null);
    setEditingBookingType('consultation');
    setIsEditRemovePending(false);
  };

  const buildConsultationPayload = (
    values: AddBookingFormValues
  ): CreateConsultationRequest => {
    const normalizeSubmittedPlatform = () => {
      const raw = values.submittedPlatform.trim().toLowerCase();
      if (raw === 'social media' || raw === 'social') {
        return 'social media';
      }
      if (raw === 'website') {
        return 'website';
      }
      return raw || 'website';
    };

    const normalizePhoneNumber = () => {
      const dialCode = values.countryDialCode.trim();
      const basePhone = values.phoneNumber.trim();
      if (!basePhone) {
        return '';
      }

      const sanitizedPhone = basePhone.replace(/\s+/g, '');
      if (sanitizedPhone.startsWith('+')) {
        return sanitizedPhone;
      }

      const sanitizedDial = dialCode.replace(/\s+/g, '');
      if (!sanitizedDial) {
        return sanitizedPhone;
      }

      const dialDigits = sanitizedDial.startsWith('+')
        ? sanitizedDial.slice(1)
        : sanitizedDial;
      const phoneDigits = sanitizedPhone.replace(/^\+/, '');
      const needsDialPrefix = !phoneDigits.startsWith(dialDigits);
      const combined = needsDialPrefix
        ? `${dialDigits}${phoneDigits}`
        : phoneDigits;
      return `+${combined}`;
    };

    return {
      name: values.name.trim(),
      email: values.email.trim(),
      phoneNumber: normalizePhoneNumber(),
      bookingTimeSchedule: formatTimeValueForApi(values.bookingTimeSchedule),
      bookingDateSchedule: values.bookingDateSchedule,
      submittedPlatform: normalizeSubmittedPlatform(),
      status: values.status.toLowerCase() as BookingStatusApi,
      location: values.location.trim() || undefined,
      question: values.question.trim() || undefined,
      facebookAccount: values.facebookAccount.trim() || undefined,
    };
  };

const mapPlatformToDisplay = (platform: string): PlatformStatus => {
  const normalized = platform.trim().toLowerCase();
  if (normalized === 'social media' || normalized === 'social') {
    return 'Social Media';
  }
  return 'Website';
};

const mapPlatformToApi = (platform: PlatformStatus | string): string => {
  const normalized = platform.toString().trim().toLowerCase();
  if (normalized === 'social media' || normalized === 'social') {
    return 'social media';
  }
  return 'website';
};

  const handleAddConsultationBooking = async (values: AddBookingFormValues) => {
    try {
      const consultationData = buildConsultationPayload(values);

      await createConsultationMutation.mutateAsync(consultationData);

      handleCloseAddDrawer();
      setSelectedRowKeys(new Set());
      setSelectedConsultationIds(new Set());
      setSortState(undefined);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to create consultation booking';
      console.error(`Error: ${errorMessage}`);
    }
  };
  const handleAddAdmissionApplication = async (values: AddBookingFormValues) => {
    try {
      const applicationPayload = buildConsultationPayload(values);

      await createApplicationMutation.mutateAsync(applicationPayload);

      handleCloseAddDrawer();
      setSelectedRowKeys(new Set());
      setSelectedConsultationIds(new Set());
      setSortState(undefined);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to create admission application';
      console.error(`Error: ${errorMessage}`);
    }
  };

  const handleEditBooking = async (values: AddBookingFormValues) => {
    if (!editingBookingId) {
      console.error('No booking id available for editing.');
      return;
    }

    try {
      const payload = buildConsultationPayload(values);

      if (editingBookingType === 'consultation') {
        await updateConsultationMutation.mutateAsync({
          consultationId: editingBookingId,
          payload,
        });

        setStatusOverrides((prev) => ({
          ...prev,
          [editingBookingId]: values.status,
        }));

        setPlatformOverrides((prev) => ({
          ...prev,
          [editingBookingId]: mapPlatformToDisplay(values.submittedPlatform),
        }));
      } else {
        await updateApplicationMutation.mutateAsync({
          applicationId: editingBookingId,
          payload,
        });

        setApplicationStatusOverrides((prev) => ({
          ...prev,
          [editingBookingId]: values.status,
        }));

        setApplicationPlatformOverrides((prev) => ({
          ...prev,
          [editingBookingId]: mapPlatformToDisplay(values.submittedPlatform),
        }));

        setApplicationFacebookOverrides((prev) => ({
          ...prev,
          [editingBookingId]: sanitizeTextValue(values.facebookAccount, ''),
        }));
      }

      handleCloseEditDrawer();
      setSelectedRowKeys(new Set());
      setSelectedConsultationIds(new Set());
      setSortState(undefined);
    } catch (error) {
      const context =
        editingBookingType === 'consultation'
          ? 'Failed to update consultation booking:'
          : 'Failed to update admission application booking:';
      console.error(context, error);
    }
  };

  const renderActions = (booking: BookingRecord) => (
    <ActionDropdown
      booking={booking}
      onEdit={handleEditClick}
      onRemove={handleRemove}
    />
  );

  const isActiveLoading = activeTab === 'consultation' ? isLoading : isApplicationsLoading;
  const isActiveError = activeTab === 'consultation' ? isError : isApplicationsError;

  if (isActiveLoading) {
    return (
      <div className="space-y-8 text-gray-700">
        <section className="space-y-6 mt-6">
          <div className="flex flex-wrapitems-center gap-6 pb-3">
            {tabs?.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  className={clsx(
                    "text-h4 relative cursor-pointer pb-3 font-semibold text-gray-500 transition-colors after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:rounded-full after:transition-colors after:duration-200 after:content-['']",
                    isActive
                      ? 'text-primary after:bg-primary'
                      : 'hover:text-primary after:bg-transparent'
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="animate-pulse">
            <div className="mb-6 h-8 w-1/3 rounded bg-gray-200"></div>
            <div className="mb-4 h-12 rounded bg-gray-200"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 rounded bg-gray-200"></div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (isActiveError) {
    return (
      <div className="space-y-8 text-gray-700">
        <section className="space-y-6 mt-6">
          <div className="flex flex-wrap items-center gap-6 pb-3">
            {tabs?.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  className={clsx(
                    "text-h4 relative cursor-pointer pb-3 font-semibold text-gray-500 transition-colors after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:rounded-full after:transition-colors after:duration-200 after:content-['']",
                    isActive
                      ? 'text-primary after:bg-primary'
                      : 'hover:text-primary after:bg-transparent'
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="py-12 text-center">
            <div className="mb-4 text-red-500">
              <svg
                className="mx-auto h-16 w-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Error Loading Bookings
            </h3>
            <p className="mb-4 text-gray-600">
              {error?.message || 'Failed to load consultation bookings'}
            </p>
            <button
              className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-gray-700">
      <section className="space-y-6 mt-6">
        <div className="flex flex-wrap items-center gap-6 pb-3">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key)}
                className={clsx(
                  "text-h4 relative cursor-pointer pb-3 font-semibold text-gray-500 transition-colors after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:rounded-full after:transition-colors after:duration-200 after:content-['']",
                  isActive
                    ? 'text-primary after:bg-primary'
                    : 'hover:text-primary after:bg-transparent'
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

          <div className="flex flex-row gap-3">
          <p className="text-h2 text-text-primary">
            {activeTab === 'consultation' ? 'Total Consultation Booking' : 'Total Admission Applications'}
          </p>
          <p className="text-h2 text-text-primary font-semibold">
            {activeTab === 'consultation' ? (consultationsData?.total || 0) : (applicationsData?.total || 0)}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative z-50 flex max-w-md justify-between space-x-5">
            <div className="relative max-w-md min-w-[290px] flex-1">
              <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400">
                <SearchIcon className="h-5 w-5" />
              </span>
              <input
                type="search"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search Name, Email, Status..."
                className="focus:ring-primary/20 w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:outline-none"
              />
            </div>

            {/* Status Filter Dropdown */}
            <div className="relative" ref={statusFilterRef}>
              <button
                type="button"
                onClick={() => setShowStatusFilter((prev) => !prev)}
                className="bg-secondary flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-red-200"
              >
                <FilterIcon className="h-4 w-4" />
                {selectedStatus === 'All' ? 'Status' : selectedStatus}
              </button>

              {showStatusFilter && (
                <div className="absolute top-full left-0 z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg">
                  <div className="space-y-3 p-4">
                    {[
                      { value: 'All' as const, label: 'All Status' },
                      ...bookingStatusOptions.map((status) => ({
                        value: status,
                        label: status,
                      })),
                    ].map((option) => {
                      const isSelected = selectedStatus === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleStatusSelect(option.value)}
                          className="flex w-full cursor-pointer items-center gap-3 rounded p-2 hover:bg-gray-50"
                        >
                          <span
                            className={clsx(
                              'inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium transition-colors',
                              isSelected ? 'text-primary' : ''
                            )}
                          >
                            {option.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {selectedRowKeys.size > 0 && (
              <button
                type="button"
                onClick={handleDeleteSelected}
                disabled={isDeleteActionPending}
                className={clsx(
                  'bg-secondary flex items-center gap-2 rounded-xl px-4 py-2 text-gray-700 transition-colors hover:bg-red-200',
                  isDeleteActionPending && 'cursor-wait opacity-70'
                )}
              >
                <RemoveIcon className="h-4 w-4" />
                {isDeleteActionPending ? 'Deleting...' : `Remove`}
              </button>
            )}
            <Button
              type="button"
              className="rounded-full px-5"
              onClick={handleOpenAddDrawer}
              disabled={
                activeTab === 'consultation'
                  ? createConsultationMutation.isPending
                  : createApplicationMutation.isPending
              }
            >
              {activeTab === 'consultation'
                ? createConsultationMutation.isPending
                  ? 'Creating...'
                  : '+ Consultation Record'
                : createApplicationMutation.isPending
                ? 'Submitting...'
                : '+ Admission Applicant Record'}
            </Button>
          </div>
        </div>

        <DataTable
          columns={bookingColumns}
          data={tableData}
          getRowId={getRowKey}
          selectable
          isAllSelected={isAllSelected}
          onSelectAll={handleSelectAll}
          isRowSelected={(row, index) =>
            selectedRowKeys.has(getRowKey(row, index))
          }
        onSelectRow={handleSelectRow}
        sortState={sortState}
        renderActions={renderActions}
        onSortChange={handleSortChange}
        emptyMessage={emptyMessage}
        maxBodyHeight={BOOKING_TABLE_MAX_BODY_HEIGHT}
        className="overflow-visible"
      />

        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage(
                    Math.min(pagination.totalPages, currentPage + 1)
                  )
                }
                disabled={currentPage >= pagination.totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {(currentPage - 1) * 10 + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * 10, pagination.total)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.total}</span>{' '}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage <= 1}
                    className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
                    Page {currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage(
                        Math.min(pagination.totalPages, currentPage + 1)
                      )
                    }
                    disabled={currentPage >= pagination.totalPages}
                    className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </section>

      <AddBookingDrawer
        open={isAddDrawerOpen}
        onClose={handleCloseAddDrawer}
        onSubmit={activeTab === 'consultation' ? handleAddConsultationBooking : handleAddAdmissionApplication}
        title={activeTab === 'consultation' ? 'Add Consultation Booking' : 'Add Admission Application Booking'}
        submitLabel="Add"
      />

      <EditBookingDrawer 
        open={isEditDrawerOpen}
        onClose={handleCloseEditDrawer}
        onSubmit={handleEditBooking}
        initialValues={editingInitialValues ?? defaultEditInitialValues}
        title={
          editingBookingType === 'consultation'
            ? 'Edit Consultation Booking'
            : 'Edit Admission Application Booking'
        }
        onRemove={editingBookingId ? handleRemoveFromEditDrawer : undefined}
        isRemoveLoading={isEditRemovePending}
        isRemoveDisabled={isEditRemovePending}
      />
    </div>
  );
};

export default BookingsPage;
