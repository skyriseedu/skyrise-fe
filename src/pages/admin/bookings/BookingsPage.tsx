import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
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

  return (
    <div ref={containerRef} className="relative inline-flex">
      <button
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
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

      {isOpen ? (
        <div className="absolute top-full left-0 z-30 mt-2 w-56 rounded-3xl border border-gray-200 bg-white p-2 shadow-xl">
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
      ) : null}
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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown === booking.id) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [booking.id, openDropdown]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="cursor-pointer p-1 text-gray-500 hover:text-gray-700"
        onClick={() =>
          setOpenDropdown(openDropdown === booking.id ? null : booking.id)
        }
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {openDropdown === booking.id && (
        <div className="absolute right-0 z-10 mt-1 w-38 rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="py-1">
            <button
              onClick={() => onEdit?.(booking)}
              className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              <EditIcon className="h-4 w-4 text-gray-500" />
              Edit
            </button>
            <button
              onClick={() => booking.id && onRemove?.(booking.id)}
              className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
            >
              <RemoveIcon className="h-4 w-4 text-red-600" />
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const PlatformDropdown: React.FC<platformDropdownProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
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

  return (
    <div ref={containerRef} className="relative inline-flex">
      <button
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
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

      {isOpen ? (
        <div className="absolute top-full left-0 z-30 mt-2 w-56 rounded-3xl border border-gray-200 bg-white p-2 shadow-xl">
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
      ) : null}
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

// NOTE: removed unused statusFilterOptionStyles constant to avoid unused variable lint errors.

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

      // Fallback: if it doesn't match known values, default to Website
      return 'Website' as PlatformStatus;
    })(),
    submittedDate: consultation.createdAt,
    name: consultation.user?.name ?? pickString('name') ?? 'N/A',
    email: consultation.user?.email ?? pickString('email') ?? 'N/A',
    phoneNumber: consultation.user?.phone ?? pickString('phoneNumber') ?? 'N/A',
    facebookAccount: pickString('facebookAccount'),
    bookingTimeSchedule:
      pickString('bookingTimeSchedule') ?? consultation.time ?? 'N/A',
    bookingDateSchedule: consultation.date,
    location: pickString('location') ?? 'N/A',
    question: pickString('question') ?? consultation.notes ?? 'N/A',
  };
};

