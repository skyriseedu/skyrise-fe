import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable, {
  type SortState,
  type TableColumn,
} from '@/components/common/DataTable';
import Filter from '@/assets/filter-alt.svg?react';
import Search from '@/assets/search.svg?react';
import RemoveIcon from '@/assets/bin.svg?react';
import EditIcon from '@/assets/edit.svg?react';
import ViewIcon from '@/assets/view.svg?react';
import { formatNthDate } from '@/helpers';
import { useBlogs, useBulkDeleteBlogs, useDeleteBlog } from '@/queries';
import type { Blog } from '@/types/users/blog';

const FETCH_ALL_LIMIT = 1000;

const BlogSetup: React.FC = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlogs, setSelectedBlogs] = useState<Set<string>>(new Set());
  const [sortState, setSortState] = useState<SortState>({
    key: 'postedDate',
    direction: 'desc',
  });
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(
    new Set()
  );

  const categoryFilterRef = useRef<HTMLDivElement>(null);
  const statusFilterRef = useRef<HTMLDivElement>(null);

  const {
    data: blogsData,
    isLoading,
    isError,
  } = useBlogs({ page: 1, limit: FETCH_ALL_LIMIT });
  const deleteBlogMutation = useDeleteBlog();
  const bulkDeleteBlogsMutation = useBulkDeleteBlogs();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        categoryFilterRef.current &&
        !categoryFilterRef.current.contains(target)
      ) {
        setShowCategoryFilter(false);
      }

      if (
        statusFilterRef.current &&
        !statusFilterRef.current.contains(target)
      ) {
        setShowStatusFilter(false);
      }
    };

    if (showCategoryFilter || showStatusFilter) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showCategoryFilter, showStatusFilter]);

  const blogs = blogsData?.data.blogs ?? [];

  const categoryOptions = useMemo(
    () => Array.from(new Set(blogs.map((blog) => blog.category))).sort(),
    [blogs]
  );

  const statusOptions = useMemo(
    () => Array.from(new Set(blogs.map((blog) => blog.status))).sort(),
    [blogs]
  );

  const filteredBlogs = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return blogs.filter((blog) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        blog.title.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        selectedCategories.size === 0 || selectedCategories.has(blog.category);

      const matchesStatus =
        selectedStatuses.size === 0 || selectedStatuses.has(blog.status);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [blogs, searchQuery, selectedCategories, selectedStatuses]);

  const sortedBlogs = useMemo(() => {
    const sorted = [...filteredBlogs];

    sorted.sort((a, b) => {
      const getComparableValue = (blog: Blog) => {
        switch (sortState.key) {
          case 'postedDate':
            return blog.postedDate ? new Date(blog.postedDate).getTime() : 0;
          case 'updatedAt':
            return blog.updatedAt ? new Date(blog.updatedAt).getTime() : 0;
          case 'title':
            return blog.title.toLowerCase();
          case 'category':
            return blog.category.toLowerCase();
          default:
            return '';
        }
      };

      const aValue = getComparableValue(a);
      const bValue = getComparableValue(b);

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        if (sortState.direction === 'asc') {
          return aValue - bValue;
        }

        return bValue - aValue;
      }

      if (sortState.direction === 'asc') {
        return String(aValue).localeCompare(String(bValue));
      }

      return String(bValue).localeCompare(String(aValue));
    });

    return sorted;
  }, [filteredBlogs, sortState]);

  const handleCategoryToggle = (category: string) => {
    const next = new Set(selectedCategories);
    if (next.has(category)) {
      next.delete(category);
    } else {
      next.add(category);
    }
    setSelectedCategories(next);
  };

  const handleStatusToggle = (status: string) => {
    const next = new Set(selectedStatuses);
    if (next.has(status)) {
      next.delete(status);
    } else {
      next.add(status);
    }
    setSelectedStatuses(next);
  };

  const handleSelectRow = (_blog: Blog, index: number, selected: boolean) => {
    const row = sortedBlogs[index];
    if (!row) return;

    const next = new Set(selectedBlogs);
    if (selected) {
      next.add(row._id);
    } else {
      next.delete(row._id);
    }

    setSelectedBlogs(next);
  };

  const handleRemoveSelected = () => {
    if (selectedBlogs.size === 0) return;

    if (
      !confirm(`Are you sure you want to delete ${selectedBlogs.size} blog(s)?`)
    ) {
      return;
    }

    bulkDeleteBlogsMutation.mutate(
      { ids: Array.from(selectedBlogs) },
      {
        onSuccess: () => {
          setSelectedBlogs(new Set());
        },
      }
    );
  };

  const handleView = (blog: Blog) => {
    navigate(`/admin/blog-setup/view/${blog.slug}`);
    setOpenDropdown(null);
  };

  const handleEdit = (blog: Blog) => {
    navigate(`/admin/blog-setup/edit/${blog.slug}`);
    setOpenDropdown(null);
  };

  const handleRemove = (blog: Blog) => {
    if (!confirm(`Are you sure you want to delete "${blog.title}"?`)) {
      return;
    }

    deleteBlogMutation.mutate(blog._id, {
      onSuccess: () => {
        setOpenDropdown(null);

        if (selectedBlogs.has(blog._id)) {
          const next = new Set(selectedBlogs);
          next.delete(blog._id);
          setSelectedBlogs(next);
        }
      },
    });
  };

  const handleCreateNew = () => {
    navigate('/admin/blog-setup/create');
  };

  const ActionDropdown: React.FC<{ blog: Blog }> = ({ blog }) => {
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

      if (openDropdown === blog._id) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }
    }, [blog._id]);

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          className="cursor-pointer p-1 text-gray-500 hover:text-gray-700"
          onClick={() =>
            setOpenDropdown(openDropdown === blog._id ? null : blog._id)
          }
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>

        {openDropdown === blog._id && (
          <div className="absolute right-0 z-10 mt-1 w-38 rounded-lg border border-gray-200 bg-white shadow-lg">
            <div className="py-1">
              <button
                onClick={() => handleView(blog)}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                <ViewIcon className="h-4 w-4 text-gray-500" />
                View
              </button>
              <button
                onClick={() => handleEdit(blog)}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                <EditIcon className="h-4 w-4 text-gray-500" />
                Edit
              </button>
              <button
                onClick={() => handleRemove(blog)}
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

  const columns: TableColumn<Blog>[] = [
    {
      key: 'title',
      header: 'Blog Title',
      sortable: false,
      cellClassName: 'font-medium',
    },
    {
      key: 'category',
      header: 'Category',
      sortable: false,
      render: (blog) => blog.category,
    },
    {
      key: 'postedDate',
      header: 'Published Date',
      sortable: true,
      headerContentClassName: 'flex items-center gap-1',
      render: (blog) =>
        blog.postedDate ? formatNthDate(new Date(blog.postedDate)) : '',
    },
    {
      key: 'updatedAt',
      header: 'Modified Date',
      sortable: true,
      headerContentClassName: 'flex items-center gap-1',
      render: (blog) =>
        blog.updatedAt ? formatNthDate(new Date(blog.updatedAt)) : '',
    },
  ];

  const renderActions = (blog: Blog) => <ActionDropdown blog={blog} />;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching blogs.</div>;

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-h2 mb-6 font-semibold text-gray-900">
            Total Blogs {sortedBlogs.length}
          </h1>

          <div className="flex items-center justify-between gap-4">
            <div className="relative z-50 flex max-w-md justify-between space-x-5">
              <div className="relative min-w-[290px]">
                <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Blog Title"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10"
                />
              </div>

              <div className="relative" ref={categoryFilterRef}>
                <button
                  onClick={() => setShowCategoryFilter((prev) => !prev)}
                  className="bg-secondary flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700 hover:bg-red-200"
                >
                  <Filter />
                  Category
                  {selectedCategories.size > 0 && (
                    <span className="ml-1 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                      {selectedCategories.size}
                    </span>
                  )}
                </button>

                {showCategoryFilter && (
                  <div className="absolute top-full left-0 z-[100] mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg">
                    <div className="max-h-64 overflow-y-auto p-4">
                      {categoryOptions.length === 0 ? (
                        <p className="text-sm text-gray-500">No categories</p>
                      ) : (
                        categoryOptions.map((category) => (
                          <label
                            key={category}
                            className="mb-2 flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-gray-50"
                          >
                            <input
                              type="checkbox"
                              checked={selectedCategories.has(category)}
                              onChange={() => handleCategoryToggle(category)}
                              className="h-5 w-5 rounded border-gray-300 text-red-500 focus:ring-red-500"
                            />
                            <span className="text-sm font-medium text-gray-800">
                              {category}
                            </span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative" ref={statusFilterRef}>
                <button
                  onClick={() => setShowStatusFilter((prev) => !prev)}
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
                    <div className="max-h-64 overflow-y-auto p-4">
                      {statusOptions.length === 0 ? (
                        <p className="text-sm text-gray-500">No statuses</p>
                      ) : (
                        statusOptions.map((status) => (
                          <label
                            key={status}
                            className="mb-2 flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-gray-50"
                          >
                            <input
                              type="checkbox"
                              checked={selectedStatuses.has(status)}
                              onChange={() => handleStatusToggle(status)}
                              className="h-5 w-5 rounded border-gray-300 text-red-500 focus:ring-red-500"
                            />
                            <span className="text-sm font-medium text-gray-800">
                              {status}
                            </span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {selectedBlogs.size > 0 && (
                <button
                  onClick={handleRemoveSelected}
                  disabled={bulkDeleteBlogsMutation.isPending}
                  className="bg-secondary flex items-center gap-2 rounded-xl px-4 py-2 text-gray-700 hover:bg-red-200 disabled:opacity-50"
                >
                  <RemoveIcon className="h-4 w-4" />
                  Remove ({selectedBlogs.size})
                </button>
              )}

              <button
                onClick={handleCreateNew}
                className="bg-primary flex items-center gap-2 rounded-xl px-4 py-2 text-white hover:bg-red-600"
              >
                <span>+</span>New Blog
              </button>
            </div>
          </div>
        </div>

        <DataTable<Blog & Record<string, unknown>>
          columns={columns}
          data={sortedBlogs as (Blog & Record<string, unknown>)[]}
          getRowId={(blog) => blog._id}
          selectable={true}
          isRowSelected={(blog) => selectedBlogs.has(blog._id)}
          onSelectRow={handleSelectRow}
          renderActions={renderActions}
          sortState={sortState}
          onSortChange={setSortState}
          emptyMessage="No blogs found."
        />
      </div>
    </div>
  );
};

export default BlogSetup;
