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
import {
  useDeleteProgram,
  useBulkDeleteProgram,
  useProgramsAdmin,
} from '@/queries/programs';
import { formatNthDate } from '@/helpers';
import type { ProgramListItem } from '@/types/users/program';

const ProgramSetup: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrograms, setSelectedPrograms] = useState<Set<string>>(
    new Set()
  );
  const [sortState, setSortState] = useState<SortState>({
    key: 'programName',
    direction: 'asc',
  });
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(
    new Set()
  );
  const statusFilterRef = useRef<HTMLDivElement>(null);

  const { data: programsData, isLoading, isError } = useProgramsAdmin({});
  const deleteProgramMutation = useDeleteProgram();
  const bulkDeleteProgramMutation = useBulkDeleteProgram();

  // Handle click outside status filter
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        statusFilterRef.current &&
        !statusFilterRef.current.contains(event.target as Node)
      ) {
        setShowStatusFilter(false);
      }
    };

    if (showStatusFilter) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showStatusFilter]);

  const handleStatusToggle = (status: string) => {
    const newStatuses = new Set(selectedStatuses);
    if (newStatuses.has(status)) {
      newStatuses.delete(status);
    } else {
      newStatuses.add(status);
    }
    setSelectedStatuses(newStatuses);
  };

  // Filter programs based on search query
  const filteredPrograms = useMemo(() => {
    if (!programsData) return [];
    return programsData.data.programs.filter(
      (program) =>
        program.programName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.universityName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, programsData]);

  // Sort programs
  const sortedPrograms = useMemo(() => {
    let sorted = [...filteredPrograms];
    sorted = sorted.map((program) => ({
      ...program,
      createdAt: program.createdAt
        ? formatNthDate(new Date(program.createdAt))
        : '',
      updatedAt: program.updatedAt
        ? formatNthDate(new Date(program.updatedAt))
        : '',
    }));

    sorted.sort((a, b) => {
      const aValue = a[sortState.key as keyof ProgramListItem];
      const bValue = b[sortState.key as keyof ProgramListItem];

      if (sortState.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    return sorted;
  }, [filteredPrograms, sortState]);

  const handleSelectRow = (
    program: ProgramListItem,
    _index: number,
    selected: boolean
  ) => {
    const newSelected = new Set(selectedPrograms);
    if (selected) {
      newSelected.add(program._id);
    } else {
      newSelected.delete(program._id);
    }
    setSelectedPrograms(newSelected);
  };

  const handleRemoveSelected = () => {
    bulkDeleteProgramMutation.mutate(
      { ids: Array.from(selectedPrograms) },
      {
        onSuccess: () => {
          setSelectedPrograms(new Set());
        },
      }
    );
  };

  const handleView = (program: ProgramListItem) => {
    navigate(`/admin/program-setup/view/${program.slug}`);
    setOpenDropdown(null);
  };

  const handleEdit = (program: ProgramListItem) => {
    navigate(`/admin/program-setup/edit/${program.slug}`);
    setOpenDropdown(null);
  };

  const handleRemove = (program: ProgramListItem) => {
    deleteProgramMutation.mutate(program._id, {
      onSuccess: () => {
        setOpenDropdown(null);
      },
    });
  };

  const handleCreateNew = () => {
    navigate('/admin/program-setup/create');
  };

  // Dropdown component
  const ActionDropdown: React.FC<{ program: ProgramListItem }> = ({
    program,
  }) => {
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

      if (openDropdown === program._id) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }
    }, [program._id]);

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          className="p-1 text-gray-500 hover:text-gray-700"
          onClick={() =>
            setOpenDropdown(openDropdown === program._id ? null : program._id)
          }
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>

        {openDropdown === program._id && (
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

  const columns: TableColumn<ProgramListItem>[] = [
    {
      key: 'programName',
      header: 'Program Title',
      sortable: false,
      cellClassName: 'font-medium',
    },
    {
      key: 'universityName',
      header: 'University Name',
      sortable: false,
    },
    {
      key: 'createdAt',
      header: 'Published Date',
      sortable: true,
      headerContentClassName: 'flex items-center gap-1',
      cell: (program) => new Date(program.createdAt!).toLocaleDateString(),
    },
    {
      key: 'updatedAt',
      header: 'Modified Date',
      sortable: true,
      headerContentClassName: 'flex items-center gap-1',
      cell: (program) => new Date(program.updatedAt!).toLocaleDateString(),
    },
  ];

  const renderActions = (program: ProgramListItem) => (
    <ActionDropdown program={program} />
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching programs.</div>;

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-h2 mb-6 font-semibold text-gray-900">
            Total Programs {programsData?.total || 0}
          </h1>

          <div className="flex items-center justify-between gap-4">
            {/* Search */}
            <div className="relative z-50 flex max-w-md justify-between space-x-5">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Program, University"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10"
                />
              </div>

              {/* Status Filter Dropdown */}
              <div className="relative" ref={statusFilterRef}>
                <button
                  onClick={() => setShowStatusFilter(!showStatusFilter)}
                  className="bg-secondary flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700 hover:bg-red-200"
                >
                  <Filter />
                  Status
                </button>

                {showStatusFilter && (
                  <div className="absolute top-full left-0 z-[100] mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg">
                    <div className="p-4">
                      {/* Draft Option */}
                      <label className="mb-3 flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={selectedStatuses.has('draft')}
                          onChange={() => handleStatusToggle('draft')}
                          className="h-5 w-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                        />
                        <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                          <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                          Draft
                        </span>
                      </label>

                      {/* Published Option */}
                      <label className="flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={selectedStatuses.has('published')}
                          onChange={() => handleStatusToggle('published')}
                          className="h-5 w-5 rounded border-gray-300 text-green-500 focus:ring-green-500"
                        />
                        <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                          <span className="h-2 w-2 rounded-full bg-green-500"></span>
                          Published
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              {selectedPrograms.size > 0 && (
                <button
                  onClick={handleRemoveSelected}
                  className="bg-secondary flex items-center gap-2 rounded-xl px-4 py-2 text-gray-700 hover:bg-red-200"
                >
                  <RemoveIcon className="h-4 w-4" />
                  Remove
                </button>
              )}

              <button
                onClick={handleCreateNew}
                className="bg-primary flex items-center gap-2 rounded-xl px-4 py-2 text-white hover:bg-red-600"
              >
                <span>+</span>New Program
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={sortedPrograms}
          getRowId={(program) => program._id}
          selectable={true}
          isRowSelected={(program) => selectedPrograms.has(program._id)}
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
