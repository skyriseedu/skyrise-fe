import React from 'react';
import { Link } from 'react-router-dom';
import type { Blog } from '../../types/users/blog';

interface BlogCardProps {
  blog: Blog;
  variant?: 'medium' | 'small' | 'mini';
  className?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  blog,
  variant = 'medium',
  className = '',
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'medium':
        return {
          container: 'max-w-full',
          imageHeight: 'h-26 lg:h-50',
          padding: 'p-6',
          titleSize: 'text-h4 lg:text-h2',
          textSize: 'text-body-6 lg:text-body-2',
          metaSize: 'text-body-6',
          layout: 'vertical',
        };
      case 'small':
        return {
          container: 'w-50 lg:w-62 lg:h-80 h-70',
          imageHeight: 'aspect-video',
          padding: 'px-4 py-2',
          titleSize: 'text-h4 lg:text-h3',
          textSize: 'text-body-6 lg:text-body-4',
          metaSize: 'text-body-6',
          layout: 'vertical',
        };
      case 'mini':
        return {
          container: 'w-full h-21 lg:h-25',
          imageHeight: 'w-20 h-20 lg:h-24',
          padding: 'p-4',
          titleSize: 'text-h4 lg:text-h3',
          textSize: 'text-body-6',
          metaSize: 'text-body-6',
          layout: 'horizontal',
        };
      default:
        return {
          container: 'max-w-4xl',
          imageHeight: 'h-26',
          padding: 'p-6',
          titleSize: 'text-h4 lg:text-h3',
          textSize: 'text-body-6',
          metaSize: 'text-body-6',
          layout: 'vertical',
        };
    }
  };

  const variantClasses = getVariantClasses();

  // Function to truncate text to prevent overflow
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  if (variant === 'mini') {
    return (
      <Link
        to={`/blogs/${blog.slug}`}
        className={`group flex items-center gap-4 overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-md ${variantClasses.container} ${className}`}
      >
        <div
          className={`${variantClasses.imageHeight} flex-shrink-0 overflow-hidden rounded-lg py-2 pl-2`}
        >
          <img
            src={
              blog.imageUrl ||
              'https://placehold.co/400x300?text=Image+Not+Available'
            }
            alt={blog.title}
            className="h-full w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="flex-1 py-1 pr-2">
          <h3
            className={`text-text-primary group-hover:text-primary mb-2 line-clamp-2 font-semibold transition-colors ${variantClasses.titleSize}`}
          >
            {blog.title}
          </h3>

          <div className={`text-text-secondary ${variantClasses.metaSize}`}>
            <span>
              Posted on{' '}
              {new Date(blog.postedDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/blogs/${blog.slug}`}
      className={`group block overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-md ${variantClasses.container} ${className}`}
    >
      <div
        className={`${variantClasses.imageHeight} overflow-hidden ${variant === 'medium' || variant === 'small' ? 'px-2 pt-3 lg:px-3' : ''}`}
      >
        <img
          src={
            blog.imageUrl ||
            'https://placehold.co/600x400?text=Image+Not+Available'
          }
          alt={blog.title}
          className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${variant === 'medium' || variant === 'small' ? 'rounded-lg' : ''}`}
        />
      </div>

      <div className={variantClasses.padding}>
        <h3
          className={`text-text-primary group-hover:text-primary mb-2 line-clamp-2 font-semibold transition-colors ${variantClasses.titleSize}`}
        >
          {blog.title}
        </h3>

        <div
          className={`text-text-secondary mb-4 flex items-center justify-start ${variantClasses.metaSize}`}
        >
          <span>
            Posted on{' '}
            {new Date(blog.postedDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>

        <p
          className={`text-text-primary line-clamp-3 ${variantClasses.textSize}`}
        >
          {`${variant == 'medium' ? truncateText(blog.description || blog.blogText || '', 300) : truncateText(blog.description || blog.blogText || '', 55)}`}
        </p>
      </div>
    </Link>
  );
};

export default BlogCard;
