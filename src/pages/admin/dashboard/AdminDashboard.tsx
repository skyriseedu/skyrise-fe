import React, { useMemo, useState } from 'react';

import DataTable, {
  type SortState,
  type TableColumn,
} from '@/components/common/DataTable';
import { TextEditor } from '@/components/common/TextEditor/TextEditor';

type ProgramRow = {
  id: string;
  programTitle: string;
  universityName: string;
  publishedOn: string; // ISO date string
  modifiedOn: string; // ISO date string
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

const columns: TableColumn<ProgramRow>[] = [
  {
    key: 'programTitle',
    header: 'Program Title',
    minWidth: 260,
  },
  {
    key: 'universityName',
    header: 'University Name',
    minWidth: 220,
  },
  {
    key: 'publishedOn',
    header: 'Published Date',
    sortable: true,
    headerClassName: 'whitespace-nowrap',
    headerContentClassName: 'whitespace-nowrap',
    cellClassName: 'whitespace-nowrap',
    render: (row) => formatDisplayDate(row.publishedOn),
  },
  {
    key: 'modifiedOn',
    header: 'Modified Date',
    sortable: true,
    headerClassName: 'whitespace-nowrap',
    headerContentClassName: 'whitespace-nowrap',
    cellClassName: 'whitespace-nowrap',
    render: (row) => formatDisplayDate(row.modifiedOn),
  },
];

const initialRows: ProgramRow[] = [
  {
    id: '1',
    programTitle: 'Bachelor of Science : Information and Communication Technology',
    universityName: 'Rangsit University (Rangsit International College)',
    publishedOn: '2025-07-24',
    modifiedOn: '2025-08-12',
  },
  {
    id: '2',
    programTitle: 'Bachelor of Science : Information and Communication Technology',
    universityName: 'Rangsit University (Rangsit International College)',
    publishedOn: '2025-07-24',
    modifiedOn: '2025-08-12',
  },
  {
    id: '3',
    programTitle: 'Bachelor of Science : Information and Communication Technology',
    universityName: 'Rangsit University (Rangsit International College)',
    publishedOn: '2025-07-24',
    modifiedOn: '2025-08-12',
  },
  {
    id: '4',
    programTitle: 'Bachelor of Science : Information and Communication Technology',
    universityName: 'Rangsit University (Rangsit International College)',
    publishedOn: '2025-07-24',
    modifiedOn: '2025-08-12',
  },
  {
    id: '5',
    programTitle: 'Bachelor of Science : Information and Communication Technology',
    universityName: 'Rangsit University (Rangsit International College)',
    publishedOn: '2025-07-24',
    modifiedOn: '2025-08-12',
  },
  {
    id: '6',
    programTitle: 'Bachelor of Science : Information and Communication Technology',
    universityName: 'Rangsit University (Rangsit International College)',
    publishedOn: '2025-07-24',
    modifiedOn: '2025-08-12',
  },
  {
    id: '7',
    programTitle: 'Bachelor of Science : Information and Communication Technology',
    universityName: 'Rangsit University (Rangsit International College)',
    publishedOn: '2025-07-24',
    modifiedOn: '2025-08-12',
  },
  {
    id: '8',
    programTitle: 'Bachelor of Science : Information and Communication Technology',
    universityName: 'Rangsit University (Rangsit International College)',
    publishedOn: '2025-07-24',
    modifiedOn: '2025-08-12',
  },
];

const AdminDashboard: React.FC = () => {
  const [sortState, setSortState] = useState<SortState>();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const rows = useMemo(() => initialRows, []);

  const sortedRows = useMemo(() => {
    if (!sortState) {
      return rows;
    }

    const sortableKeys: Record<string, keyof ProgramRow> = {
      publishedOn: 'publishedOn',
      modifiedOn: 'modifiedOn',
      programTitle: 'programTitle',
      universityName: 'universityName',
    };

    const key = sortableKeys[sortState.key];
    if (!key) {
      return rows;
    }

    const sorted = [...rows].sort((a, b) => {
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

    return sorted;
  }, [rows, sortState]);

  const isAllSelected =
    sortedRows.length > 0 && selectedIds.length === sortedRows.length;

  const handleSelectRow = (
    row: ProgramRow,
    _rowIndex: number,
    selected: boolean
  ) => {
    setSelectedIds((previous) => {
      if (selected) {
        return Array.from(new Set([...previous, row.id]));
      }
      return previous.filter((id) => id !== row.id);
    });
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedIds(sortedRows.map((row) => row.id));
      return;
    }
    setSelectedIds([]);
  };

  const handleSortChange = (column: SortState) => {
    setSortState(column);
  };

  const renderRowActions = () => (
    <button
      type="button"
      aria-label="Open row actions"
      className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-[#FFE6E7] hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0"
    >
      <span className="sr-only">Open actions</span>
      <span className="flex flex-col items-center justify-center gap-[3px]">
        <span className="h-1 w-1 rounded-full bg-current" />
        <span className="h-1 w-1 rounded-full bg-current" />
        <span className="h-1 w-1 rounded-full bg-current" />
      </span>
    </button>
  );

  return (
    <div className="space-y-10 text-gray-700">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-h3 font-semibold text-gray-800">
              Program Listings
            </h2>
            <p className="text-body-5 text-gray-500">
              Manage your published programs and review the latest updates.
            </p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={sortedRows}
          getRowId={(row) => row.id}
          selectable
          isAllSelected={isAllSelected}
          onSelectAll={handleSelectAll}
          isRowSelected={(row) => selectedIds.includes(row.id)}
          onSelectRow={handleSelectRow}
          renderActions={renderRowActions}
          sortState={sortState}
          onSortChange={handleSortChange}
          maxBodyHeight={420}
        />
      </section>

      <div className="max-w-4xl">
        <TextEditor />
      </div>
    </div>
  );
};

export default AdminDashboard;
