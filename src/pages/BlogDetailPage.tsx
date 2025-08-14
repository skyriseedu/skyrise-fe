import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { mockBlogs } from '../data/mockBlogs';
import BlogCard from '../components/blog/BlogCard';

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Find the blog by slug
  const blog = mockBlogs.find((b) => b.slug === slug);

  if (!blog) {
    return <Navigate to="/blogs" replace />;
  }

  // Get related blogs (same category, excluding current blog)
  const relatedBlogs = mockBlogs
    .filter((b) => b.category === blog.category && b._id !== blog._id)
    .slice(0, 3);

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-h5 text-text-secondary mb-8 flex items-center gap-2">
          <Link to="/blogs" className="hover:text-primary transition-colors">
            Blogs
          </Link>
          <span>•</span>
          <span className="text-text-primary">{blog.title}</span>
        </nav>

        <article className="mx-auto max-w-4xl">
          {/* Blog Header */}
          <header className="mb-8">
            <div className="mb-4 flex items-center gap-4">
              <span className="bg-primary/10 text-primary text-h6 rounded-full px-3 py-1 font-medium capitalize">
                {blog.category}
              </span>
              <span className="text-h5 text-text-secondary">
                {blog.readingTime} min read
              </span>
            </div>

            <h1 className="text-h1 text-text-primary mb-4 font-bold">
              {blog.title}
            </h1>

            <div className="text-h5 text-text-secondary mb-6 flex items-center gap-4">
              <span>{blog.views} views</span>
              <span>•</span>
              <time dateTime={blog.postedDate}>
                {new Date(blog.postedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>

            {/* Featured Image */}
            <div className="mb-8 aspect-video overflow-hidden rounded-xl">
              <img
                src={blog.imageUrl || 'https://via.placeholder.com/800x600'}
                alt={blog.title}
                className="h-full w-full object-cover"
              />
            </div>
          </header>

          {/* Blog Content */}
          <div className="prose prose-lg mb-12 max-w-none">
            <div className="text-h3 text-text-secondary mb-6 leading-relaxed font-medium">
              {blog.description || blog.blogText}
            </div>

            <div className="text-h4 text-text-primary space-y-6 leading-relaxed">
              {blog.blogText.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="mb-12 flex flex-wrap gap-2 border-b border-gray-200 pb-8">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="text-text-secondary text-h6 rounded-full bg-gray-100 px-3 py-1"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Related Blogs */}
          {relatedBlogs.length > 0 && (
            <section>
              <h2 className="text-h2 text-text-primary mb-8 font-bold">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {relatedBlogs.map((relatedBlog) => (
                  <BlogCard
                    key={relatedBlog._id}
                    blog={relatedBlog}
                    variant="medium"
                  />
                ))}
              </div>
            </section>
          )}
        </article>

        {/* Back to Blogs */}
        <div className="mt-16 text-center">
          <Link
            to="/blogs"
            className="bg-primary text-h4 hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium text-white transition-colors"
          >
            ← Back to All Blogs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
