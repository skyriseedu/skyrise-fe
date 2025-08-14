import React, { useState, useMemo } from 'react';
import BlogCard from '../components/blog/BlogCard';
import BlogFilter from '../components/blog/BlogFilter';
import { mockBlogs } from '../data/mockBlogs';
import type { BlogCategory } from '../types/blog';

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
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-center lg:text-left">
              <h1 className="lg:text-h1 text-h2 text-text-primary mb-2 font-bold">
                Blogs
              </h1>
            </div>
            <div className="flex justify-center lg:justify-start">
              <BlogFilter
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <section className="mb-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-h3 lg:h1 text-text-primary font-bold">
              Latest Post
            </h2>
          </div>
          <div className="w-full">
            <BlogCard blog={latestBlog} variant="medium" />
          </div>
        </section>

        {/* Featured Blogs Section */}
        <section className="mb-16">
          <h2 className="text-h2 text-text-primary mb-8 font-bold">
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
          {/* Scroll hint for mobile */}
          <p className="text-h6 text-text-secondary mt-2 text-center md:hidden">
            ← Swipe to see more →
          </p>
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
                    className="text-h4 hover:border-primary hover:text-primary rounded-lg border border-gray-200 px-4 py-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`text-h4 h-10 w-10 rounded-lg font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-primary text-white'
                            : 'text-text-secondary hover:border-primary hover:text-primary border border-gray-200 bg-white'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="text-h4 hover:border-primary hover:text-primary rounded-lg border border-gray-200 px-4 py-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
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
