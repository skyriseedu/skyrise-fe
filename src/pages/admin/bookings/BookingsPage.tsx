import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import DataTable, {
  type SortState,
  type TableColumn,
} from '@/components/common/DataTable';
import Button from '@/components/common/Button';
import SearchIcon from '@/assets/search.svg?react';
import FilterIcon from '@/assets/filter-alt.svg?react';
import RemoveIcon from '@/assets/bin.svg?react';
import AddBookingDrawer, {
  type AddBookingFormValues,
} from '@/components/bookings/AddBookingDrawer';
import type { BookingStatus } from '@/types/bookings';
import { bookingStatusOptions } from '@/types/bookings';
import {
  useConsultations,
  useCreateConsultation,
  useDeleteConsultation,
  useBulkDeleteConsultations,
} from '@/queries';
import type { Consultation, CreateConsultationRequest, BookingStatusApi } from '@/types/bookings';

type BookingRecord = {
  id: string;
  status: BookingStatus;
  submittedPlatform: string;
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

const statusBadgeStyles: Record<BookingStatus, { container: string; dot: string }> = {
  Scheduled: {
    container: 'bg-[#E6F4FF] text-[#0B74C4] border-[#B3DCF9]',
    dot: 'bg-[#0B74C4]',
  },
  Completed: {
    container: 'bg-[#E8F6EF] text-[#2D7D46] border-[#B5E3C6]',
    dot: 'bg-[#2D7D46]',
  },
  Cancelled: {
    container: 'bg-[#FFF0F0] text-[#D13B3B] border-[#F5B3B3]',
    dot: 'bg-[#D13B3B]',
  },
};

const statusFilterOptionStyles: Record<BookingStatus, { container: string; dot: string }> = {
  Scheduled: {
    container: 'bg-[#E6F4FF] text-[#0B74C4]',
    dot: 'bg-[#0B74C4]',
  },
  Completed: {
    container: 'bg-[#E8F6EF] text-[#2D7D46]',
    dot: 'bg-[#2D7D46]',
  },
  Cancelled: {
    container: 'bg-[#FFF0F0] text-[#D13B3B]',
    dot: 'bg-[#D13B3B]',
  },
};

const renderStatusBadge = (status: BookingStatus) => {
  const styles = statusBadgeStyles[status];

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide',
        styles.container
      )}
    >
      <span className={clsx('h-2 w-2 rounded-full', styles.dot)} />
      {status}
    </span>
  );
};

const bookingColumns: TableColumn<BookingRecord>[] = [
  {
    key: 'status',
    header: 'Status',
    minWidth: 160,
    render: (row) => renderStatusBadge(row.status),
  },
  {
    key: 'submittedPlatform',
    header: 'Submitted Platform',
    minWidth: 180,
    sortable: true,
    headerClassName: 'whitespace-nowrap',
    headerContentClassName: 'whitespace-nowrap',
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
];

const transformConsultationToBookingRecord = (consultation: Consultation): BookingRecord => {
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
    submittedPlatform: pickString('submittedPlatform') ?? 'Website',
    submittedDate: consultation.createdAt,
    name: consultation.user?.name ?? pickString('name') ?? 'N/A',
    email: consultation.user?.email ?? pickString('email') ?? 'N/A',
    phoneNumber: consultation.user?.phone ?? pickString('phoneNumber') ?? 'N/A',
    facebookAccount: pickString('facebookAccount'),
    bookingTimeSchedule: pickString('bookingTimeSchedule') ?? consultation.time ?? 'N/A',
    bookingDateSchedule: consultation.date,
    location: pickString('location') ?? 'N/A',
    question: pickString('question') ?? consultation.notes ?? 'N/A',
  };
};

const BookingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<BookingTab>('consultation');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortState, setSortState] = useState<SortState>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Set<string>>(
    () => new Set()
  );
  const [selectedConsultationIds, setSelectedConsultationIds] = useState<Set<string>>(
    () => new Set()
  );
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | 'All'>(
    'Scheduled'
  );
  const statusFilterRef = useRef<HTMLDivElement | null>(null);

  const statusQueryParam = selectedStatus === 'All' ? undefined : selectedStatus;

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
    
    const transformedRows = consultationsData.data.map(transformConsultationToBookingRecord);
    return transformedRows;
  }, [consultationsData]);

  const tabs: Array<{ key: BookingTab; label: string }> = useMemo(
    () => [
      { key: 'consultation', label: 'Consultation Booking' },
      { key: 'admission', label: 'Admission Application Booking' },
    ],
    []
  );

  const statusFilteredRows = useMemo(() => {
    if (selectedStatus === 'All') {
      return consultationRows;
    }

    return consultationRows.filter((row) => row.status === selectedStatus);
  }, [consultationRows, selectedStatus]);

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
        console.warn('No rows with valid consultation ids are available to select.');
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
      console.warn('Skipping consultation IDs that are invalid or empty.', rawIds);
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
          // eslint-disable-next-line no-await-in-loop
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

  const handleAddConsultationBooking = async (values: AddBookingFormValues) => {
    try {
      const transformBookingTime = (timeString: string): string => {
        return timeString.replace(/\s+(a\.m|p\.m)$/i, '');
      };

      const normalizePhoneNumber = () => {
        const parts = [values.countryDialCode.trim(), values.phoneNumber.trim()].filter(Boolean);
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
      const errorMessage = error instanceof Error ? error.message : 'Failed to create consultation booking';
      console.error(`Error: ${errorMessage}`);
    }
  };

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
                    "cursor-pointer relative pb-3 text-h4 font-semibold text-gray-500 transition-colors after:absolute after:left-0 after:bottom-0 after:h-1 after:w-full after:rounded-full after:transition-colors after:duration-200 after:content-['']",
                    isActive
                      ? 'text-primary after:bg-primary'
                      : 'after:bg-transparent hover:text-primary'
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
          
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
                    "cursor-pointer relative pb-3 text-h4 font-semibold text-gray-500 transition-colors after:absolute after:left-0 after:bottom-0 after:h-1 after:w-full after:rounded-full after:transition-colors after:duration-200 after:content-['']",
                    isActive
                      ? 'text-primary after:bg-primary'
                      : 'after:bg-transparent hover:text-primary'
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
          
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Bookings</h3>
            <p className="text-gray-600 mb-4">{error?.message || 'Failed to load consultation bookings'}</p>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
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
                  "cursor-pointer relative pb-3 text-h4 font-semibold text-gray-500 transition-colors after:absolute after:left-0 after:bottom-0 after:h-1 after:w-full after:rounded-full after:transition-colors after:duration-200 after:content-['']",
                  isActive
                    ? 'text-primary after:bg-primary'
                    : 'after:bg-transparent hover:text-primary'
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

          <div className='flex flex-row gap-3 '>
            <p className="text-h2 text-text-primary">Total Consultation Booking</p>
            <p className="text-h2 font-semibold text-text-primary">{totalBookings}</p>
          </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative z-20 flex flex-1 flex-wrap items-center gap-5">
            <div className="relative min-w-[240px] flex-1 max-w-md">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <SearchIcon className="h-5 w-5" />
              </span>
              <input
                type="search"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search Name, Email, Status..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                  <div className="p-4 space-y-3">
                    {[
                      { value: 'All' as const, label: 'All Statuses' },
                      ...bookingStatusOptions.map((status) => ({
                        value: status,
                        label: status,
                      })),
                    ].map((option) => {
                      const isSelected = selectedStatus === option.value;
                      const styles =
                        option.value === 'All'
                          ? { container: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400' }
                          : statusFilterOptionStyles[option.value];

                      return (
                        <label
                          key={option.value}
                          className="flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-gray-50"
                        >
                          <input
                            type="radio"
                            name="booking-status-filter"
                            checked={isSelected}
                            onChange={() => handleStatusSelect(option.value)}
                            className="h-5 w-5 border-gray-300 text-primary focus:ring-primary"
                          />
                          <span
                            className={clsx(
                              'inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium transition-colors',
                              styles.container,
                              isSelected ? 'ring-2 ring-primary/40' : 'opacity-80'
                            )}
                          >
                            <span className={clsx('h-2 w-2 rounded-full', styles.dot)} />
                            {option.label}
                          </span>
                        </label>
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
                  : `Remove (${selectedConsultationIds.size})`}
              </button>
            )}
            <Button
              type="button"
              className="rounded-full px-5"
              onClick={handleOpenAddDrawer}
              disabled={createConsultationMutation.isPending}
            >
              {createConsultationMutation.isPending ? 'Creating...' : '+ Consultation Record'}
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
          onSortChange={handleSortChange}
          emptyMessage={emptyMessage}
          maxBodyHeight={460}
        />

        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
            <div className="flex justify-between flex-1 sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                disabled={currentPage >= pagination.totalPages}
                className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{((currentPage - 1) * 10) + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * 10, pagination.total)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.total}</span> results
                </p>
              </div>
              <div>
                <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage <= 1}
                    className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
                    Page {currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                    disabled={currentPage >= pagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
};

export default BookingsPage;
