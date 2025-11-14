import SearchIcon from '@/assets/search.svg?react';
import RemoveIcon from '@/assets/bin.svg?react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import Button from '@/components/common/Button';
import {
  useBulkDeleteTeamMembers,
  useCreateTeamMember,
  useTeamMembers,
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
};

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
  const [sortState, setSortState] = useState<SortState>({
    key: 'createdAt',
    direction: 'desc',
  });
  const bulkDeleteTeamMembersMutation = useBulkDeleteTeamMembers();
  const createTeamMemberMutation = useCreateTeamMember();
  const uploadTeamMemberImageMutation = useUploadTeamMemberImage();
  const {
    data: teamMembersResponse,
    isPending: isTeamMembersLoading,
    isError: isTeamMembersError,
  } = useTeamMembers(1, TEAM_MEMBERS_QUERY_LIMIT);
  const isDeleteActionPending = bulkDeleteTeamMembersMutation.isPending;
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenAddDrawer = () => {
    setIsAddDrawerOpen(true);
  };

  const handleCloseAddDrawer = () => {
    setIsAddDrawerOpen(false);
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
          profilePictureUrl = uploadResponse?.data?.image?.url;
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

  const teamColumns: TableColumn<TeamMemberRow>[] = useMemo(
    () => [
      {
        key: 'memberName',
        header: 'Consultant Name',
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
        header: 'Profile Picture',
        minWidth: '10rem',
        render: (row) =>
          row.profilePicture ? (
            <p>{row.memberName}.png</p>
          ) : (
            <span className="text-sm text-gray-500">—</span>
          ),
      },
    ],
    []
  );

  const renderActions = useCallback(
    (row: TeamMemberRow) => (
      <button
        type="button"
        onClick={() => handleDeleteSingleMember(row.id)}
        disabled={isDeleteActionPending}
        className={clsx(
          'text-sm font-semibold text-red-500 hover:text-red-600',
          isDeleteActionPending && 'cursor-not-allowed opacity-60'
        )}
      >
        Remove
      </button>
    ),
    [handleDeleteSingleMember, isDeleteActionPending]
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
        <div className="relative z-50 flex min-w-[290px] flex-1 max-w-md">
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
        submitLabel={
          createTeamMemberMutation.isPending ? 'Adding...' : 'Add'
        }
      />
    </div>
  );
};

export default SkyRiseTeamTab;
