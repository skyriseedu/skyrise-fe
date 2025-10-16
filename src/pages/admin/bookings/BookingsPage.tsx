import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';

import DataTable, {
  type SortState,
  type TableColumn,
} from '@/components/common/DataTable';
import Button from '@/components/common/Button';
import SearchIcon from '@/assets/search.svg?react';
import FilterIcon from '@/assets/filter-alt.svg?react';
import AddBookingDrawer, {
  type AddBookingFormValues,
} from '@/components/bookings/AddBookingDrawer';
import type { BookingStatus } from '@/types/bookings';
import { useConsultations, useCreateConsultation } from '@/queries';
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

// Transform Consultation data from backend to BookingRecord format for the table
const transformConsultationToBookingRecord = (consultation: Consultation): BookingRecord => {
  // Transform status from backend (lowercase) to frontend format (capitalized)
  const statusMap: Record<string, BookingStatus> = {
    'scheduled': 'Scheduled',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
  };
  
  const frontendStatus = statusMap[consultation.status.toLowerCase()] || consultation.status as BookingStatus;
  
  console.log('Transforming consultation:', {
    backendStatus: consultation.status,
    frontendStatus: frontendStatus,
    consultationId: consultation.id,
    consultationObject: consultation,
    hasUser: !!consultation.user,
    userName: consultation.user?.name,
    userEmail: consultation.user?.email,
    userPhone: consultation.user?.phone,
    directName: (consultation as any).name,
    directEmail: (consultation as any).email,
    directPhoneNumber: (consultation as any).phoneNumber,
    directLocation: (consultation as any).location,
    directQuestion: (consultation as any).question,
    directSubmittedPlatform: (consultation as any).submittedPlatform,
    directBookingTimeSchedule: (consultation as any).bookingTimeSchedule,
    consultationTime: consultation.time,
    consultationNotes: consultation.notes,
  });
  
  return {
    id: consultation.id,
    status: frontendStatus,
    submittedPlatform: (consultation as any).submittedPlatform || 'Website', // Try to get from API, fallback to default
    submittedDate: consultation.createdAt,
    name: consultation.user?.name || (consultation as any).name || 'N/A',
    email: consultation.user?.email || (consultation as any).email || 'N/A',
    phoneNumber: consultation.user?.phone || (consultation as any).phoneNumber || 'N/A',
    facebookAccount: undefined, 
    bookingTimeSchedule: (consultation as any).bookingTimeSchedule || consultation.time || 'N/A',
    bookingDateSchedule: consultation.date,
    location: (consultation as any).location || 'N/A',
    question: (consultation as any).question || consultation.notes || 'N/A',
  };
};

const BookingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<BookingTab>('consultation');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortState, setSortState] = useState<SortState>();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<BookingStatus>('Scheduled');

  // console.log('Current statusFilter:', statusFilter);

  const {
    data: consultationsData,
    isLoading,
    error,
    isError,
  } = useConsultations({
    status: statusFilter,
    page: currentPage,
    limit: 10,
  });

  // console.log('Current filter parameters:', {
  //   status: statusFilter,
  //   page: currentPage,
  //   limit: 10,
  //   isLoading,
  //   isError,
  //   error,
  // });
  

  const createConsultationMutation = useCreateConsultation();
  const consultationRows = useMemo(() => {
    if (!consultationsData?.data) {
      console.log('No consultations data found, returning empty array');
      return [];
    }
    
    const transformedRows = consultationsData.data.map(transformConsultationToBookingRecord);
    console.log('Transformed consultation rows:', transformedRows);
    return transformedRows;
  }, [consultationsData]);

  const tabs: Array<{ key: BookingTab; label: string }> = useMemo(
    () => [
      { key: 'consultation', label: 'Consultation Booking' },
      { key: 'admission', label: 'Admission Application Booking' },
    ],
    []
  );

  const filteredConsultationRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return consultationRows;
    }

    return consultationRows.filter((row) => {
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
  }, [consultationRows, searchTerm]);

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

  const tableData = activeTab === 'consultation' ? sortedConsultationRows : [];
  
  useEffect(() => {
    setSelectedIds([]);
    setSortState(undefined);
  }, [activeTab]);

  const isAllSelected =
    tableData.length > 0 && tableData.every((row) => selectedIds.includes(row.id));

  // Debug selection state
  console.log('Selection state:', {
    selectedIds,
    tableDataLength: tableData.length,
    isAllSelected,
    tableDataIds: tableData.map(row => row.id),
  });

  const handleSelectRow = (
    row: BookingRecord,
    _rowIndex: number,
    selected: boolean
  ) => {
    console.log('handleSelectRow called:', { rowId: row.id, selected, currentSelectedIds: selectedIds });
    
    setSelectedIds((prev) => {
      if (selected) {
        const newSelection = Array.from(new Set([...prev, row.id]));
        console.log('Adding row to selection:', { rowId: row.id, newSelection });
        return newSelection;
      }
      const newSelection = prev.filter((id) => id !== row.id);
      console.log('Removing row from selection:', { rowId: row.id, newSelection });
      return newSelection;
    });
  };

  const handleSelectAll = (selected: boolean) => {
    console.log('handleSelectAll called:', { selected, tableDataLength: tableData.length });
    
    if (!selected) {
      setSelectedIds([]);
      return;
    }

    const allIds = tableData.map((row) => row.id);
    console.log('Selecting all rows:', allIds);
    setSelectedIds(allIds);
  };

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

  const handleStatusFilterChange = (status: BookingStatus) => {
    setStatusFilter(status);
    setCurrentPage(1); 
    setSelectedIds([]);
  };

  const totalBookings = consultationsData?.total || 0;

  const emptyMessage = isLoading 
    ? 'Loading consultations...' 
    : searchTerm
    ? 'No bookings match your search criteria.'
    : `No ${statusFilter} consultations available.`;

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

      console.log('Creating consultation with data:', consultationData);
      console.log('Time transformed from:', values.bookingTimeSchedule, 'to:', consultationData.bookingTimeSchedule);
      
      await createConsultationMutation.mutateAsync(consultationData);
      
      handleCloseAddDrawer();
      setSelectedIds([]);
      setSortState(undefined);      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create consultation booking';
      console.error(`Error: ${errorMessage}`);
    }
  };
  // Show loading state
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
                    "relative pb-3 text-h3 font-semibold text-gray-500 transition-colors after:absolute after:left-0 after:bottom-0 after:h-1 after:w-full after:rounded-full after:transition-colors after:duration-200 after:content-['']",
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
    console.log('Component is in error state, showing error UI');
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
                    "relative pb-3 text-h3 font-semibold text-gray-500 transition-colors after:absolute after:left-0 after:bottom-0 after:h-1 after:w-full after:rounded-full after:transition-colors after:duration-200 after:content-['']",
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

  console.log('Rendering main content - not in loading or error state');
  console.log('Final check - tableData:', tableData, 'length:', tableData.length);

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
                  "relative pb-3 text-h3 font-semibold text-gray-500 transition-colors after:absolute after:left-0 after:bottom-0 after:h-1 after:w-full after:rounded-full after:transition-colors after:duration-200 after:content-['']",
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
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="relative flex min-w-[240px] flex-1 items-center">
              <span className="pointer-events-none absolute left-4 text-gray-400">
                <SearchIcon className="h-4 w-4" />
              </span>
              <input
                type="search"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search Name, Email, Status..."
                className="w-full rounded-md border bg-white py-2 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
            
            {/* Status Filter Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value as BookingStatus)}
                className="appearance-none rounded-md border bg-white py-2 pl-4 pr-8 text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <FilterIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-400" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              className="rounded-full px-5 bg-secondary "
              disabled={selectedIds.length === 0}
            >
              Remove
            </Button>
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
          getRowId={(row) => row.id}
          selectable
          isAllSelected={isAllSelected}
          onSelectAll={handleSelectAll}
          isRowSelected={(row) => selectedIds.includes(row.id)}
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
