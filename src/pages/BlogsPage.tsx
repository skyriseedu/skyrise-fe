import React, { useState, useMemo } from 'react';
import BlogCard from '../components/blog/BlogCard';
import BlogFilter from '../components/blog/BlogFilter';
import { mockBlogs } from '../data/mockBlogs';
import type { BlogCategory } from '../types/blog';
import CaretLeft from '../assets/caret-left.svg?react';
import CaretRight from '../assets/caret-right.svg?react';

const BlogsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<BlogCategory>('All Categories');
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;

  // Filter blogs based on selected category
  const filteredBlogs = useMemo(() => {
    if (selectedCategory === 'All Categories') {
      return mockBlogs;
    }
    return mockBlogs.filter((blog) => blog.category === selectedCategory);
  }, [selectedCategory]);

  // Pagination logic
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const startIndex = (currentPage - 1) * blogsPerPage;
  const endIndex = startIndex + blogsPerPage;
  const currentBlogs = filteredBlogs.slice(startIndex, endIndex);

  // Get latest blog (most recent by date)
  const latestBlog = useMemo(() => {
    return [...mockBlogs].sort(
      (a, b) =>
        new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
    )[0];
  }, []);

  // Get featured blogs (excluding the latest one)
  const featuredBlogs = useMemo(() => {
    return mockBlogs.filter((blog) => blog._id !== latestBlog._id).slice(0, 5);
  }, [latestBlog]);

  const handleCategoryChange = (category: BlogCategory) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of blog section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Page Header Section - connects seamlessly with main header */}
      <div className="flex items-center bg-white px-5 pb-3 shadow-md lg:px-15">
        <div className="flex items-start gap-4 lg:justify-start">
          <div className="flex items-center text-center lg:text-left">
            <h1 className="lg:text-h1 text-h2 text-text-primary font-bold">
              Blogs
            </h1>
          </div>
          <div className="flex items-center justify-center lg:justify-start">
            <BlogFilter
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        </div>
      </div>

      <div className="w-full px-5 py-2 lg:px-15">
        <section className="mb-10">
          <div className="mt-2 mb-8 flex items-center justify-between">
            <h2 className="text-h3 lg:text-h1 text-text-primary font-bold">
              Latest Post
            </h2>
          </div>
          <div className="w-full">
            <BlogCard blog={latestBlog} variant="medium" />
          </div>
        </section>

        {/* Featured Blogs Section */}
        <section className="mb-10">
          <h2 className="text-h3 lg:text-h1 text-text-primary mb-8 font-bold">
            Featured Blogs
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

        {/* All Blogs Section */}
        <section>
          <h2 className="text-h2 text-text-primary mb-8 font-bold">
            All Blogs
          </h2>

          {/* Blog List */}
          {currentBlogs.length > 0 ? (
            <>
              <div className="mb-12 space-y-4">
                {currentBlogs.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} variant="mini" />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="text-text-secondary hover:border-primary hover:text-primary flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CaretLeft className="h-4 w-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`text-h4 h-10 w-10 rounded-full font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-primary text-white'
                            : 'text-text-secondary hover:text-primary border border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="text-text-secondary hover:border-primary hover:text-primary flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CaretRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center">
              <div className="text-h3 text-text-secondary mb-4">
                No blogs found in this category
              </div>
              <button
                onClick={() => setSelectedCategory('All Categories')}
                className="text-primary hover:text-primary/80 text-h4 font-medium transition-colors"
              >
                View All Blogs →
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default BlogsPage;
