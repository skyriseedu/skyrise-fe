import SearchIcon from '@/assets/search.svg?react';
import RemoveIcon from '@/assets/bin.svg?react';
import { useCallback, useState } from 'react';
import clsx from 'clsx';
import Button from '@/components/common/Button';
import { useBulkDeleteTeamMembers } from '@/queries';
import AddTeamDrawer from '@/components/teams/AddTeamDrawer';

const SkyRiseTeamTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<Set<string>>(
    () => new Set()
  );
  const [selectedTeamIds, setSelectedTeamIds] = useState<Set<string>>(
    () => new Set()
  );
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const bulkDeleteTeamMembersMutation = useBulkDeleteTeamMembers();
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

  return (
    <div>
      <p className="text-h2 text-text-primary">Total members</p>
      <div className="flex flex-wrap mt-4 items-center justify-between gap-4">
        <div className="relative z-50 flex max-w-md justify-between space-x-5">
          <div className="relative max-w-md min-w-[290px] flex-1">
            <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400">
              <SearchIcon className="h-5 w-5" />
            </span>
            <input
              type="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search Name, Email, Status..."
              className="focus:ring-primary/20 w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
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
      <AddTeamDrawer open={isAddDrawerOpen} onClose={handleCloseAddDrawer} />
    </div>
  );
};

export default SkyRiseTeamTab;
