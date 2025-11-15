import SearchIcon from '@/assets/search.svg?react';
import RemoveIcon from '@/assets/bin.svg?react';
import EditIcon from '@/assets/edit.svg?react';
import PinIcon from '@/assets/pin.svg?react';
import AddPinIcon from '@/assets/add-pin.svg?react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import Button from '@/components/common/Button';
import {
  useBulkDeleteTeamMembers,
  useCreateTeamMember,
  useTeamMembers,
  useUpdateTeamMember,
  useUploadTeamMemberImage,
} from '@/queries';
import AddTeamDrawer, {
  type AddTeamMemberFormValues,
} from '@/components/teams/AddTeamDrawer';
import DataTable, {
  type SortState,
  type TableColumn,
} from '@/components/common/DataTable';
import type { TeamMemberApiItem } from '@/types/users/team';

const TEAM_TABLE_MAX_BODY_HEIGHT = '35rem';
const TEAM_MEMBERS_QUERY_LIMIT = 100;

type DropdownPosition = {
  top: number;
  left: number;
  width: number;
};

type TeamMemberRow = {
  id: string;
  memberName: string;
  role: string;
  major: string;
  university: string;
  profilePicture?: string;
  status: TeamMemberApiItem['status'];
  order: number;
  createdAt?: string;
  primarySocialLink?: string;
  pinned: boolean;
};

type TeamMemberActionDropdownProps = {
  member: TeamMemberRow;
  onEdit?: (member: TeamMemberRow) => void;
  onRemove?: (memberId: string) => void | Promise<void>;
  disabled?: boolean;
};