// renderActions will be created inside the BookingsPage so it can access
// handlers and state (edit/remove). The earlier top-level shortcut is removed.

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
    'Scheduled'
  );
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, BookingStatus>
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

  const createConsultationMutation = useCreateConsultation();
  const consultationRows = useMemo(() => {
    if (!consultationsData?.data) {
      return [];
    }

    const transformedRows = consultationsData.data.map(
      transformConsultationToBookingRecord
    );
    return transformedRows;
  }, [consultationsData]);

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
        row.bookingTimeSchedule,
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

  const handleRowStatusChange = useCallback(
    (row: BookingRecord, nextStatus: BookingStatus) => {
      if (!row.id) {
        console.warn(
          'Cannot update consultation status without a valid id.',
          row
        );
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
    []
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
    []
  );

  const bookingColumns = useMemo<TableColumn<BookingRecord>[]>(
    () => [
      {
        key: 'status',
        header: 'Status',
        minWidth: 200,
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
        key: 'bookingTimeSchedule',
        header: 'Booking Time',
        minWidth: 140,
        sortable: true,
        headerClassName: 'whitespace-nowrap',
        headerContentClassName: 'whitespace-nowrap',
        cellClassName: 'whitespace-nowrap',
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

  const tableData = useMemo(
    () => (activeTab === 'consultation' ? sortedConsultationRows : []),
    [activeTab, sortedConsultationRows]
  );

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
  const deleteConsultationMutation = useDeleteConsultation();

  // State to hold the initial values for editing a booking.
  const [editingInitialValues, setEditingInitialValues] = useState<
    AddBookingFormValues | null
  >(null);

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
    const initial: AddBookingFormValues = {
      status: booking.status,
      submittedPlatform: booking.submittedPlatform,
      name: booking.name ?? '',
      email: booking.email ?? '',
      countryDialCode: '+95',
      phoneNumber: booking.phoneNumber ?? '',
      facebookAccount: booking.facebookAccount ?? '',
      bookingTimeSchedule: booking.bookingTimeSchedule ?? '',
      bookingDateSchedule: booking.bookingDateSchedule ?? '',
      location: booking.location ?? 'Myanmar',
      question: booking.question ?? '',
    };

    setEditingInitialValues(initial);
    setIsEditDrawerOpen(true);
  };

  const handleRemove = async (bookingId: string) => {
    try {
      await deleteConsultationMutation.mutateAsync(bookingId);
      // Clear selection if it included the removed id
      setSelectedConsultationIds((prev) => {
        const next = new Set(prev);
        next.delete(bookingId);
        return next;
      });
      setSelectedRowKeys(new Set());
    } catch (error) {
      console.error('Failed to remove consultation booking:', error);
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
      console.warn('No valid consultation IDs selected for deletion.', rawIds);
      return;
    }

    if (ids.length < rawIds.length) {
      console.warn(
        'Skipping consultation IDs that are invalid or empty.',
        rawIds
      );
    }

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
  }, [
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

  const totalBookings = consultationsData?.total || 0;

  const selectedStatusesLabel =
    selectedStatus === 'All'
      ? 'consultations'
      : `${selectedStatus} consultations`;

  const emptyMessage = isLoading
    ? 'Loading consultations...'
    : searchTerm
      ? 'No bookings match your search criteria.'
      : `No ${selectedStatusesLabel} available.`;

  const pagination = consultationsData?.pagination;

  const handleOpenAddDrawer = () => {
    setIsAddDrawerOpen(true);
  };

  const handleCloseAddDrawer = () => {
    setIsAddDrawerOpen(false);
  };

   const handleCloseEditDrawer = () => {
    setIsEditDrawerOpen(false);
  };

  const handleAddConsultationBooking = async (values: AddBookingFormValues) => {
    try {
      const transformBookingTime = (timeString: string): string => {
        return timeString.replace(/\s+(a\.m|p\.m)$/i, '');
      };

      const normalizePhoneNumber = () => {
        const parts = [
          values.countryDialCode.trim(),
          values.phoneNumber.trim(),
        ].filter(Boolean);
        return parts.join('').replace(/\s+/g, '');
      };

      const consultationData: CreateConsultationRequest = {
        name: values.name.trim(),
        email: values.email.trim(),
        phoneNumber: normalizePhoneNumber(),
        bookingTimeSchedule: transformBookingTime(values.bookingTimeSchedule),
        bookingDateSchedule: values.bookingDateSchedule,
        submittedPlatform: values.submittedPlatform.trim(),
        status: values.status.toLowerCase() as BookingStatusApi,
        location: values.location.trim() || undefined,
        question: values.question.trim() || undefined,
        facebookAccount: values.facebookAccount.trim() || undefined,
      };

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

  const handleEditConsultationBooking = async (values: AddBookingFormValues) => {
    // No update API available in this module; close the drawer and log the values.
    // If an update mutation exists, replace this with the appropriate mutation call.
    console.log('Edit booking submitted', values);
    setIsEditDrawerOpen(false);
    setEditingInitialValues(null);
  };

  const renderActions = (booking: BookingRecord) => (
    <ActionDropdown
      booking={booking}
      onEdit={handleEditClick}
      onRemove={handleRemove}
    />
  );

  if (isLoading) {
    return (
      <div className="space-y-8 text-gray-700">
        <section className="space-y-6">
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

  if (isError) {
    return (
      <div className="space-y-8 text-gray-700">
        <section className="space-y-6">
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
      <section className="space-y-6">
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
            Total Consultation Booking
          </p>
          <p className="text-h2 text-text-primary font-semibold">
            {totalBookings}
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
                {selectedStatus === 'All' ? 'All Statuses' : selectedStatus}
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
                disabled={
                  bulkDeleteConsultationsMutation.isPending ||
                  deleteConsultationMutation.isPending
                }
                className={clsx(
                  'bg-secondary flex items-center gap-2 rounded-xl px-4 py-2 text-gray-700 transition-colors hover:bg-red-200',
                  (bulkDeleteConsultationsMutation.isPending ||
                    deleteConsultationMutation.isPending) &&
                    'cursor-wait opacity-70'
                )}
              >
                <RemoveIcon className="h-4 w-4" />
                {bulkDeleteConsultationsMutation.isPending ||
                deleteConsultationMutation.isPending
                  ? 'Deleting...'
                  : `Remove`}
              </button>
            )}
            <Button
              type="button"
              className="rounded-full px-5"
              onClick={handleOpenAddDrawer}
              disabled={createConsultationMutation.isPending}
            >
              {createConsultationMutation.isPending
                ? 'Creating...'
                : '+ Consultation Record'}
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
          maxBodyHeight={460}
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
        onSubmit={handleAddConsultationBooking}
      />

      <EditBookingDrawer 
        open={isEditDrawerOpen}
        onClose={handleCloseEditDrawer}
        onSubmit={handleEditConsultationBooking}
        initialValues={editingInitialValues ?? defaultEditInitialValues}
      />
    </div>
  );
};

export default BookingsPage;
