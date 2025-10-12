import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable, {
  type TableColumn,
  type SortState,
} from '@/components/common/DataTable';
import Filter from '@/assets/filter-alt.svg?react';
import Search from '@/assets/search.svg?react';
import RemoveIcon from '@/assets/bin.svg?react';
import EditIcon from '@/assets/edit.svg?react';
import ViewIcon from '@/assets/view.svg?react';

// Mock data type
type Program = {
  id: string;
  title: string;
  universityName: string;
  publishedDate: string;
  modifiedDate: string;
};

// Mock data
const mockPrograms: Program[] = [
  {
    id: '1',
    title: 'Bachelor of Science : Information and Communication Technology',
    universityName: 'Rangsit University(Rangsit International College)',
    publishedDate: '24th July 2025',
    modifiedDate: '12th August 2025',
  },
  {
    id: '2',
    title: 'Bachelor of Science : Information and Communication Technology',
    universityName: 'Rangsit University(Rangsit International College)',
    publishedDate: '24th July 2025',
    modifiedDate: '12th August 2025',
  },
  {
    id: '3',
    title: 'Bachelor of Science : Information and Communication Technology',
    universityName: 'Rangsit University(Rangsit International College)',
    publishedDate: '24th July 2025',
    modifiedDate: '12th August 2025',
  },
  {
    id: '4',
    title: 'Bachelor of Science : Information and Communication Technology',
    universityName: 'Rangsit University(Rangsit International College)',
    publishedDate: '24th July 2025',
    modifiedDate: '12th August 2025',
  },
  {
    id: '5',
    title: 'Bachelor of Science : Information and Communication Technology',
    universityName: 'Rangsit University(Rangsit International College)',
    publishedDate: '24th July 2025',
    modifiedDate: '12th August 2025',
  },
];

const ProgramSetup: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrograms, setSelectedPrograms] = useState<Set<string>>(
    new Set()
  );
  const [sortState, setSortState] = useState<SortState>({
    key: 'title',
    direction: 'asc',
  });
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Filter programs based on search query
  const filteredPrograms = useMemo(() => {
    return mockPrograms.filter(
      (program) =>
        program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.universityName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Sort programs
  const sortedPrograms = useMemo(() => {
    const sorted = [...filteredPrograms];
    sorted.sort((a, b) => {
      const aValue = a[sortState.key as keyof Program];
      const bValue = b[sortState.key as keyof Program];

      if (sortState.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    return sorted;
  }, [filteredPrograms, sortState]);

  const handleSelectRow = (
    program: Program,
    _index: number,
    selected: boolean
  ) => {
    const newSelected = new Set(selectedPrograms);
    if (selected) {
      newSelected.add(program.id);
    } else {
      newSelected.delete(program.id);
    }
    setSelectedPrograms(newSelected);
  };

  const handleRemoveSelected = () => {
    // In a real app, this would call an API to delete the selected programs
    console.log('Removing programs:', Array.from(selectedPrograms));
    setSelectedPrograms(new Set());
  };

  const handleView = (program: Program) => {
    navigate(`/admin/programs/view/${program.id}`);
    setOpenDropdown(null);
  };

  const handleEdit = (program: Program) => {
    navigate(`/admin/programs/edit/${program.id}`);
    setOpenDropdown(null);
  };

  const handleRemove = (program: Program) => {
    // In a real app, this would call an API to delete the program
    console.log('Remove program:', program.id);
    setOpenDropdown(null);
  };

  const handleCreateNew = () => {
    navigate('/admin/program-setup/create');
  };

  // Dropdown component
  const ActionDropdown: React.FC<{ program: Program }> = ({ program }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setOpenDropdown(null);
        }
      };

      if (openDropdown === program.id) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }
    }, [program.id]);

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          className="p-1 text-gray-500 hover:text-gray-700"
          onClick={() =>
            setOpenDropdown(openDropdown === program.id ? null : program.id)
          }
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>

        {openDropdown === program.id && (
          <div className="absolute right-0 z-10 mt-1 w-38 rounded-lg border border-gray-200 bg-white shadow-lg">
            <div className="py-1">
              <button
                onClick={() => handleView(program)}
                className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                <ViewIcon className="h-4 w-4 text-gray-500" />
                View
              </button>
              <button
                onClick={() => handleEdit(program)}
                className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                <EditIcon className="h-4 w-4 text-gray-500" />
                Edit
              </button>
              <button
                onClick={() => handleRemove(program)}
                className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
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

  const columns: TableColumn<Program>[] = [
    {
      key: 'title',
      header: 'Program Title',
      sortable: true,
      cellClassName: 'font-medium',
    },
    {
      key: 'universityName',
      header: 'University Name',
      sortable: true,
    },
    {
      key: 'publishedDate',
      header: 'Published Date',
      sortable: true,
      headerContentClassName: 'flex items-center gap-1',
    },
    {
      key: 'modifiedDate',
      header: 'Modified Date',
      sortable: true,
      headerContentClassName: 'flex items-center gap-1',
    },
  ];

  const renderActions = (program: Program) => (
    <ActionDropdown program={program} />
  );

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">
            Total Programs {mockPrograms.length}
          </h1>

          <div className="flex items-center justify-between gap-4">
            {/* Search */}
            <div className="flex max-w-md justify-between space-x-5">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Program, University"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="focus:ring-primary w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2"
                />
              </div>
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">
                <Filter />
                Status
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              {selectedPrograms.size > 0 && (
                <button
                  onClick={handleRemoveSelected}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  <RemoveIcon className="h-4 w-4" />
                  Remove
                </button>
              )}

              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 rounded-lg bg-[#DE585B] px-4 py-2 text-white hover:bg-[#c94649]"
              >
                <span className="text-2xl">+</span>New Program
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={sortedPrograms}
          getRowId={(program) => program.id}
          selectable={true}
          isRowSelected={(program) => selectedPrograms.has(program.id)}
          onSelectRow={handleSelectRow}
          renderActions={renderActions}
          sortState={sortState}
          onSortChange={setSortState}
          emptyMessage="No programs found."
        />
      </div>
    </div>
  );
};

export default ProgramSetup;
