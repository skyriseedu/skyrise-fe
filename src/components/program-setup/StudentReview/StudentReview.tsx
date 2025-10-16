import React from 'react';
import Remove from '@/assets/bin.svg?react';
import ImportImage from '@/assets/import.svg?react';

export type StudentReviewData = {
  studentName: string;
  major: string;
  review: string;
  image?: File | string;
};

interface StudentReviewProps {
  reviews: StudentReviewData[];
  onReviewChange: (
    index: number,
    field: keyof StudentReviewData,
    value: string
  ) => void;
  onReviewImageChange: (index: number, file: File) => void;
  onAddReview: () => void;
  onRemoveReview: (index: number) => void;
  className?: string;
  label?: string;
}

const StudentReview: React.FC<StudentReviewProps> = ({
  reviews,
  onReviewChange,
  onReviewImageChange,
  onAddReview,
  onRemoveReview,
  className = '',
  label = 'Student Review',
}) => {
  return (
    <div className={className}>
      <label className="mb-4 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="overflow-hidden rounded-lg border border-gray-500">
        <table className="w-full">
          <thead>
            <tr>
              <th className="w-2/12 border-r border-gray-500 px-4 py-3 text-left text-sm font-medium text-gray-700">
                Student Name
              </th>
              <th className="w-2/12 border-r border-gray-500 px-4 py-3 text-left text-sm font-medium text-gray-700">
                Major
              </th>
              <th className="w-5/12 border-r border-gray-500 px-4 py-3 text-left text-sm font-medium text-gray-700">
                Reviews
              </th>
              <th className="w-2/12 border-r border-gray-500 px-4 py-3 text-left text-sm font-medium text-gray-700">
                Images
              </th>
              <th className="w-1/12 px-4 py-3 text-left text-sm font-medium text-gray-700"></th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review, index) => (
              <tr key={index} className="border-t border-gray-500">
                <td className="border-r border-gray-500 align-top">
                  <input
                    type="text"
                    value={review.studentName}
                    onChange={(e) =>
                      onReviewChange(index, 'studentName', e.target.value)
                    }
                    className="w-full border-0 bg-transparent px-2 pt-3 text-sm focus:ring-0 focus:outline-none"
                    placeholder="Student Name"
                  />
                </td>
                <td className="border-r border-gray-500 align-top">
                  <input
                    type="text"
                    value={review.major}
                    onChange={(e) =>
                      onReviewChange(index, 'major', e.target.value)
                    }
                    className="w-full border-0 bg-transparent px-2 pt-3 text-sm focus:ring-0 focus:outline-none"
                    placeholder="Major"
                  />
                </td>
                <td className="border-r border-gray-500 align-top">
                  <div>
                    <textarea
                      value={review.review}
                      onChange={(e) =>
                        onReviewChange(index, 'review', e.target.value)
                      }
                      className="w-full resize-none border-0 bg-transparent px-2 pt-3 text-sm focus:ring-0 focus:outline-none"
                      rows={3}
                      placeholder="Review text..."
                    />
                  </div>
                </td>
                <td className="border-r border-gray-500 align-top">
                  <div className="flex items-center gap-2 px-2">
                    <input
                      type="file"
                      id={`file-upload-${index}`}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onReviewImageChange(index, file);
                        }
                      }}
                    />
                    <label
                      htmlFor={`file-upload-${index}`}
                      className="flex cursor-pointer items-center gap-1 px-2 pt-3 text-xs text-gray-600 hover:text-red-400"
                    >
                      <ImportImage className="h-4 w-4" />
                      Import png
                    </label>
                    {review.image && (
                      <div className="flex items-center gap-2">
                        <span>
                          {typeof review.image === 'string'
                            ? review.image
                            : review.image.name}
                        </span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 align-top">
                  <button
                    type="button"
                    className="text-text-primary pt-3 text-sm hover:text-red-700"
                    onClick={() => onRemoveReview(index)}
                  >
                    <Remove className="h-4 w-4" />
                  </button>
                </td>
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
