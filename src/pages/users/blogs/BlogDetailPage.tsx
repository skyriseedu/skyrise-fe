import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import BlogCard from '@/components/blog/BlogCard';
import ArrowLeft from '@/assets/arrow-left.svg?react';
import { useBlogBySlug, useCategoryBlogs } from '@/queries/blogs';

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: blogData,
    isLoading: blogLoading,
    error: blogError,
  } = useBlogBySlug(slug || '');

  const blog = blogData?.data.blog;

  const { data: relatedData } = useCategoryBlogs(blog?.category || '');

  const relatedBlogs =
    relatedData?.data.blogs?.filter((b) => b._id !== blog?._id).slice(0, 5) ||
    [];

  // Handle loading state
  if (blogLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
          <p className="text-text-secondary">Loading blog...</p>
        </div>
      </div>
    );
  }

  // Handle error or blog not found
  if (blogError || !blog) {
    return <Navigate to="/blogs" replace />;
  }

  return (
    <div className="min-h-screen pb-16">
      <div className="flex items-center bg-white px-5 pb-3 shadow-md lg:px-15">
        <div className="flex items-center gap-4">
          <Link
            to="/blogs"
            className="text-text-primary hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="lg:text-h1 text-h2 text-text-primary font-bold">
            Blogs
          </h1>
        </div>
      </div>

      <div className="overflow-hidden">
        <img
          src={blog.imageUrl || 'https://via.placeholder.com/800x600'}
          alt={blog.title}
          className="h-full w-full object-cover lg:h-120"
        />
      </div>

      <div className="px-5 lg:px-15">
        <header className="mt-8 mb-8">
          <h1 className="lg:text-h1 text-h3 text-text-primary mb-4 font-bold">
            {blog.title}
          </h1>

          <div className="text-h5 text-text-secondary mb-6 flex items-center">
            <span>Posted on </span>
            <time dateTime={blog.postedDate} className="ml-1">
              {new Date(blog.postedDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        </header>

        <div className="prose prose-lg mb-12 max-w-none">
          <div className="text-h4 text-text-primary space-y-6 leading-relaxed">
            {blog.blogText
              .split('\n\n')
              .map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
          </div>
        </div>

        {relatedBlogs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-h2 text-text-primary mb-8 font-bold">
              Related Blogs
            </h2>
            <div className="scrollbar-hide overflow-x-auto scroll-smooth">
              <div
                className="flex gap-6 px-1 pb-4"
                style={{ width: 'max-content' }}
              >
                {relatedBlogs.map((blog) => (
                  <div key={blog._id} className="flex-shrink-0">
                    <BlogCard blog={blog} variant="small" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default BlogDetailPage;