function TeamMemberActionDropdown({
  member,
  onEdit,
  onRemove,
  disabled = false,
}: TeamMemberActionDropdownProps) {
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
    if (!member.id) return;
    await onRemove?.(member.id);
    setIsOpen(false);
  };

  const handleEditClick = () => {
    if (disabled) return;
    onEdit?.(member);
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

const pickPrimarySocialLink = (member: TeamMemberApiItem) => {
  const directLink = member.socialMediaLink?.trim();
  if (directLink) {
    return directLink;
  }

  const links = member.socialMediaLinks ?? {};
  return (
    links.facebook?.trim() ||
    links.instagram?.trim() ||
    links.linkedin?.trim() ||
    links.twitter?.trim() ||
    links.youtube?.trim() ||
    links.website?.trim()
  );
};

const formatSocialLabel = (link?: string) => {
  if (!link) {
    return '—';
  }

  try {
    const normalizedLink = link.startsWith('http') ? link : `https://${link}`;
    const url = new URL(normalizedLink);
    return url.hostname.replace(/^www\./, '');
  } catch (error) {
    console.warn('Failed to normalize social link:', link, error);
    return link;
  }
};

const toTeamMemberRow = (member: TeamMemberApiItem): TeamMemberRow | null => {
  const id = member.id || member._id;
  if (!id) {
    return null;
  }

  return {
    id,
    memberName: member.memberName ?? 'Unnamed member',
    role: member.role ?? '—',
    major: member.major ?? '—',
    university: member.university ?? '—',
    profilePicture: member.profilePicture,
    status: member.status ?? 'inactive',
    order: member.order ?? 0,
    createdAt: member.createdAt,
    primarySocialLink: pickPrimarySocialLink(member),
    pinned: member.pinned ?? false,
  };
};

const SkyRiseTeamTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<Set<string>>(
    () => new Set()
  );
  const [selectedTeamIds, setSelectedTeamIds] = useState<Set<string>>(
    () => new Set()
  );
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMemberRow | null>(
    null
  );
  const [sortState, setSortState] = useState<SortState>({
    key: 'createdAt',
    direction: 'desc',
  });
  const bulkDeleteTeamMembersMutation = useBulkDeleteTeamMembers();
  const createTeamMemberMutation = useCreateTeamMember();
  const updateTeamMemberMutation = useUpdateTeamMember();
  const uploadTeamMemberImageMutation = useUploadTeamMemberImage();
  const {
    data: teamMembersResponse,
    isPending: isTeamMembersLoading,
    isError: isTeamMembersError,
  } = useTeamMembers(1, TEAM_MEMBERS_QUERY_LIMIT);
  const isDeleteActionPending = bulkDeleteTeamMembersMutation.isPending;
  const areRowActionsDisabled =
    isDeleteActionPending || updateTeamMemberMutation.isPending;
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
    setEditingMember(null);
  };

  const handleDeleteSelected = useCallback(async () => {
    if (selectedTeamIds.size === 0) {
      return;
    }

    const rawIds = Array.from(selectedTeamIds);
    const ids = rawIds.filter(
      (value): value is string =>
        typeof value === 'string' && value.trim().length > 0
    );

    if (ids.length === 0) {
      console.warn('No valid team member IDs selected for deletion.', rawIds);
      return;
    }

    if (ids.length < rawIds.length) {
      console.warn(
        'Skipping team member IDs that are invalid or empty.',
        rawIds
      );
    }

    try {
      await bulkDeleteTeamMembersMutation.mutateAsync(ids);
      setSelectedRowKeys(new Set());
      setSelectedTeamIds(new Set());
    } catch (error) {
      console.error('Failed to delete team members:', error);
      try {
        for (const teamMemberId of ids) {
          await bulkDeleteTeamMembersMutation.mutateAsync([teamMemberId]);
        }
        setSelectedRowKeys(new Set());
        setSelectedTeamIds(new Set());
      } catch (singleDeleteError) {
        console.error('Fallback team member delete failed:', singleDeleteError);
      }
    }
  }, [bulkDeleteTeamMembersMutation, selectedTeamIds]);

  const handleDeleteSingleMember = useCallback(
    async (memberId: string) => {
      if (!memberId) {
        return;
      }

      try {
        await bulkDeleteTeamMembersMutation.mutateAsync([memberId]);
        setSelectedRowKeys((prev) => {
          if (!prev.has(memberId)) {
            return prev;
          }
          const next = new Set(prev);
          next.delete(memberId);
          return next;
        });
        setSelectedTeamIds((prev) => {
          if (!prev.has(memberId)) {
            return prev;
          }
          const next = new Set(prev);
          next.delete(memberId);
          return next;
        });
      } catch (error) {
        console.error('Failed to delete team member:', error);
      }
    },
    [bulkDeleteTeamMembersMutation]
  );

  const rawTeamMembers = useMemo(
    () => teamMembersResponse?.data?.teamMembers ?? [],
    [teamMembersResponse]
  );

  const teamRows = useMemo(() => {
    return rawTeamMembers
      .map(toTeamMemberRow)
      .filter((member): member is TeamMemberRow => Boolean(member));
  }, [rawTeamMembers]);

  const handleAddTeamMember = useCallback(
    async (values: AddTeamMemberFormValues) => {
      try {
        let profilePictureUrl: string | undefined;
        if (values.profilePicture) {
          const formData = new FormData();
          formData.append('image', values.profilePicture);
          const uploadResponse =
            await uploadTeamMemberImageMutation.mutateAsync(formData);
          profilePictureUrl = uploadResponse?.data?.url;
          if (!profilePictureUrl) {
            console.warn('Team member image upload succeeded without URL');
          }
        }

        await createTeamMemberMutation.mutateAsync({
          memberName: values.memberName,
          role: values.role,
          major: values.major,
          university: values.university,
          socialMediaLink: values.socialMediaLink || undefined,
          profilePicture: profilePictureUrl,
          pinned: false,
        });

        setIsAddDrawerOpen(false);
      } catch (error) {
        console.error('Failed to add team member:', error);
      }
    },
    [createTeamMemberMutation, uploadTeamMemberImageMutation]
  );

  const handleEditAction = useCallback((member: TeamMemberRow) => {
    setEditingMember(member);
  }, []);

  const handleEditTeamMember = useCallback(
    async (values: AddTeamMemberFormValues) => {
      if (!editingMember?.id) {
        console.warn('Cannot edit team member without a valid selection.');
        return;
      }

      try {
        let profilePictureUrl = editingMember.profilePicture;

        if (values.profilePicture) {
          const formData = new FormData();
          formData.append('image', values.profilePicture);
          const uploadResponse =
            await uploadTeamMemberImageMutation.mutateAsync(formData);
          profilePictureUrl = uploadResponse?.data?.url || profilePictureUrl;
        }

        await updateTeamMemberMutation.mutateAsync({
          id: editingMember.id,
          payload: {
            memberName: values.memberName,
            role: values.role,
            major: values.major,
            university: values.university,
            socialMediaLink: values.socialMediaLink || undefined,
            profilePicture: profilePictureUrl,
          },
        });

        setEditingMember(null);
      } catch (error) {
        console.error('Failed to update team member:', error);
      }
    },
    [editingMember, updateTeamMemberMutation, uploadTeamMemberImageMutation]
  );

  const filteredRows = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return teamRows;
    }

    return teamRows.filter((row) => {
      const valuesToSearch = [
        row.memberName,
        row.role,
        row.major,
        row.university,
        row.status,
        row.primarySocialLink ?? '',
      ];

      return valuesToSearch.some((field) =>
        field.toLowerCase().includes(query)
      );
    });
  }, [searchTerm, teamRows]);

  const sortedRows = useMemo(() => {
    if (!sortState) {
      return filteredRows;
    }

    const { key, direction } = sortState;
    const sorted = [...filteredRows];

    sorted.sort((a, b) => {
      const multiplier = direction === 'asc' ? 1 : -1;

      const getComparableValue = (row: TeamMemberRow) => {
        switch (key) {
          case 'memberName':
            return row.memberName.toLowerCase();
          case 'role':
            return row.role.toLowerCase();
          case 'major':
            return row.major.toLowerCase();
          case 'university':
            return row.university.toLowerCase();
          case 'status':
            return row.status.toLowerCase();
          case 'primarySocialLink':
            return (row.primarySocialLink ?? '').toLowerCase();
          case 'order':
            return row[key];
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
      setSelectedTeamIds((prev) => {
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

    setSelectedTeamIds((prev) => {
      if (prev.size === 0) return prev;
      const next = new Set(Array.from(prev).filter((id) => validIds.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [tableData]);

  const getRowKey = useCallback((row: TeamMemberRow) => row.id, []);

  const rowIsSelected = useCallback(
    (row: TeamMemberRow) => selectedRowKeys.has(getRowKey(row)),
    [getRowKey, selectedRowKeys]
  );

  const handleSelectRow = useCallback(
    (row: TeamMemberRow, _index: number, selected: boolean) => {
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

      setSelectedTeamIds((prev) => {
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

  const handleTogglePinnedStatus = useCallback(
    async (member: TeamMemberRow) => {
      if (!member.id || updateTeamMemberMutation.isPending) {
        return;
      }

      try {
        await updateTeamMemberMutation.mutateAsync({
          id: member.id,
          payload: {
            pinned: !member.pinned,
          },
        });
      } catch (error) {
        console.error('Failed to toggle pinned status:', error);
      }
    },
    [updateTeamMemberMutation]
  );

  const emptyMessage = useMemo(() => {
    if (isTeamMembersLoading) {
      return 'Loading team members...';
    }

    if (isTeamMembersError) {
      return 'Unable to load team members right now.';
    }

    if (rawTeamMembers.length === 0) {
      return 'No team members have been added yet.';
    }

    if (searchTerm.trim()) {
      return `No team members match "${searchTerm}".`;
    }

    return 'No team members found.';
  }, [
    isTeamMembersError,
    isTeamMembersLoading,
    rawTeamMembers.length,
    searchTerm,
  ]);

  const totalMembers =
    teamMembersResponse?.total ??
    teamMembersResponse?.count ??
    tableData.length;

  const isEditDrawerOpen = Boolean(editingMember);

  const editingDrawerInitialValues = useMemo<
    Partial<AddTeamMemberFormValues> | undefined
  >(() => {
    if (!editingMember) {
      return undefined;
    }

    return {
      memberName: editingMember.memberName,
      role: editingMember.role,
      major: editingMember.major,
      university: editingMember.university,
      socialMediaLink: editingMember.primarySocialLink ?? '',
      profilePicture: null,
    };
  }, [editingMember]);

  const teamColumns: TableColumn<TeamMemberRow>[] = useMemo(
    () => [
      {
        key: 'pinned',
        header: '',
        minWidth: '3rem',
        render: (row) => (
          <button
            type="button"
            className="flex items-center justify-center"
            onClick={(event) => {
              event.stopPropagation();
              handleTogglePinnedStatus(row);
            }}
            aria-label={row.pinned ? 'Unpin team member' : 'Pin team member'}
            aria-pressed={row.pinned}
            disabled={areRowActionsDisabled}
          >
            {row.pinned ? (
              <AddPinIcon className="text-primary h-5 w-5" />
            ) : (
              <PinIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        ),
      },
      {
        key: 'memberName',
        header: 'Name',
        minWidth: '14rem',
        sortable: true,
        render: (row) => (
          <span className="text-sm font-semibold text-gray-900">
            {row.memberName}
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
        key: 'role',
        header: 'Role Position',
        sortable: true,
        minWidth: '10rem',
        render: (row) => (
          <span className="text-sm text-gray-700">{row.role}</span>
        ),
      },
      {
        key: 'major',
        header: 'Major',
        minWidth: '14rem',
        sortable: true,
        render: (row) => (
          <span className="text-sm text-gray-700">{row.major}</span>
        ),
      },
      {
        key: 'university',
        header: 'University',
        sortable: true,
        minWidth: '14rem',
        render: (row) => (
          <span className="text-sm text-gray-700">{row.university}</span>
        ),
      },
      {
        key: 'primarySocialLink',
        header: 'Social Media Link',
        minWidth: '14rem',
        sortable: true,
        render: (row) =>
          row.primarySocialLink ? (
            <a
              href={row.primarySocialLink}
              target="_blank"
              rel="noreferrer"
              className="text-primary text-sm font-semibold underline"
            >
              {formatSocialLabel(row.primarySocialLink)}
            </a>
          ) : (
            <span className="text-sm text-gray-500">—</span>
          ),
      },
      {
        key: 'profilePicture',
        header: 'Image',
        minWidth: '10rem',
        render: (row) =>
          row.profilePicture ? (
            <p>{row.memberName}.png</p>
          ) : (
            <span className="text-sm text-gray-500">—</span>
          ),
      },
    ],
    [areRowActionsDisabled, handleTogglePinnedStatus]
  );

  const renderActions = useCallback(
    (row: TeamMemberRow) => (
      <TeamMemberActionDropdown
        member={row}
        onEdit={handleEditAction}
        onRemove={handleDeleteSingleMember}
        disabled={areRowActionsDisabled}
      />
    ),
    [areRowActionsDisabled, handleDeleteSingleMember, handleEditAction]
  );
  return (
    <div>
      <p className="text-h2 text-text-primary">
        Total members{' '}
        <span className="text-h2 text-text-primary font-semibold">
          {totalMembers || 0}
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
              placeholder="Search Member Name"
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
            + Add Team Member
          </Button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <DataTable
          columns={teamColumns}
          data={tableData}
          getRowId={(row) => getRowKey(row)}
          selectable
          isRowSelected={(row) => rowIsSelected(row)}
          onSelectRow={handleSelectRow}
          sortState={sortState}
          onSortChange={handleSortChange}
          renderActions={renderActions}
          emptyMessage={emptyMessage}
          maxBodyHeight={TEAM_TABLE_MAX_BODY_HEIGHT}
          className="min-w-[960px] overflow-visible"
        />
      </div>
      <AddTeamDrawer
        open={isAddDrawerOpen}
        onClose={handleCloseAddDrawer}
        onSubmit={handleAddTeamMember}
        isSubmitting={createTeamMemberMutation.isPending}
        submitLabel={createTeamMemberMutation.isPending ? 'Adding...' : 'Add'}
      />
      <AddTeamDrawer
        open={isEditDrawerOpen}
        onClose={handleCloseEditDrawer}
        onSubmit={handleEditTeamMember}
        initialValues={editingDrawerInitialValues}
        initialProfilePictureUrl={editingMember?.profilePicture ?? null}
        title="Edit Team Member"
        submitLabel={
          updateTeamMemberMutation.isPending ? 'Saving...' : 'Save Changes'
        }
        isSubmitting={updateTeamMemberMutation.isPending}
      />
    </div>
  );
};

export default SkyRiseTeamTab;
