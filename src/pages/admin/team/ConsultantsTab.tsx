import SearchIcon from '@/assets/search.svg?react';
import RemoveIcon from '@/assets/bin.svg?react';
import EditIcon from '@/assets/edit.svg?react';
import PinIcon from '@/assets/pin-icon.svg?react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import Button from '@/components/common/Button';
import {
  useBulkDeleteConsultants,
  useCreateConsultant,
  useAllConsultantsAdmin,
  useUpdateConsultant,
  useUpdateConsultantPinStatus,
} from '@/queries/consultants';
import { useUploadConsultantImage } from '@/queries/uploads';
import AddConsultantDrawer, {
  type AddTeamMemberFormValues,
} from '@/components/teams/AddConsultantDrawer';

import DataTable, {
  type SortState,
  type TableColumn,
} from '@/components/common/DataTable';
import type { Consultant } from '@/types/users/consultant';

const CONSULTANT_TABLE_MAX_BODY_HEIGHT = '35rem';

type DropdownPosition = {
  top: number;
  left: number;
  width: number;
};

type ConsultantRow = {
  id: string;
  name: string;
  addedDate: string;
  major: string;
  university: string;
  image?: string;
  email: string;
  phoneNumber: string;
  facebookAccount?: string;
  status: Consultant['status'];
  pinned: boolean;
  order: number;
  createdAt?: string;
};

type ConsultantActionDropdownProps = {
  consultant: ConsultantRow;
  onEdit?: (consultant: ConsultantRow) => void;
  onRemove?: (consultantId: string) => void | Promise<void>;
  disabled?: boolean;
};

function ConsultantActionDropdown({
  consultant,
  onEdit,
  onRemove,
  disabled = false,
}: ConsultantActionDropdownProps) {
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
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  const handleRemoveClick = async () => {
    if (disabled) return;
    if (!consultant.id) return;
    await onRemove?.(consultant.id);
    setIsOpen(false);
  };

  const handleEditClick = () => {
    if (disabled) return;
    onEdit?.(consultant);
    setIsOpen(false);
  };

  const portalTarget =
    typeof document !== 'undefined' ? document.body : undefined;

  return (
    <div className="relative">
      <button
        type="button"
        className={clsx(
          'cursor-pointer p-1 text-gray-500 hover:text-gray-700',
          disabled && 'cursor-not-allowed opacity-60'
        )}
        onClick={toggleDropdown}
        ref={buttonRef}
        disabled={disabled}
        aria-label="Open actions"
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
                  {onEdit && (
                    <button
                      type="button"
                      onClick={handleEditClick}
                      className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={disabled}
                    >
                      <EditIcon className="h-4 w-4 text-gray-500" />
                      Edit
                    </button>
                  )}
                  {onEdit && <div className="my-1 h-px w-full bg-gray-100" />}
                  <button
                    type="button"
                    onClick={handleRemoveClick}
                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={disabled}
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
}

const formatDateLabel = (value?: string) => {
  if (!value) {
    return '—';
  }

  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(value));
  } catch (error) {
    console.warn('Failed to format date:', value, error);
    return '—';
  }
};

const toConsultantRow = (consultant: Consultant): ConsultantRow | null => {
  const id = consultant.id || consultant._id;
  if (!id) {
    return null;
  }

  return {
    id,
    name: consultant.consultantName ?? 'Unnamed consultant',
    major: consultant.major ?? '—',
    addedDate: formatDateLabel(consultant.createdAt),
    university: consultant.university ?? consultant.company ?? '—',
    image: consultant.profileImage ?? consultant.image,
    email: consultant.email ?? consultant.location ?? '—',
    phoneNumber: consultant.phoneNumber ?? '—',
    facebookAccount: consultant.facebookAccount ?? '—',
    status: consultant.status ?? 'inactive',
    pinned: consultant.pinned ?? false,
    order: consultant.order ?? 0,
    createdAt: consultant.createdAt,
  };
};

const ConsultantsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<Set<string>>(
    () => new Set()
  );
  const [selectedConsultantIds, setSelectedConsultantIds] = useState<
    Set<string>
  >(() => new Set());
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [editingConsultant, setEditingConsultant] =
    useState<ConsultantRow | null>(null);
  const [sortState, setSortState] = useState<SortState>({
    key: 'createdAt',
    direction: 'desc',
  });

  const bulkDeleteConsultantsMutation = useBulkDeleteConsultants();
  const createConsultantMutation = useCreateConsultant();
  const updateConsultantMutation = useUpdateConsultant();
  const uploadConsultantImageMutation = useUploadConsultantImage();
  const updatePinStatusMutation = useUpdateConsultantPinStatus();

  const {
    data: consultantsResponse,
    isPending: isConsultantsLoading,
    isError: isConsultantsError,
  } = useAllConsultantsAdmin();

  const isDeleteActionPending = bulkDeleteConsultantsMutation.isPending;
  const areRowActionsDisabled =
    isDeleteActionPending || updateConsultantMutation.isPending;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenAddDrawer = () => {
    setIsAddDrawerOpen(true);
  };

  const handleCloseAddDrawer = () => {
    setIsAddDrawerOpen(false);
  };

  const handleCloseEditDrawer = () => {
    setEditingConsultant(null);
  };

  const handleDeleteSelected = useCallback(async () => {
    if (selectedConsultantIds.size === 0) {
      return;
    }

    const rawIds = Array.from(selectedConsultantIds);
    const ids = rawIds.filter(
      (value): value is string =>
        typeof value === 'string' && value.trim().length > 0
    );

    if (ids.length === 0) {
      console.warn('No valid consultant IDs selected for deletion.', rawIds);
      return;
    }

    if (ids.length < rawIds.length) {
      console.warn(
        'Skipping consultant IDs that are invalid or empty.',
        rawIds
      );
    }

    try {
      await bulkDeleteConsultantsMutation.mutateAsync(ids);
      setSelectedRowKeys(new Set());
      setSelectedConsultantIds(new Set());
    } catch (error) {
      console.error('Failed to delete consultants:', error);
    }
  }, [bulkDeleteConsultantsMutation, selectedConsultantIds]);

  const handleDeleteSingleConsultant = useCallback(
    async (consultantId: string) => {
      if (!consultantId) {
        return;
      }

      try {
        await bulkDeleteConsultantsMutation.mutateAsync([consultantId]);
        setSelectedRowKeys((prev) => {
          if (!prev.has(consultantId)) {
            return prev;
          }
          const next = new Set(prev);
          next.delete(consultantId);
          return next;
        });
        setSelectedConsultantIds((prev) => {
          if (!prev.has(consultantId)) {
            return prev;
          }
          const next = new Set(prev);
          next.delete(consultantId);
          return next;
        });
      } catch (error) {
        console.error('Failed to delete consultant:', error);
      }
    },
    [bulkDeleteConsultantsMutation]
  );

  const rawConsultants = useMemo(
    () => consultantsResponse?.data?.consultants ?? [],
    [consultantsResponse]
  );

  const consultantRows = useMemo(() => {
    return rawConsultants
      .map(toConsultantRow)
      .filter((consultant): consultant is ConsultantRow => Boolean(consultant));
  }, [rawConsultants]);

  const handleAddConsultant = useCallback(
    async (values: AddTeamMemberFormValues) => {
      try {
        let imageUrl: string | undefined;
        if (values.profilePicture) {
          const formData = new FormData();
          formData.append('image', values.profilePicture);
          const uploadResponse =
            await uploadConsultantImageMutation.mutateAsync(formData);
          imageUrl = uploadResponse?.data?.url;
        }

        await createConsultantMutation.mutateAsync({
          consultantName: values.consultantName,
          major: values.major,
          university: values.university,
          email: values.email,
          phoneNumber: `${values.countryDialCode}${values.phoneNumber}`,
          facebookAccount: values.facebookAccount || '',
          profileImage: imageUrl || '',
          pinned: false,
          status: 'active',
        });

        setIsAddDrawerOpen(false);
      } catch (error) {
        console.error('Failed to add consultant:', error);
      }
    },
    [createConsultantMutation, uploadConsultantImageMutation]
  );

  const handleEditAction = useCallback((consultant: ConsultantRow) => {
    setEditingConsultant(consultant);
  }, []);

  const handleEditConsultant = useCallback(
    async (values: AddTeamMemberFormValues) => {
      if (!editingConsultant?.id) {
        console.warn('Cannot edit consultant without a valid selection.');
        return;
      }

      try {
        let imageUrl = editingConsultant.image;

        // If image was removed, set to empty string
        if (values.imageRemoved) {
          imageUrl = '';
        } else if (values.profilePicture) {
          // If new image was uploaded, upload it and get URL
          const formData = new FormData();
          formData.append('image', values.profilePicture);
          const uploadResponse =
            await uploadConsultantImageMutation.mutateAsync(formData);
          imageUrl = uploadResponse?.data?.url || imageUrl;
        }

        await updateConsultantMutation.mutateAsync({
          id: editingConsultant.id,
          payload: {
            consultantName: values.consultantName,
            major: values.major,
            university: values.university,
            email: values.email,
            phoneNumber: `${values.countryDialCode}${values.phoneNumber}`,
            facebookAccount: values.facebookAccount || '',
            profileImage: imageUrl || '',
          },
        });

        setEditingConsultant(null);
      } catch (error) {
        console.error('Failed to update consultant:', error);
      }
    },
    [editingConsultant, updateConsultantMutation, uploadConsultantImageMutation]
  );

  const handlePinToggle = useCallback(
    (consultant: ConsultantRow) => {
      updatePinStatusMutation.mutate({
        id: consultant.id,
        pinned: !consultant.pinned,
      });
    },
    [updatePinStatusMutation]
  );

  const filteredRows = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return consultantRows;
    }

    return consultantRows.filter((row) => {
      const valuesToSearch = [
        row.name,
        row.major,
        row.university,
        row.email,
        row.phoneNumber,
        row.facebookAccount,
      ].map((v) => v?.toString());

      return valuesToSearch.some((field) =>
        field?.toLowerCase().includes(query)
      );
    });
  }, [searchTerm, consultantRows]);

  const sortedRows = useMemo(() => {
    if (!sortState) {
      return filteredRows;
    }

    const { key, direction } = sortState;
    const sorted = [...filteredRows];

    sorted.sort((a, b) => {
      const multiplier = direction === 'asc' ? 1 : -1;

      const getComparableValue = (row: ConsultantRow) => {
        switch (key) {
          case 'name':
            return row.name.toLowerCase();
          case 'major':
            return row.major.toLowerCase();
          case 'university':
            return row.university.toLowerCase();
          case 'email':
            return row.email.toLowerCase();
          case 'phoneNumber':
            return row.phoneNumber.toLowerCase();
          case 'order':
            return row.order;
          case 'createdAt':
            return row.createdAt ? new Date(row.createdAt).getTime() : 0;
          default:
            return 0;
        }
      };

      const aValue = getComparableValue(a);
      const bValue = getComparableValue(b);

      if (aValue < bValue) {
        return -1 * multiplier;
      }
      if (aValue > bValue) {
        return 1 * multiplier;
      }
      return 0;
    });

    return sorted;
  }, [filteredRows, sortState]);

  const tableData = sortedRows;

  useEffect(() => {
    const validIds = new Set(tableData.map((row) => row.id));
    if (validIds.size === 0) {
      setSelectedRowKeys((prev) => {
        if (prev.size === 0) return prev;
        return new Set();
      });
      setSelectedConsultantIds((prev) => {
        if (prev.size === 0) return prev;
        return new Set();
      });
      return;
    }

    setSelectedRowKeys((prev) => {
      if (prev.size === 0) return prev;
      const next = new Set(Array.from(prev).filter((id) => validIds.has(id)));
      return next.size === prev.size ? prev : next;
    });

    setSelectedConsultantIds((prev) => {
      if (prev.size === 0) return prev;
      const next = new Set(Array.from(prev).filter((id) => validIds.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [tableData]);

  const getRowKey = useCallback((row: ConsultantRow) => row.id, []);

  const rowIsSelected = useCallback(
    (row: ConsultantRow) => selectedRowKeys.has(getRowKey(row)),
    [getRowKey, selectedRowKeys]
  );

  const handleSelectRow = useCallback(
    (row: ConsultantRow, _index: number, selected: boolean) => {
      const rowKey = getRowKey(row);
      setSelectedRowKeys((prev) => {
        const next = new Set(prev);
        if (selected) {
          next.add(rowKey);
        } else {
          next.delete(rowKey);
        }
        return next;
      });

      setSelectedConsultantIds((prev) => {
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

  const handleSortChange = useCallback((nextState: SortState) => {
    setSortState(nextState);
  }, []);

  const emptyMessage = useMemo(() => {
    if (isConsultantsLoading) {
      return 'Loading consultants...';
    }

    if (isConsultantsError) {
      return 'Unable to load consultants right now.';
    }

    if (rawConsultants.length === 0) {
      return 'No consultants have been added yet.';
    }

    if (searchTerm.trim()) {
      return `No consultants match "${searchTerm}".`;
    }

    return 'No consultants found.';
  }, [
    isConsultantsError,
    isConsultantsLoading,
    rawConsultants.length,
    searchTerm,
  ]);

  const totalConsultants =
    consultantsResponse?.total ??
    consultantsResponse?.count ??
    tableData.length;

  const isEditDrawerOpen = Boolean(editingConsultant);

  const editingDrawerInitialValues = useMemo<
    Partial<AddTeamMemberFormValues> | undefined
  >(() => {
    if (!editingConsultant) {
      return undefined;
    }

    // Parse phone number to extract country code and number
    let countryDialCode = '+95';
    let phoneNumber = editingConsultant.phoneNumber;

    // Check if phone number starts with a country code
    if (phoneNumber.startsWith('+95')) {
      countryDialCode = '+95';
      phoneNumber = phoneNumber.substring(3);
    } else if (phoneNumber.startsWith('+66')) {
      countryDialCode = '+66';
      phoneNumber = phoneNumber.substring(3);
    } else if (phoneNumber.startsWith('+')) {
      // Handle other country codes (extract until first non-digit after +)
      const match = phoneNumber.match(/^(\+\d+)(.*)$/);
      if (match) {
        countryDialCode = match[1];
        phoneNumber = match[2];
      }
    }

    return {
      consultantName: editingConsultant.name,
      major: editingConsultant.major,
      university: editingConsultant.university,
      email: editingConsultant.email,
      countryDialCode,
      phoneNumber,
      facebookAccount: editingConsultant.facebookAccount,
      profilePicture: null,
    };
  }, [editingConsultant]);

  const consultantColumns: TableColumn<ConsultantRow>[] = useMemo(
    () => [
      {
        key: 'pinned',
        header: '',
        sortable: false,
        cellClassName: 'w-12',
        render: (row) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePinToggle(row);
            }}
            className="cursor-pointer p-1 hover:opacity-70"
            title={row.pinned ? 'Unpin consultant' : 'Pin consultant'}
          >
            <PinIcon
              className={`h-5 w-5 transition-colors ${
                row.pinned
                  ? 'fill-red-500 text-red-500'
                  : 'fill-gray-300 text-gray-300'
              }`}
            />
          </button>
        ),
      },
      {
        key: 'name',
        header: 'Consultant Name',
        minWidth: '14rem',
        sortable: false,
        render: (row) => (
          <span className="text-sm font-semibold text-gray-900">
            {row.name}
          </span>
        ),
      },
      {
        key: 'createdAt',
        header: 'Added Date',
        sortable: true,
        minWidth: '10rem',
        render: (row) => (
          <span className="text-sm text-gray-700">
            {formatDateLabel(row.createdAt)}
          </span>
        ),
      },
      {
        key: 'major',
        header: 'Major',
        sortable: false,
        minWidth: '10rem',
        render: (row) => (
          <span className="text-sm text-gray-700">{row.major}</span>
        ),
      },
      {
        key: 'university',
        header: 'University',
        minWidth: '14rem',
        sortable: false,
        render: (row) => (
          <span className="text-sm text-gray-700">{row.university}</span>
        ),
      },
      {
        key: 'email',
        header: 'Email',
        sortable: false,
        minWidth: '14rem',
        render: (row) => (
          <span className="text-sm text-gray-700">{row.email}</span>
        ),
      },
      {
        key: 'phoneNumber',
        header: 'Phone Number',
        minWidth: '10rem',
        sortable: false,
        render: (row) => (
          <span className="text-sm text-gray-700">{row.phoneNumber}</span>
        ),
      },
      {
        key: 'facebookAccount',
        header: 'Facebook Account',
        minWidth: '14rem',
        sortable: false,
        render: (row) => (
          <span className="text-sm text-gray-700">{row.facebookAccount}</span>
        ),
      },
      {
        key: 'image',
        header: 'Image',
        minWidth: '10rem',
        render: (row) =>
          row.image ? (
            <p>{row.name}.png</p>
          ) : (
            <span className="text-sm text-gray-500">—</span>
          ),
      },
    ],
    [handlePinToggle]
  );

  const renderActions = useCallback(
    (row: ConsultantRow) => (
      <ConsultantActionDropdown
        consultant={row}
        onEdit={handleEditAction}
        onRemove={handleDeleteSingleConsultant}
        disabled={areRowActionsDisabled}
      />
    ),
    [areRowActionsDisabled, handleDeleteSingleConsultant, handleEditAction]
  );

  return (
    <div>
      <p className="text-h2 text-text-primary">
        Total Consultants{' '}
        <span className="text-h2 text-text-primary font-semibold">
          {totalConsultants || 0}
        </span>
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <div className="relative z-50 flex max-w-md min-w-[290px] flex-1">
          <div className="relative w-full">
            <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400">
              <SearchIcon className="h-5 w-5" />
            </span>
            <input
              type="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search Consultant Name"
              className="focus:ring-primary/20 w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:outline-none"
            />
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
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
          >
            + Add Consultant
          </Button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <DataTable
          columns={consultantColumns}
          data={tableData}
          getRowId={(row) => getRowKey(row)}
          selectable
          isRowSelected={(row) => rowIsSelected(row)}
          onSelectRow={handleSelectRow}
          sortState={sortState}
          onSortChange={handleSortChange}
          renderActions={renderActions}
          emptyMessage={emptyMessage}
          maxBodyHeight={CONSULTANT_TABLE_MAX_BODY_HEIGHT}
          className="min-w-[960px] overflow-visible"
        />
      </div>
      <AddConsultantDrawer
        open={isAddDrawerOpen}
        onClose={handleCloseAddDrawer}
        onSubmit={handleAddConsultant}
        isSubmitting={createConsultantMutation.isPending}
        submitLabel={createConsultantMutation.isPending ? 'Adding...' : 'Add'}
      />
      <AddConsultantDrawer
        open={isEditDrawerOpen}
        onClose={handleCloseEditDrawer}
        onSubmit={handleEditConsultant}
        initialValues={editingDrawerInitialValues}
        initialProfilePictureUrl={editingConsultant?.image ?? null}
        title="Edit Consultant"
        submitLabel={
          updateConsultantMutation.isPending ? 'Saving...' : 'Save Changes'
        }
        isSubmitting={updateConsultantMutation.isPending}
      />
    </div>
  );
};

export default ConsultantsTab;
