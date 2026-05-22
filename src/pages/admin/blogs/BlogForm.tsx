import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DropdownInput from '@/components/common/DropdownInput';
import { TextEditor } from '@/components/common/TextEditor/TextEditor';
import ImageUpload from '@/components/program-setup/ImageUpload';
import {
  useBlogBySlugAdmin,
  useCreateBlog,
  useUpdateBlog,
} from '@/queries/blogs';
import { useUploadProgramImages } from '@/queries/uploads';
import type { Blog, CreateBlogPayload } from '@/types/users/blog';

type BlogFormData = {
  title: string;
  category: Blog['category'];
  coverImage?: string | File;
  youtubeUrl: string;
  description: string;
  blogText: string;
  status: Blog['status'];
};

const initialFormData: BlogFormData = {
  title: '',
  category: 'program',
  coverImage: undefined,
  youtubeUrl: '',
  description: '',
  blogText: '',
  status: 'draft',
};

const categoryOptions = [
  { label: 'Program', value: 'program' },
  { label: 'University', value: 'university' },
  { label: 'Visa', value: 'visa' },
  { label: 'Student Reviews', value: 'student reviews' },
];

const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
];

const BlogForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams<{ slug: string }>();

  const isViewMode = location.pathname.includes('/view/');
  const isEditing = Boolean(slug) && !isViewMode;

  const [formData, setFormData] = useState<BlogFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const firstErrorRef = useRef<HTMLDivElement>(null);

  const {
    data: blogData,
    isLoading: isBlogLoading,
    isError: isBlogError,
  } = useBlogBySlugAdmin(slug || '');
  const createBlogMutation = useCreateBlog();
  const updateBlogMutation = useUpdateBlog();
  const uploadImagesMutation = useUploadProgramImages();

  useEffect(() => {
    if (!slug || !blogData?.data?.blog) {
      return;
    }

    const blog = blogData.data.blog;

    setFormData({
      title: blog.title || '',
      category: blog.category || 'program',
      coverImage: blog.imageUrl || undefined,
      youtubeUrl: blog.youtubeUrl || '',
      description: blog.description || '',
      blogText: blog.blogText || '',
      status: blog.status || 'draft',
    });
  }, [blogData, slug]);

  const pageTitle = useMemo(() => {
    if (isViewMode) return 'View Blog';
    if (isEditing) return 'Edit Blog';
    return 'New Blog';
  }, [isEditing, isViewMode]);

  const handleInputChange = (
    field: keyof BlogFormData,
    value: string | File | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (apiError) {
      setApiError(null);
    }

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      nextErrors.title = 'Blog title is required';
    }

    if (!formData.category) {
      nextErrors.category = 'Blog category is required';
    }

    if (!formData.blogText.trim()) {
      nextErrors.blogText = 'Blog text is required';
    }

    if (apiError) {
      setApiError(null);
    }
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setTimeout(() => {
        if (firstErrorRef.current) {
          firstErrorRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 100);
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (isViewMode) {
      return;
    }

    const isDraft = formData.status === 'draft';

    if (!isDraft && !validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      setApiError(null);
      if (isDraft) {
        setErrors({});
      }
      let coverImageUrl: string | undefined;

      if (formData.coverImage instanceof File) {
        const payload = new FormData();
        payload.append('images', formData.coverImage);
        const uploadResponse = await uploadImagesMutation.mutateAsync(payload);

        if (uploadResponse.data?.images?.[0]?.url) {
          coverImageUrl = uploadResponse.data.images[0].url;
        }
      } else if (typeof formData.coverImage === 'string') {
        coverImageUrl = formData.coverImage;
      }

      const payload: CreateBlogPayload = {
        title: formData.title.trim(),
        category: formData.category,
        imageUrl: coverImageUrl,
        youtubeUrl: formData.youtubeUrl.trim() || undefined,
        description: formData.description.trim() || undefined,
        blogText: formData.blogText,
        status: formData.status,
      };

      if (isEditing && blogData?.data?.blog?._id) {
        await updateBlogMutation.mutateAsync({
          id: blogData.data.blog._id,
          payload,
        });
      } else {
        await createBlogMutation.mutateAsync(payload);
      }

      navigate('/admin/blog-setup');
    } catch (error) {
      const maybeError = error as Error & {
        responseData?: {
          message?: string;
          errors?: Array<{ field?: string; message?: string }>;
        };
      };

      const responseData = maybeError.responseData;
      const message =
        responseData?.message ||
        (maybeError.message ? maybeError.message : 'Failed to save blog.');

      const nextErrors: Record<string, string> = {};
      responseData?.errors?.forEach((entry) => {
        if (entry.field && entry.message) {
          nextErrors[entry.field] = entry.message;
        }
      });

      if (Object.keys(nextErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...nextErrors }));
      }

      setApiError(message);
      console.error('Failed to save blog:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (slug && isBlogLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (slug && isBlogError) {
    return <div className="p-6">Error loading blog.</div>;
  }

  return (
    <div className="min-h-screen px-6">
      <div className="">
        <div className="bg-white p-8">
          <h1 className="text-h2 mb-4 font-semibold">{pageTitle}</h1>

          <div className="space-y-6">
            {(apiError || Object.keys(errors).length > 0) && (
              <div
                ref={firstErrorRef}
                className="rounded-lg border border-red-300 bg-red-50 p-4"
              >
                <h3 className="text-h4 mb-2 font-semibold text-red-800">
                  Please fix the following errors:
                </h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-red-700">
                  {apiError && <li>{apiError}</li>}
                  {Object.entries(errors).map(([key, message]) => (
                    <li key={key}>{message}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Blog Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  disabled={isViewMode}
                  placeholder="Enter blog title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Blog Category
                </label>
                {isViewMode ? (
                  <div className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700">
                    {categoryOptions.find(
                      (option) => option.value === formData.category
                    )?.label || formData.category}
                  </div>
                ) : (
                  <DropdownInput
                    options={categoryOptions}
                    value={formData.category}
                    onChange={(value) =>
                      handleInputChange('category', value as Blog['category'])
                    }
                    placeholder="Select category"
                  />
                )}
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Status
              </label>
              {isViewMode ? (
                <div className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700">
                  {statusOptions.find(
                    (option) => option.value === formData.status
                  )?.label || formData.status}
                </div>
              ) : (
                <DropdownInput
                  options={statusOptions}
                  value={formData.status}
                  onChange={(value) =>
                    handleInputChange('status', value as Blog['status'])
                  }
                  placeholder="Select status"
                />
              )}
            </div>

            <div className="w-full lg:w-1/2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Cover Image
              </label>
              {isViewMode ? (
                formData.coverImage ? (
                  <img
                    src={
                      typeof formData.coverImage === 'string'
                        ? formData.coverImage
                        : URL.createObjectURL(formData.coverImage)
                    }
                    alt="Blog cover"
                    className="h-64 w-full rounded-xl border border-gray-200 object-cover"
                  />
                ) : (
                  <div className="rounded-lg border border-gray-200 p-6 text-sm text-gray-500">
                    No cover image
                  </div>
                )
              ) : (
                <ImageUpload
                  image={formData.coverImage}
                  onImageUpload={(file) =>
                    handleInputChange('coverImage', file)
                  }
                  onRemove={() => handleInputChange('coverImage', undefined)}
                />
              )}
              {errors.imageUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
              )}
            </div>

            <div className="w-full lg:w-1/2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Link (if any)
              </label>
              <input
                type="text"
                value={formData.youtubeUrl}
                onChange={(e) =>
                  handleInputChange('youtubeUrl', e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
                disabled={isViewMode}
                placeholder="https://youtube.com/..."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Thumbnail Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                className="min-h-28 w-full rounded-lg border border-gray-300 px-4 py-3"
                disabled={isViewMode}
                placeholder="Short description shown on list cards"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Blog Text
              </label>
              {isViewMode ? (
                <div
                  className="prose max-w-none rounded-lg border border-gray-200 p-4"
                  dangerouslySetInnerHTML={{ __html: formData.blogText }}
                />
              ) : (
                <TextEditor
                  value={formData.blogText}
                  onChange={(value) => handleInputChange('blogText', value)}
                  className="bg-white"
                />
              )}
              {errors.blogText && (
                <p className="mt-1 text-sm text-red-600">{errors.blogText}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/admin/blog-setup')}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                {isViewMode ? 'Back' : 'Cancel'}
              </button>

              {!isViewMode && (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-primary rounded-lg px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
                >
                  {isSaving
                    ? 'Saving...'
                    : isEditing
                      ? 'Update Blog'
                      : 'New Blog'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogForm;
