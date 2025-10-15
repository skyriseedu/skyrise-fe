import React from 'react';
import clsx from 'clsx';

import SortIndicator from '@/assets/sort-indicator.svg?react';

type SortDirection = 'asc' | 'desc';

type TableColumn<T> = {
  key: keyof T | string;
  header: string;
  headerClassName?: string;
  headerContentClassName?: string;
  cellClassName?: string;
  minWidth?: number | string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  render?: (row: T, rowIndex: number) => React.ReactNode;
  sortable?: boolean;
  sortKey?: string;
};

type SortState = {
  key: string;
  direction: SortDirection;
};

type DataTableProps<T> = {
  columns: Array<TableColumn<T>>;
  data: T[];
  getRowId: (row: T, index: number) => string;
  selectable?: boolean;
  isAllSelected?: boolean;
  onSelectAll?: (selected: boolean) => void;
  isRowSelected?: (row: T, index: number) => boolean;
  onSelectRow?: (row: T, index: number, selected: boolean) => void;
  renderActions?: (row: T, index: number) => React.ReactNode;
  sortState?: SortState;
  onSortChange?: (state: SortState) => void;
  emptyMessage?: React.ReactNode;
  className?: string;
  maxBodyHeight?: number | string;
};

const getAlignClass = (align: TableColumn<unknown>['align']) => {
  switch (align) {
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right';
    default:
      return 'text-left';
  }
};

const getJustifyClass = (align: TableColumn<unknown>['align']) => {
  switch (align) {
    case 'center':
      return 'justify-center';
    case 'right':
      return 'justify-end';
    default:
      return 'justify-start';
  }
};

const getDimensionValue = (value?: number | string) => {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
};

function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  getRowId,
  selectable = false,
  isRowSelected,
  onSelectRow,
  renderActions,
  sortState,
  onSortChange,
  emptyMessage = 'No records found.',
  className,
  maxBodyHeight,
}: DataTableProps<T>) {
  const scrollContainerStyle = maxBodyHeight
    ? {
        maxHeight: getDimensionValue(maxBodyHeight),
      }
    : undefined;

  const hasRows = data.length > 0;
  const showActionsColumn = Boolean(renderActions);

  const handleSort = (column: TableColumn<T>) => {
    if (!column.sortable || !onSortChange) return;

    const key = column.sortKey ?? String(column.key);
    const isSameKey = sortState?.key === key;
    const nextDirection: SortDirection = isSameKey
      ? sortState?.direction === 'asc'
        ? 'desc'
        : 'asc'
      : 'asc';

    onSortChange({ key, direction: nextDirection });
  };

  return (
    <div className={clsx('overflow-hidden rounded-xl bg-white', className)}>
      <div className="overflow-x-auto">
        <div
          className={clsx('min-w-full', {
            'overflow-y-auto': Boolean(maxBodyHeight),
          })}
          style={scrollContainerStyle}
        >
          <table className="min-w-full border-collapse">
            <thead className="bg-secondary overflow-x-scroll">
              <tr>
                <th className="bg-secondary sticky top-0 z-10 w-10 py-2 align-middle first:rounded-tl-2xl first:rounded-bl-2xl"></th>
                {columns?.map((column) => {
                  const alignment = getAlignClass(column.align);
                  const widthStyle = getDimensionValue(column.width);
                  const minWidthStyle = getDimensionValue(column.minWidth);
                  const key = column.sortKey ?? String(column.key);
                  const justify = getJustifyClass(column.align);
                  const headerContent = (
                    <span
                      className={clsx(
                        'text-text-primary font-semibold',
                        column.headerContentClassName
                      )}
                    >
                      {column.header}
                    </span>
                  );

                  return (
                    <th
                      key={key}
                      className={clsx(
                        'bg-secondary text-h4 sticky top-0 z-10 py-2 font-semibold tracking-wide text-gray-600 uppercase first:rounded-tl-2xl first:rounded-bl-2xl last:rounded-tr-2xl last:rounded-br-2xl',
                        alignment,
                        column.headerClassName
                      )}
                      scope="col"
                      style={{
                        width: widthStyle,
                        minWidth: minWidthStyle,
                      }}
                    >
                      {column.sortable && onSortChange ? (
                        <button
                          type="button"
                          onClick={() => handleSort(column)}
                          className={clsx(
                            'focus-visible:ring-primary/40 flex w-full cursor-pointer items-center gap-2 tracking-wide text-gray-700 uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0',
                            justify,
                            column.headerContentClassName
                          )}
                        >
                          {headerContent}
                          <SortIndicator className={clsx('h-4 w-4')} />
                        </button>
                      ) : (
                        headerContent
                      )}
                    </th>
                  );
                })}
                {showActionsColumn && (
                  <th
                    className="sticky top-0 z-10 w-12 border-b border-[#F8CED3] bg-[#FFE6E7] px-4 py-4 last:rounded-tr-2xl last:rounded-br-2xl"
                    scope="col"
                  />
                )}
              </tr>
            </thead>
            <tbody>
              {hasRows ? (
                data.map((row, rowIndex) => {
                  const rowId = getRowId(row, rowIndex);
                  const selected = isRowSelected?.(row, rowIndex) ?? false;

                  return (
                    <tr
                      key={rowId}
                      className="border-b border-[#E9E9E9] last:border-b-0 hover:bg-[#FFF5F5]"
                    >
                      {selectable && (
                        <td className="px-4 py-5 align-middle">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 accent-[#DE585B]"
                            checked={selected}
                            onChange={(event) =>
                              onSelectRow?.(row, rowIndex, event.target.checked)
                            }
                            aria-label={`Select row ${rowIndex + 1}`}
                          />
                        </td>
                      )}
                      {columns.map((column) => {
                        const alignment = getAlignClass(column.align);
                        const key = String(column.key);
                        const defaultValue = (
                          row as Record<string, React.ReactNode | undefined>
                        )[key];

                        return (
                          <td
                            key={`${rowId}-${key}`}
                            className={clsx(
                              'px-4 py-5 text-sm text-gray-700',
                              alignment,
                              column.cellClassName
                            )}
                          >
                            {column.render
                              ? column.render(row, rowIndex)
                              : ((defaultValue as React.ReactNode) ?? null)}
                          </td>
                        );
                      })}
                      {showActionsColumn && (
                        <td className="px-4 py-5 text-right">
                          {renderActions?.(row, rowIndex)}
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={
                      columns.length +
                      (selectable ? 1 : 0) +
                      (showActionsColumn ? 1 : 0)
                    }
                    className="px-4 py-12 text-center text-sm text-gray-500"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export type { DataTableProps, SortDirection, SortState, TableColumn };
export default DataTable;
