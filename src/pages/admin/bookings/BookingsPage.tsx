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

type BookingRecord = {
  id: string;
  status: BookingStatus;
  submittedPlatform: string;
  submittedDate: string; // ISO date string
  name: string;
  email: string;
  phoneNumber: string;
  facebookAccount?: string;
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
  Pending: {
    container: 'bg-[#FFF7E6] text-[#C26B00] border-[#F5D6A1]',
    dot: 'bg-[#C26B00]',
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
];

const consultationBookings: BookingRecord[] = [
  {
    id: 'booking-1',
    status: 'Scheduled',
    submittedPlatform: 'Website',
    submittedDate: '2025-06-24',
    name: 'May Khit Thar',
    email: 'maykhit@gmail.com',
    phoneNumber: '+95 96 234 5623',
    facebookAccount: 'facebook.com/maykhit',
  },
];

const BookingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<BookingTab>('consultation');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortState, setSortState] = useState<SortState>();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [consultationRows, setConsultationRows] = useState<BookingRecord[]>(
    () => consultationBookings
  );
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);

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

  const handleSelectRow = (
    row: BookingRecord,
    _rowIndex: number,
    selected: boolean
  ) => {
    setSelectedIds((prev) => {
      if (selected) {
        return Array.from(new Set([...prev, row.id]));
      }
      return prev.filter((id) => id !== row.id);
    });
  };

  const handleSelectAll = (selected: boolean) => {
    if (!selected) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(tableData.map((row) => row.id));
  };

  const handleSortChange = (state: SortState) => {
    setSortState(state);
  };

  const handleTabChange = (tabKey: BookingTab) => {
    setActiveTab(tabKey);
    setSearchTerm('');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const totalBookings = activeTab === 'consultation' ? consultationRows.length : 0;

  const emptyMessage = searchTerm
    ? 'No bookings match your search criteria.'
    : 'No bookings available for this tab yet.';

  const handleOpenAddDrawer = () => {
    setIsAddDrawerOpen(true);
  };

  const handleCloseAddDrawer = () => {
    setIsAddDrawerOpen(false);
  };

  const handleAddConsultationBooking = (values: AddBookingFormValues) => {
    const isoDate = new Date().toISOString().split('T')[0];
    const trimmedPhone = values.phoneNumber.trim();
    const trimmedDialCode = values.countryDialCode.trim();
    const phoneDisplay = [trimmedDialCode, trimmedPhone]
      .filter(Boolean)
      .join(' ')
      .trim();

    const newBooking: BookingRecord = {
      id: `booking-${Date.now()}`,
      status: values.status,
      submittedPlatform: values.submittedPlatform,
      submittedDate: isoDate,
      name: values.name.trim() || 'Unknown',
      email: values.email.trim(),
      phoneNumber: phoneDisplay,
      facebookAccount: values.facebookAccount.trim() || undefined,
    };

    setConsultationRows((prev) => [newBooking, ...prev]);
    setSelectedIds([]);
    setSortState(undefined);
    handleCloseAddDrawer();
  };

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
                placeholder="Search Name, Status, Facebook account"
                className="w-full rounded-md border  bg-white py-2 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 cursor-pointer rounded-md borderpx-4 py-2 px-4 text-sm font-semibold text-gray-600 transition-colors bg-secondary "
            >
              <FilterIcon className="h-4 w-4" />
              Status
            </button>
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
            >
              + Consultation Record
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
