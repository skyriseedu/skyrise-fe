import SearchIcon from '@/assets/search.svg?react';
import { useMemo, useState } from 'react';

import DataTable, {
  type SortState,
  type TableColumn,
} from '@/components/common/DataTable';
import { useConsultantApplications } from '@/queries';
import type {
  ConsultantApplication,
  ConsultantApplicationsResponse,
} from '@/types/users/forms';

const CONSULTANT_TABLE_MAX_BODY_HEIGHT = '35rem';
const CONSULTANT_QUERY_LIMIT = 200;

type ConsultantTableRow = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  reason: string;
  createdAt?: string;
};

const formatDateLabel = (value?: string) => {
  if (!value) {
    return '—';
  }

  try {
    const formatted = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(value));

    return formatted;
  } catch (error) {
    console.warn('Invalid date:', value, error);
    return '—';
  }
};

const extractConsultantApplications = (
  response?: ConsultantApplicationsResponse
): ConsultantApplication[] => {
  if (!response) {
    return [];
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (Array.isArray(response.consultantApplications)) {
    return response.consultantApplications;
  }

  if (Array.isArray(response.applications)) {
    return response.applications;
  }

  if (response.data && typeof response.data === 'object') {
    const nested = response.data as {
      consultantApplications?: ConsultantApplication[];
      applications?: ConsultantApplication[];
    };

    if (Array.isArray(nested.consultantApplications)) {
      return nested.consultantApplications;
    }

    if (Array.isArray(nested.applications)) {
      return nested.applications;
    }
  }

  return [];
};

const toConsultantRow = (
  application: ConsultantApplication,
  index: number
): ConsultantTableRow => {
  const fallbackId =
    application.id ||
    application._id ||
    (application.email ? `${application.email}-${index}` : `consultant-${index}`);

  return {
    id: fallbackId,
    name: application.name?.trim() || '—',
    email: application.email?.trim() || '—',
    phoneNumber: application.phoneNumber?.trim() || '—',
    reason: application.reason?.trim() || '—',
    createdAt: application.createdAt || application.updatedAt,
  };
};

const createConsultantColumns = () =>
  [
    {
      key: 'name',
      header: 'Name',
      minWidth: '14rem',
      sortable: true,
      render: (row: ConsultantTableRow) => (
        <span className="text-sm font-semibold text-gray-900">{row.name}</span>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      minWidth: '16rem',
      sortable: true,
      render: (row: ConsultantTableRow) =>
        row.email && row.email !== '—' ? (
          <a
            href={`mailto:${row.email}`}
            className="text-primary text-sm font-semibold underline"
          >
            {row.email}
          </a>
        ) : (
          <span className="text-sm text-gray-500">—</span>
        ),
    },
    {
      key: 'phoneNumber',
      header: 'Phone Number',
      minWidth: '12rem',
      sortable: true,
      render: (row: ConsultantTableRow) => (
        <span className="text-sm text-gray-700">{row.phoneNumber}</span>
      ),
    },
    {
      key: 'reason',
      header: 'Reason',
      minWidth: '20rem',
      render: (row: ConsultantTableRow) => (
        <p className="text-sm text-gray-700">
          {row.reason || <span className="text-gray-500">—</span>}
        </p>
      ),
    },
    {
      key: 'createdAt',
      header: 'Applied Date',
      minWidth: '12rem',
      sortable: true,
      render: (row: ConsultantTableRow) => (
        <span className="text-sm text-gray-700">
          {formatDateLabel(row.createdAt)}
        </span>
      ),
    },
  ] satisfies Array<TableColumn<ConsultantTableRow>>;

const consultantColumns = createConsultantColumns();

const ConsultantsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortState, setSortState] = useState<SortState>({
    key: 'createdAt',
    direction: 'desc',
  });

  const {
    data: consultantApplicationsResponse,
    isPending: isConsultantsLoading,
    isError: isConsultantsError,
  } = useConsultantApplications({ page: 1, limit: CONSULTANT_QUERY_LIMIT });

  const rawConsultants = useMemo(
    () => extractConsultantApplications(consultantApplicationsResponse),
    [consultantApplicationsResponse]
  );

  const consultantRows = useMemo(
    () => rawConsultants.map(toConsultantRow),
    [rawConsultants]
  );

  const filteredRows = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return consultantRows;
    }

    return consultantRows.filter((row) =>
      [row.name, row.email, row.phoneNumber, row.reason]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [consultantRows, searchTerm]);

  const sortedRows = useMemo(() => {
    if (!sortState) {
      return filteredRows;
    }

    const { key, direction } = sortState;
    const multiplier = direction === 'asc' ? 1 : -1;
    const sorted = [...filteredRows];

    sorted.sort((a, b) => {
      const getValue = (row: ConsultantTableRow) => {
        switch (key) {
          case 'name':
          case 'email':
          case 'phoneNumber':
          case 'reason':
            return row[key].toLowerCase();
          case 'createdAt':
            return row.createdAt ? new Date(row.createdAt).getTime() : 0;
          default:
            return 0;
        }
      };

      const aValue = getValue(a);
      const bValue = getValue(b);

      if (aValue < bValue) return -1 * multiplier;
      if (aValue > bValue) return 1 * multiplier;
      return 0;
    });

    return sorted;
  }, [filteredRows, sortState]);

  const totalConsultants =
    consultantApplicationsResponse?.total ??
    consultantApplicationsResponse?.count ??
    rawConsultants.length;

  const emptyMessage = useMemo(() => {
    if (isConsultantsLoading) {
      return 'Loading consultant applications...';
    }

    if (isConsultantsError) {
      return 'Unable to load consultant applications right now.';
    }

    if (rawConsultants.length === 0) {
      return 'No consultant applications have been submitted yet.';
    }

    if (searchTerm.trim()) {
      return `No consultant applications match "${searchTerm}".`;
    }

    return 'No consultant applications found.';
  }, [
    isConsultantsError,
    isConsultantsLoading,
    rawConsultants.length,
    searchTerm,
  ]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (nextState: SortState) => {
    setSortState(nextState);
  };

  return (
    <div>
      <p className="text-h2 text-text-primary">
        Consultant Applications{' '}
        <span className="text-h2 text-text-primary font-semibold">
          {totalConsultants || 0}
        </span>
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <div className="relative z-10 flex min-w-[290px] flex-1 max-w-md">
          <div className="relative w-full">
            <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400">
              <SearchIcon className="h-5 w-5" />
            </span>
            <input
              type="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by name, email, phone, or reason"
              className="focus:ring-primary/20 w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <DataTable
          columns={consultantColumns}
          data={sortedRows}
          getRowId={(row) => row.id}
          sortState={sortState}
          onSortChange={handleSortChange}
          emptyMessage={emptyMessage}
          maxBodyHeight={CONSULTANT_TABLE_MAX_BODY_HEIGHT}
          className="min-w-[960px] overflow-visible"
        />
      </div>
    </div>
  );
};

export default ConsultantsTab;
