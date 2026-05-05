import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import BlogCard from '@/components/blog/BlogCard';
import Loading from '@/components/common/Loading';
import { ImageSkeleton } from '@/components/ui';
import ArrowLeft from '@/assets/arrow-left.svg?react';
import { useBlogBySlug, useCategoryBlogs } from '@/queries/blogs';
import '@/components/common/TextEditor/QuillContent.css';

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [imageLoading, setImageLoading] = useState(true);

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

  // to start from top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [slug]);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
  };

  // Handle error or blog not found (but not loading state)
  if (blogError || (!blogLoading && !blog)) {
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

      <div className="relative overflow-hidden">
        {(imageLoading || !blog) && (
          <ImageSkeleton className="absolute inset-0 h-full w-full lg:h-120" />
        )}
        {blog && (
          <img
            src={
              blog.imageUrl ||
              'https://placehold.co/800x600?text=Image+Not+Available'
            }
            alt={blog.title}
            className={`h-55 w-full object-cover lg:h-[450px] ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
      </div>

      <div className="px-5 lg:px-15">
        {/* Show content when blog is loaded */}
        {blog && (
          <>
            <div className="mx-auto max-w-3xl">
              <header className="mt-8 mb-12 lg:mb-16">
                <h1 className="lg:text-h1 text-h2 text-text-primary mb-6 leading-tight font-bold">
                  {blog.title}
                </h1>

                <div className="text-body-2 lg:text-body-1 text-text-secondary flex items-center">
                  <span>Posted on </span>
                  <time dateTime={blog.postedDate} className="ml-1">
                    {new Date(blog.postedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>

                {blog.youtubeUrl && (
                  <div className="mt-4">
                    <a
                      href={blog.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-body-2 lg:text-body-1 text-primary hover:text-primary/80 underline transition-colors"
                    >
                      Watch on YouTube
                    </a>
                  </div>
                )}
              </header>

              <div className="prose prose-lg mb-12 max-w-none">
                <div className="quill-content text-body-2 lg:text-body-1 text-text-primary leading-relaxed lg:leading-loose">
                  {blog.blogText ? (
                    <div dangerouslySetInnerHTML={{ __html: blog.blogText }} />
                  ) : (
                    <p>No content available</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Show loading component when blog content is loading */}
        {!blog && (
          <div className="flex justify-center py-16">
            <Loading size="lg" color="primary" />
          </div>
        )}

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
