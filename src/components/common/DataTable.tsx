import React from 'react';
import clsx from 'clsx';

import CaretUpIcon from '@/assets/caret-up.svg?react';
import CaretDownIcon from '@/assets/caret-down.svg?react';

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

type HeaderCellButtonProps = {
  active: boolean;
  direction?: SortDirection;
};

const SortIndicator: React.FC<HeaderCellButtonProps> = ({
  active,
  direction,
}) => (
  <span className="relative flex flex-col text-gray-300" aria-hidden="true">
    <CaretUpIcon
      className={clsx(
        'h-2.5 w-2.5',
        active && direction === 'asc' ? 'text-primary' : 'text-gray-400'
      )}
    />
    <CaretDownIcon
      className={clsx(
        'h-2.5 w-2.5 -mt-0.5',
        active && direction === 'desc' ? 'text-primary' : 'text-gray-400'
      )}
    />
  </span>
);

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
    <div
      className={clsx(
        'overflow-hidden rounded-xl bg-white ',
        className
      )}
    >
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
                  <th
                    className="sticky top-0 z-10 w-10 px-4 py-4 align-middle bg-secondary first:rounded-tl-2xl first:rounded-bl-2xl"
                  >
                  </th>
                {columns?.map((column) => {
                  const alignment = getAlignClass(column.align);
                  const widthStyle = getDimensionValue(column.width);
                  const minWidthStyle = getDimensionValue(column.minWidth);
                  const key = column.sortKey ?? String(column.key);
                  const isActive = sortState?.key === key;
                  const justify = getJustifyClass(column.align);
                  const headerContent = (
                    <span
                      className={clsx(
                        'font-semibold text-text-primary',
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
                        'sticky top-0 z-10 px-4 py-4 text-sm font-medium uppercase tracking-wide text-gray-600 bg-secondary first:rounded-bl-2xl first:rounded-tl-2xl last:rounded-br-2xl last:rounded-tr-2xl',
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
                            'flex w-full items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0',
                            justify,
                            column.headerContentClassName
                          )}
                        >
                          {headerContent}
                          <SortIndicator
                            active={isActive}
                            direction={isActive ? sortState?.direction : undefined}
                          />
                        </button>
                      ) : (
                        headerContent
                      )}
                    </th>
                  );
                })}
                {showActionsColumn && (
                  <th
                    className="sticky top-0 z-10 w-12 px-4 py-4 border-b border-[#F8CED3] bg-[#FFE6E7] last:rounded-br-2xl last:rounded-tr-2xl"
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
                        const defaultValue =
                          (row as Record<string, React.ReactNode | undefined>)[key];

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
                              : (defaultValue as React.ReactNode) ?? null}
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
                      columns.length + (selectable ? 1 : 0) + (showActionsColumn ? 1 : 0)
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
