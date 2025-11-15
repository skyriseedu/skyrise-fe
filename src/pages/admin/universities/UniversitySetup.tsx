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
import Pin from '@/assets/pin-icon.svg?react';
import {
  useDeleteUniversity,
  useBulkDeleteUniversities,
  useAllUniversitiesAdmin,
  useUpdateUniversityPinStatus,
} from '@/queries/universities';
import { formatNthDate } from '@/helpers';
import type { UniversityListItem } from '@/types/users/university';

const UniversitySetup: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniversities, setSelectedUniversities] = useState<Set<string>>(
    new Set()
  );
  const [sortState, setSortState] = useState<SortState>({
    key: 'universityName',
    direction: 'asc',
  });
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(
    new Set()
  );
  const statusFilterRef = useRef<HTMLDivElement>(null);

  const {
    data: universitiesData,
    isLoading,
    isError,
  } = useAllUniversitiesAdmin();
  const deleteUniversityMutation = useDeleteUniversity();
  const bulkDeleteUniversityMutation = useBulkDeleteUniversities();
  const updatePinStatusMutation = useUpdateUniversityPinStatus();

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

  // Filter universities based on search query AND status
  const filteredUniversities = useMemo(() => {
    if (!universitiesData) return [];

    let filtered = universitiesData.data.universities.filter((university) =>
      university.universityName
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

    // Apply status filter if any statuses are selected
    if (selectedStatuses.size > 0) {
      filtered = filtered.filter((university) =>
        selectedStatuses.has(university.status || 'draft')
      );
    }

    return filtered;
  }, [searchQuery, universitiesData, selectedStatuses]);

  // Sort universities
  const sortedUniversities = useMemo(() => {
    const sorted = [...filteredUniversities];

    sorted.sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';

      // Get the values based on sort key
      if (sortState.key === 'createdAt' || sortState.key === 'updatedAt') {
        // For date fields, convert to timestamp for comparison
        aValue = a[sortState.key]
          ? new Date(a[sortState.key] as string).getTime()
          : 0;
        bValue = b[sortState.key]
          ? new Date(b[sortState.key] as string).getTime()
          : 0;
      } else {
        // For other fields, get string values
        const aVal = a[sortState.key as keyof UniversityListItem];
        const bVal = b[sortState.key as keyof UniversityListItem];

        aValue = aVal === null || aVal === undefined ? '' : String(aVal);
        bValue = bVal === null || bVal === undefined ? '' : String(bVal);
      }

      // Compare values
      if (sortState.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return sorted;
  }, [filteredUniversities, sortState]);

  const handleSelectRow = (
    university: UniversityListItem,
    _index: number,
    selected: boolean
  ) => {
    const newSelected = new Set(selectedUniversities);
    if (selected) {
      newSelected.add(university._id);
    } else {
      newSelected.delete(university._id);
    }
    setSelectedUniversities(newSelected);
  };

  const handleRemoveSelected = () => {
    if (selectedUniversities.size === 0) return;

    if (
      !confirm(
        `Are you sure you want to delete ${selectedUniversities.size} university(s)?`
      )
    ) {
      return;
    }

    bulkDeleteUniversityMutation.mutate(
      { ids: Array.from(selectedUniversities) },
      {
        onSuccess: () => {
          setSelectedUniversities(new Set());
        },
      }
    );
  };

  const handleView = (university: UniversityListItem) => {
    navigate(`/admin/university-setup/view/${university.slug}`);
    setOpenDropdown(null);
  };

  const handleEdit = (university: UniversityListItem) => {
    navigate(`/admin/university-setup/edit/${university.slug}`);
    setOpenDropdown(null);
  };

  const handleRemove = (university: UniversityListItem) => {
    if (
      !confirm(
        `Are you sure you want to delete "${university.universityName}"?`
      )
    ) {
      return;
    }

    deleteUniversityMutation.mutate(university._id, {
      onSuccess: () => {
        setOpenDropdown(null);
        // Remove from selection if it was selected
        if (selectedUniversities.has(university._id)) {
          const newSelected = new Set(selectedUniversities);
          newSelected.delete(university._id);
          setSelectedUniversities(newSelected);
        }
      },
    });
  };

  const handlePinToggle = (university: UniversityListItem) => {
    updatePinStatusMutation.mutate({
      id: university._id,
      pinned: !university.pinned,
    });
  };

  const handleCreateNew = () => {
    navigate('/admin/university-setup/create');
  };

  // Dropdown component
  const ActionDropdown: React.FC<{
    university: UniversityListItem;
    index: number;
  }> = ({ university, index: _index }) => {
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

      if (openDropdown === university._id) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }
    }, [university._id]);

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          className="cursor-pointer p-1 text-gray-500 hover:text-gray-700"
          onClick={() =>
            setOpenDropdown(
              openDropdown === university._id ? null : university._id
            )
          }
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>

        {openDropdown === university._id && (
          <div className="absolute right-0 z-10 mt-1 w-38 rounded-lg border border-gray-200 bg-white shadow-lg">
            <div className="py-1">
              <button
                onClick={() => handleView(university)}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                <ViewIcon className="h-4 w-4 text-gray-500" />
                View
              </button>
              <button
                onClick={() => handleEdit(university)}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                <EditIcon className="h-4 w-4 text-gray-500" />
                Edit
              </button>
              <button
                onClick={() => handleRemove(university)}
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

  const columns: TableColumn<UniversityListItem>[] = [
    {
      key: 'pinned',
      header: '',
      sortable: false,
      cellClassName: 'w-12',
      render: (university: UniversityListItem) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePinToggle(university);
          }}
          className="cursor-pointer p-1 hover:opacity-70"
          title={university.pinned ? 'Unpin university' : 'Pin university'}
        >
          <Pin
            className={`h-5 w-5 transition-colors ${
              university.pinned ? 'text-[#DE595B]' : 'text-[#FFE6E7]'
            }`}
          />
        </button>
      ),
    },
    {
      key: 'universityName',
      header: 'University Name',
      sortable: false,
      cellClassName: 'font-medium',
    },
    {
      key: 'createdAt',
      header: 'Published Date',
      sortable: true,
      headerContentClassName: 'flex items-center gap-1',
      render: (university: UniversityListItem) =>
        university.createdAt
          ? formatNthDate(new Date(university.createdAt))
          : '',
    },
    {
      key: 'updatedAt',
      header: 'Modified Date',
      sortable: true,
      headerContentClassName: 'flex items-center gap-1',
      render: (university: UniversityListItem) =>
        university.updatedAt
          ? formatNthDate(new Date(university.updatedAt))
          : '',
    },
  ];

  const renderActions = (university: UniversityListItem, index: number) => (
    <ActionDropdown university={university} index={index} />
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching universities.</div>;

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-h2 mb-6 font-semibold text-gray-900">
            Total Universities {sortedUniversities.length}
          </h1>

          <div className="flex items-center justify-between gap-4">
            {/* Search */}
            <div className="relative z-50 flex max-w-md justify-between space-x-5">
              <div className="relative min-w-[290px]">
                <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search University"
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
                  {selectedStatuses.size > 0 && (
                    <span className="ml-1 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                      {selectedStatuses.size}
                    </span>
                  )}
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
              {selectedUniversities.size > 0 && (
                <button
                  onClick={handleRemoveSelected}
                  disabled={bulkDeleteUniversityMutation.isPending}
                  className="bg-secondary flex items-center gap-2 rounded-xl px-4 py-2 text-gray-700 hover:bg-red-200 disabled:opacity-50"
                >
                  <RemoveIcon className="h-4 w-4" />
                  Remove ({selectedUniversities.size})
                </button>
              )}

              <button
                onClick={handleCreateNew}
                className="bg-primary flex items-center gap-2 rounded-xl px-4 py-2 text-white hover:bg-red-600"
              >
                <span>+</span>New University
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <DataTable<UniversityListItem & Record<string, unknown>>
          columns={columns}
          data={
            sortedUniversities as unknown as (UniversityListItem &
              Record<string, unknown>)[]
          }
          getRowId={(university) => university._id}
          selectable={true}
          isRowSelected={(university) =>
            selectedUniversities.has(university._id)
          }
          onSelectRow={handleSelectRow}
          renderActions={renderActions}
          sortState={sortState}
          onSortChange={setSortState}
          emptyMessage="No universities found."
        />
      </div>
    </div>
  );
};

export default UniversitySetup;
