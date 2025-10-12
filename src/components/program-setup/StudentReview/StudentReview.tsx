import React from 'react';
import Remove from '@/assets/bin.svg?react';

export type StudentReviewData = {
  studentName: string;
  major: string;
  review: string;
  image?: string;
};

interface StudentReviewProps {
  reviews: StudentReviewData[];
  onReviewChange: (
    index: number,
    field: keyof StudentReviewData,
    value: string
  ) => void;
  onAddReview: () => void;
  onRemoveReview?: (index: number) => void;
  className?: string;
  label?: string;
  showRemoveButton?: boolean;
}

const StudentReview: React.FC<StudentReviewProps> = ({
  reviews,
  onReviewChange,
  onAddReview,
  onRemoveReview,
  className = '',
  label = 'Student Review',
  showRemoveButton = false,
}) => {
  const handleImageImport = (index: number) => {
    // Handle image import logic
    // This could open a file picker or trigger an upload modal
    console.log('Import image for review at index:', index);
  };

  const handleImageRemove = (index: number) => {
    onReviewChange(index, 'image', '');
  };

  return (
    <div className={className}>
      <label className="mb-4 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="border-r border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                Student Name
              </th>
              <th className="border-r border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                Major
              </th>
              <th className="border-r border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                Reviews
              </th>
              <th className="border-r border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                Images
              </th>
              {showRemoveButton && (
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {reviews.map((review, index) => (
              <tr key={index} className="border-t border-gray-200">
                <td className="border-r border-gray-200 px-4 py-3">
                  <input
                    type="text"
                    value={review.studentName}
                    onChange={(e) =>
                      onReviewChange(index, 'studentName', e.target.value)
                    }
                    className="w-full border-0 bg-transparent px-0 py-1 text-sm focus:ring-0 focus:outline-none"
                    placeholder="Student Name"
                  />
                </td>
                <td className="border-r border-gray-200 px-4 py-3">
                  <input
                    type="text"
                    value={review.major}
                    onChange={(e) =>
                      onReviewChange(index, 'major', e.target.value)
                    }
                    className="w-full border-0 bg-transparent px-0 py-1 text-sm focus:ring-0 focus:outline-none"
                    placeholder="Major"
                  />
                </td>
                <td className="border-r border-gray-200 px-4 py-3">
                  <textarea
                    value={review.review}
                    onChange={(e) =>
                      onReviewChange(index, 'review', e.target.value)
                    }
                    className="w-full resize-none border-0 bg-transparent px-0 py-1 text-sm focus:ring-0 focus:outline-none"
                    rows={3}
                    placeholder="Review text..."
                  />
                </td>
                <td
                  className={`px-4 py-3 ${showRemoveButton ? 'border-r border-gray-200' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleImageImport(index)}
                      className="flex items-center gap-1 rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
                    >
                      <span>📎</span>
                      Import png
                    </button>
                    {review.image && (
                      <button
                        type="button"
                        className="text-sm text-red-500 hover:text-red-700"
                        onClick={() => handleImageRemove(index)}
                      >
                        <Remove className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
                {showRemoveButton && onRemoveReview && (
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="text-sm text-red-500 hover:text-red-700"
                      onClick={() => onRemoveReview(index)}
                    >
                      <Remove className="h-4 w-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={onAddReview}
        className="bg-secondary text-text-primary hover:text-text-primary-700 mt-4 flex items-center gap-2 rounded-xl px-3 py-1 text-sm hover:bg-red-200"
      >
        <span className="text-lg">+</span> Student
      </button>
    </div>
  );
};

export default StudentReview;
