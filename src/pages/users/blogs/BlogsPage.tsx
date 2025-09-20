import React, { useState, useMemo, useRef } from 'react';
import BlogCard from '@/components/blog/BlogCard';
import BlogFilter from '@/components/blog/BlogFilter';
import { BlogCardSkeleton } from '@/components/ui';
import { useBlogs, useLatestBlogs } from '@/queries';
import type { BlogCategory } from '@/types/users/blog';
import Pagination from '@/components/common/Pagination';
import { capitalizeFirstLetters } from '@/helpers';

const BlogsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<BlogCategory>('All Categories');
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;
  const allBlogsRef = useRef<HTMLDivElement>(null);

  const {
    data: blogsData,
    isLoading: blogsLoading,
    error: blogsError,
  } = useBlogs({
    category:
      selectedCategory === 'All Categories' ? undefined : selectedCategory,
    page: currentPage,
    limit: blogsPerPage,
  });

  const {
    data: latestData,
    isLoading: latestLoading,
    error: latestError,
  } = useLatestBlogs(selectedCategory === 'All Categories' ? 6 : 0); // Get 6 for latest + featured, 0 for categories

  const currentBlogs = useMemo(() => blogsData?.data.blogs || [], [blogsData]);
  const pagination = blogsData?.data.pagination;
  const latestBlogs = useMemo(() => latestData?.data.blogs || [], [latestData]);

  const latestBlog = useMemo(() => {
    if (selectedCategory === 'All Categories') {
      return latestBlogs[0];
    } else {
      return currentBlogs[0];
    }
  }, [selectedCategory, latestBlogs, currentBlogs]);

  const featuredBlogs = useMemo(() => {
    if (selectedCategory !== 'All Categories') return [];
    return latestBlogs.slice(1, 6); // Skip first one, take next 5
  }, [latestBlogs, selectedCategory]);

  // Calculate total pages from API pagination
  const totalPages = pagination?.totalPages || 1;

  // Check if any data is loading
  const isLoading =
    blogsLoading || (selectedCategory === 'All Categories' && latestLoading);

  // Handle errors
  const hasError =
    blogsError || (selectedCategory === 'All Categories' && latestError);
  const errorMessage = blogsError?.message || latestError?.message;

  const handleCategoryChange = (category: BlogCategory) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setTimeout(() => {
      if (allBlogsRef.current) {
        const y =
          allBlogsRef.current.getBoundingClientRect().top + window.scrollY - 96; // 96px = 6rem
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 0);
  };

  return (
    <div className="min-h-screen pb-16">
      <div className="flex items-center bg-white px-5 pb-3 shadow-md lg:px-15">
        <h1 className="lg:text-h2 text-h2 text-text-primary font-semibold">
          Blogs
        </h1>
        <div className="ml-4 flex-shrink-0">
          <BlogFilter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
      </div>

      <div className="w-full px-5 py-2 lg:px-15">
        {/* Error State */}
        {hasError && (
          <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="text-red-800">
              <p className="font-medium">{'Error loading blogs'}</p>
              <p className="text-sm">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Loading State - Only show skeleton for latest post */}
        {isLoading && selectedCategory === 'All Categories' && (
          <section className="mb-10">
            <div className="mt-2 mb-8 flex items-center justify-between">
              <div className="h-8 w-32 animate-pulse rounded bg-gray-200"></div>
            </div>
            <BlogCardSkeleton variant="medium" />
          </section>
        )}

        {/* General loading for other categories */}
        {isLoading && selectedCategory !== 'All Categories' && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
              <p className="text-text-secondary">{'Loading blogs'}</p>
            </div>
          </div>
        )}

        {!isLoading && !hasError && (
          <>
            {latestBlog && (
              <section className="mb-10">
                <div className="mt-2 mb-8 flex items-center justify-between">
                  <h2 className="text-h3 lg:text-h2 text-text-primary font-bold">
                    {selectedCategory === 'All Categories'
                      ? 'Latest Blog'
                      : capitalizeFirstLetters(selectedCategory.toString())}
                  </h2>
                </div>
                <div className="w-full">
                  <BlogCard blog={latestBlog} variant="medium" />
                </div>
              </section>
            )}

            {selectedCategory === 'All Categories' &&
              featuredBlogs.length > 0 && (
                <section className="mb-10">
                  <h2 className="text-h3 lg:text-h2 text-text-primary mb-8 font-bold">
                    {'Featured Blogs'}
                  </h2>
                  <div className="scrollbar-hide overflow-x-auto scroll-smooth">
                    <div
                      className="flex gap-6 px-1 pb-4"
                      style={{ width: 'max-content' }}
                    >
                      {featuredBlogs.map((blog) => (
                        <div key={blog._id} className="flex-shrink-0">
                          <BlogCard blog={blog} variant="small" />
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

            <section ref={allBlogsRef}>
              {selectedCategory === 'All Categories' && (
                <h2 className="text-h2 text-text-primary mb-8 font-bold">
                  {'All Blogs'}
                </h2>
              )}

              {currentBlogs.length > 0 ? (
                <>
                  <div className="mb-12 space-y-4">
                    {currentBlogs.map((blog) => (
                      <BlogCard key={blog._id} blog={blog} variant="mini" />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      isLoading={isLoading}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              ) : (
                !isLoading && (
                  <div className="py-12 text-center">
                    <div className="text-h3 text-text-secondary mb-4">
                      {'No blogs found in this category'}
                    </div>
                    <button
                      onClick={() => setSelectedCategory('All Categories')}
                      className="text-primary hover:text-primary/80 text-h4 font-medium transition-colors"
                    >
                      {'View All Blogs'} →
                    </button>
                  </div>
                )
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;
