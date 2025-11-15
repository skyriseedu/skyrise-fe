import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DropdownInput from '@/components/common/DropdownInput';
import { TextEditor } from '@/components/common/TextEditor/TextEditor';
import ImageUpload from '@/components/program-setup/ImageUpload';
import CaretDown from '@/assets/caret-down.svg?react';
import CaretUp from '@/assets/caret-up.svg?react';
import RemoveIcon from '@/assets/bin.svg?react';
import {
  useCreateUniversity,
  useUniversityBySlug,
  useUpdateUniversity,
} from '@/queries/universities';
import { useUploadUniversityImages } from '@/queries/uploads';
import type {
  CreateUniversityPayload,
  University,
} from '@/types/users/university';
import {
  StudentReview,
  type StudentReviewData,
} from '@/components/program-setup/StudentReview';

type UniversityFormData = {
  universityName: string;
  universityType: 'Public' | 'Private';
  aboutUniversity: string;
  englishFoundation: string;
  bachelor: string;
  master: string;
  keyInformation: {
    ranking: string;
    foundedYear: number;
    location: string;
    creditTransfer: string;
    programs: number;
  };
  studentReviews: Array<StudentReviewData>;
  numberOfCampus: number;
  intakes: Array<{ month: string }>;
  entryRequirement?: string;
  scholarshipRequirements?: string;
  logoImage?: File | string;
  coverImages: {
    image1?: File | string;
    image2?: File | string;
  };
};

const initialFormData: UniversityFormData = {
  universityName: '',
  universityType: 'Public',
  aboutUniversity: '',
  englishFoundation: '',
  bachelor: '',
  master: '',
  keyInformation: {
    ranking: '',
    foundedYear: 0,
    location: '',
    creditTransfer: 'Not Available',
    programs: 0,
  },
  studentReviews: [],
  numberOfCampus: 0,
  intakes: [{ month: '' }],
  entryRequirement: '',
  scholarshipRequirements: '',
  logoImage: undefined,
  coverImages: {
    image1: undefined,
    image2: undefined,
  },
};

const UniversityForm: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const isEditing = Boolean(slug);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const [formData, setFormData] = useState<UniversityFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [showRankingDropdown, setShowRankingDropdown] = useState(false);
  const rankingDropdownRef = useRef<HTMLDivElement>(null);

  const createUniversityMutation = useCreateUniversity();
  const updateUniversityMutation = useUpdateUniversity();
  const uploadUniversityImagesMutation = useUploadUniversityImages();

  const { data: universityData, isLoading: isUniversityLoading } =
    useUniversityBySlug(slug || '');

  useEffect(() => {
    if (isEditing && universityData) {
      const university = universityData.data.university as University;

      setFormData({
        universityName: university.universityName || '',
        universityType: university.universityType || 'Public',
        aboutUniversity: university.aboutUniversity || '',
        englishFoundation: university.englishFoundation || '',
        bachelor: university.bachelor || '',
        master: university.master || '',
        keyInformation: {
          ranking: university.keyInformation?.ranking || '',
          foundedYear: university.keyInformation?.foundedYear || 0,
          location: university.keyInformation?.location || '',
          creditTransfer:
            university.keyInformation?.creditTransfer || 'Not Available',
          programs: university.keyInformation?.programs || 0,
        },
        studentReviews: (university.studentReviews || []).map((review) => ({
          studentName: review.studentName || '',
          major: review.major || '',
          review: review.review || '',
          image: review.studentImage || undefined,
        })),
        numberOfCampus: university.numberOfCampus || 0,
        intakes:
          university.intakes?.map((intake) => {
            return { month: intake };
          }) || [],
        entryRequirement: university.entryRequirement || '',
        scholarshipRequirements: university.scholarshipRequirements || '',
        logoImage: university.logoImage || undefined,
        coverImages: {
          image1: university.coverImages?.image1 || undefined,
          image2: university.coverImages?.image2 || undefined,
        },
      });
    }
  }, [isEditing, universityData, slug]);

  // Handle click outside of dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        rankingDropdownRef.current &&
        !rankingDropdownRef.current.contains(target) &&
        showRankingDropdown
      ) {
        setShowRankingDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [showRankingDropdown]);

  const handleInputChange = (
    field: keyof UniversityFormData,
    value: string | number | File
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleKeyInfoChange = (
    field: keyof UniversityFormData['keyInformation'],
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      keyInformation: {
        ...prev.keyInformation,
        [field]: value,
      },
    }));
  };

  const handleAddIntake = () => {
    setFormData((prev) => ({
      ...prev,
      intakes: [...prev.intakes, { month: '' }],
    }));
  };

  const handleIntakeChange = (index: number, field: 'month', value: string) => {
    setFormData((prev) => ({
      ...prev,
      intakes: prev.intakes.map((intake, i) =>
        i === index ? { ...intake, [field]: value } : intake
      ),
    }));
  };

  const handleRemoveIntake = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      intakes: prev.intakes.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (
    type: 'logoImage' | 'image1' | 'image2',
    file: File
  ) => {
    if (type === 'logoImage') {
      setFormData((prev) => ({ ...prev, logoImage: file }));
    } else {
      setFormData((prev) => ({
        ...prev,
        coverImages: {
          ...prev.coverImages,
          [type]: file,
        },
      }));
    }
  };

  const handleImageRemove = (type: 'logoImage' | 'image1' | 'image2') => {
    if (type === 'logoImage') {
      setFormData((prev) => ({ ...prev, logoImage: undefined }));
    } else {
      setFormData((prev) => ({
        ...prev,
        coverImages: {
          ...prev.coverImages,
          [type]: undefined,
        },
      }));
    }
  };

  const handleAddStudentReview = () => {
    setFormData((prev) => ({
      ...prev,
      studentReviews: [
        ...prev.studentReviews,
        { studentName: '', major: '', review: '', image: undefined },
      ],
    }));
  };

  const handleStudentReviewChange = (
    index: number,
    field: keyof StudentReviewData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      studentReviews: prev.studentReviews.map((review, i) =>
        i === index ? { ...review, [field]: value } : review
      ),
    }));
  };

  const handleReviewImageChange = async (index: number, file: File) => {
    const formData = new FormData();
    formData.append('studentImage', file);

    try {
      const response =
        await uploadUniversityImagesMutation.mutateAsync(formData);
      if (response.data?.studentImage) {
        const imageUrl = response.data.studentImage.url;
        setFormData((prev) => ({
          ...prev,
          studentReviews: prev.studentReviews.map((review, i) =>
            i === index ? { ...review, image: imageUrl } : review
          ),
        }));
      }
    } catch (error) {
      console.error('Error uploading student review image:', error);
    }
  };

  const handleRemoveStudentReview = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      studentReviews: prev.studentReviews.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      let logoUrl: string | undefined;
      let coverImage1Url: string | undefined;
      let coverImage2Url: string | undefined;

      const imageFormData = new FormData();
      let imageUploadCount: number = 0;

      if (formData.logoImage instanceof File) {
        imageFormData.append('logo', formData.logoImage);
        imageUploadCount++;
      }
      if (formData.coverImages.image1 instanceof File) {
        imageFormData.append('coverImage1', formData.coverImages.image1);
        imageUploadCount++;
      }
      if (formData.coverImages.image2 instanceof File) {
        imageFormData.append('coverImage2', formData.coverImages.image2);
        imageUploadCount++;
      }

      if (imageUploadCount > 0) {
        const response =
          await uploadUniversityImagesMutation.mutateAsync(imageFormData);
        if (response.data) {
          if (response.data.logo) {
            logoUrl = response.data.logo.url;
          }
          if (response.data.coverImage1) {
            coverImage1Url = response.data.coverImage1.url;
          }
          if (response.data.coverImage2) {
            coverImage2Url = response.data.coverImage2.url;
          }
        }
      }

      const logoImage =
        logoUrl ||
        (typeof formData.logoImage === 'string'
          ? formData.logoImage
          : undefined);
      const coverImage1 =
        coverImage1Url ||
        (typeof formData.coverImages.image1 === 'string'
          ? formData.coverImages.image1
          : undefined);
      const coverImage2 =
        coverImage2Url ||
        (typeof formData.coverImages.image2 === 'string'
          ? formData.coverImages.image2
          : undefined);

      const payload: CreateUniversityPayload = {
        universityName: formData.universityName,
        universityType: formData.universityType,
        aboutUniversity: formData.aboutUniversity,
        englishFoundation: formData.englishFoundation,
        bachelor: formData.bachelor,
        master: formData.master,
        keyInformation: {
          ranking: formData.keyInformation.ranking,
          foundedYear: Number(formData.keyInformation.foundedYear),
          location: formData.keyInformation.location,
          creditTransfer: formData.keyInformation.creditTransfer,
          programs: Number(formData.keyInformation.programs),
        },
        numberOfCampus: Number(formData.numberOfCampus),
        intakes: formData.intakes.map((intake) => `${intake.month}`),
        entryRequirement: formData.entryRequirement,
        scholarshipRequirements: formData.scholarshipRequirements,
        logoImage: logoImage || '',
        coverImages: {
          image1: coverImage1 || '',
          image2: coverImage2 || '',
        },
        studentReviews: formData.studentReviews.map((review) => ({
          studentName: review.studentName,
          major: review.major,
          studentImage: typeof review.image === 'string' ? review.image : '',
          review: review.review,
        })),
        status: 'published',
      };

      if (isEditing) {
        await updateUniversityMutation.mutateAsync({
          id: (universityData!.data?.university as University)._id,
          payload,
        });
      } else {
        await createUniversityMutation.mutateAsync(payload);
      }

      navigate('/admin/university-setup');
    } catch (error) {
      console.error('Error submitting university:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/university-setup');
  };

  if (isUniversityLoading) return <div>Loading university data...</div>;

  return (
    <div className="min-h-screen px-6">
      <div className="">
        {/* Form */}
        <div className="bg-white p-8">
          <h1 className="text-h2 mb-4 font-semibold">
            {isEditing ? 'Edit University' : 'New University'}
          </h1>

          <div className="space-y-8">
            {/* Basic Information */}
            <div>
              <label className="text-h3 mb-2 block font-semibold">
                University Name
              </label>
              <input
                type="text"
                placeholder="University Name"
                value={formData.universityName}
                onChange={(e) =>
                  handleInputChange('universityName', e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              />
            </div>

            <div>
              <label className="text-h3 mb-2 block font-semibold">
                No. of Campus
              </label>
              <input
                type="number"
                placeholder="No. of Campus"
                value={formData.numberOfCampus || ''}
                onChange={(e) =>
                  handleInputChange('numberOfCampus', e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              />
            </div>

            <div>
              <h2 className="text-h3 mb-3 font-semibold">Logo</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ImageUpload
                  image={formData.logoImage}
                  onImageUpload={(file) => handleImageUpload('logoImage', file)}
                  onRemove={() => handleImageRemove('logoImage')}
                />
              </div>
            </div>

            {/* Cover Images */}
            <div>
              <h2 className="text-h3 mb-3 font-semibold">Cover Images</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ImageUpload
                  image={formData.coverImages.image1}
                  onImageUpload={(file) => handleImageUpload('image1', file)}
                  onRemove={() => handleImageRemove('image1')}
                />
                <ImageUpload
                  image={formData.coverImages.image2}
                  onImageUpload={(file) => handleImageUpload('image2', file)}
                  onRemove={() => handleImageRemove('image2')}
                />
              </div>
            </div>

            {/* About University */}
            <div>
              <label className="text-h3 mb-2 block font-semibold text-gray-700">
                About University
              </label>
              <div className="w-full rounded-lg">
                <TextEditor
                  value={formData.aboutUniversity}
                  onChange={(value) =>
                    handleInputChange('aboutUniversity', value)
                  }
                  placeholder="Description about university"
                  className=""
                />
              </div>
            </div>

            {/* Key Information */}
            <div>
              <label className="text-h3 mb-4 block font-semibold text-gray-700">
                Key Information
              </label>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                <div>
                  <label className="text-h5 mb-1 flex justify-between text-gray-500">
                    <span>Thailand University Ranking</span>
                  </label>
                  <div
                    className="relative flex overflow-visible rounded-lg border border-gray-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="relative" ref={rankingDropdownRef}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowRankingDropdown(!showRankingDropdown);
                        }}
                        className={`flex items-center justify-between border-0 border-r border-gray-300 px-3 py-2 focus:outline-none`}
                      >
                        <span>{formData.universityType}</span>
                        {showRankingDropdown ? (
                          <CaretUp className="ml-2 h-4 w-4 text-gray-500" />
                        ) : (
                          <CaretDown className="ml-2 h-4 w-4 text-gray-500" />
                        )}
                      </button>
                      {showRankingDropdown && (
                        <div className="absolute top-full left-0 z-[100] mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                          <button
                            type="button"
                            className={`w-full px-3 py-2 text-left first:rounded-t-lg hover:bg-gray-100 ${
                              formData.universityType === 'Public'
                                ? 'bg-gray-100 font-medium'
                                : ''
                            }`}
                            onClick={() => {
                              handleInputChange('universityType', 'Public');
                              setShowRankingDropdown(false);
                            }}
                          >
                            Public
                          </button>
                          <button
                            type="button"
                            className={`w-full px-3 py-2 text-left last:rounded-b-lg hover:bg-gray-100 ${
                              formData.universityType === 'Private'
                                ? 'bg-gray-100 font-medium'
                                : ''
                            }`}
                            onClick={() => {
                              handleInputChange('universityType', 'Private');
                              setShowRankingDropdown(false);
                            }}
                          >
                            Private
                          </button>
                        </div>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="0"
                      value={formData.keyInformation.ranking}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        handleKeyInfoChange('ranking', e.target.value);
                      }}
                      className="w-20 border-0 px-4 py-2 focus:ring-0 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-h5 mb-1 block text-gray-500">
                    Founded Year
                  </label>
                  <input
                    type="number"
                    placeholder="yyyy"
                    value={formData.keyInformation.foundedYear || ''}
                    onChange={(e) =>
                      handleKeyInfoChange('foundedYear', e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-h5 mb-1 block text-gray-500">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Location"
                    value={formData.keyInformation.location}
                    onChange={(e) =>
                      handleKeyInfoChange('location', e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-h5 mb-1 block text-gray-500">
                    Credit Transfer
                  </label>
                  <DropdownInput
                    options={[
                      { value: 'Available', label: 'Available' },
                      { value: 'Not Available', label: 'Not Available' },
                    ]}
                    value={formData.keyInformation.creditTransfer}
                    onChange={(value) =>
                      handleKeyInfoChange('creditTransfer', value)
                    }
                    placeholder="Select Credit Transfer"
                  />
                </div>
                <div>
                  <label className="text-h5 mb-1 block text-gray-500">
                    Programs
                  </label>
                  <input
                    type="number"
                    placeholder="Programs"
                    value={formData.keyInformation.programs || ''}
                    onChange={(e) =>
                      handleKeyInfoChange('programs', e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>
            </div>

            {/* Upcoming Intakes */}
            <div>
              <label className="text-h3 mb-4 block font-semibold text-gray-700">
                Intakes
              </label>
              <div className="space-y-2">
                {formData.intakes?.map((intake, index) => {
                  const selectedMonths = formData.intakes.map((i) => i.month);
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <label className="flex items-center text-xs text-gray-500">
                        Month
                      </label>
                      <DropdownInput
                        options={months.map((month) => ({
                          value: month,
                          label: month,
                          disabled:
                            selectedMonths.includes(month) &&
                            intake.month !== month,
                        }))}
                        value={intake.month}
                        onChange={(value) =>
                          handleIntakeChange(index, 'month', value)
                        }
                        placeholder="Select Month"
                        className="w-34"
                      />
                      {formData.intakes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveIntake(index)}
                        >
                          <RemoveIcon className="text-text-primary h-5 w-5 hover:text-red-500" />
                        </button>
                      )}
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={handleAddIntake}
                  className="bg-secondary text-text-primary hover:text-text-primary-700 flex items-center gap-2 rounded-xl px-3 py-1 text-sm hover:bg-red-200"
                >
                  <span className="text-lg">+</span> Intake
                </button>
              </div>
            </div>

            {/* English Foundation */}
            <div>
              <label className="text-h3 mb-2 block font-semibold text-gray-700">
                English Foundation
              </label>
              <div className="">
                <TextEditor
                  value={formData.englishFoundation}
                  onChange={(value) =>
                    handleInputChange('englishFoundation', value)
                  }
                  placeholder="English foundation details..."
                />
              </div>
            </div>

            {/* Bachelor */}
            <div>
              <label className="text-h3 mb-2 block font-semibold text-gray-700">
                Bachelor
              </label>
              <div className="">
                <TextEditor
                  value={formData.bachelor}
                  onChange={(value) => handleInputChange('bachelor', value)}
                  placeholder="Bachelor details..."
                />
              </div>
            </div>

            {/* Master */}
            <div>
              <label className="text-h3 mb-2 block font-semibold text-gray-700">
                Master
              </label>
              <div className="">
                <TextEditor
                  value={formData.master}
                  onChange={(value) => handleInputChange('master', value)}
                  placeholder="Master details..."
                />
              </div>
            </div>

            {/* Entry Requirement */}
            <div>
              <label className="text-h3 mb-2 block font-semibold text-gray-700">
                Entry Requirement
              </label>
              <div className="">
                <TextEditor
                  value={formData.entryRequirement || ''}
                  onChange={(value) =>
                    handleInputChange('entryRequirement', value)
                  }
                  placeholder="Entry requirements..."
                />
              </div>
            </div>

            {/* Scholarship Requirements */}
            <div>
              <label className="text-h3 mb-2 block font-semibold text-gray-700">
                Scholarship Requirements (if any)
              </label>
              <div className="">
                <TextEditor
                  value={formData.scholarshipRequirements || ''}
                  onChange={(value) =>
                    handleInputChange('scholarshipRequirements', value)
                  }
                  placeholder="Scholarship requirements..."
                />
              </div>
            </div>

            {/* Student Review */}
            <StudentReview
              reviews={formData.studentReviews}
              onReviewChange={handleStudentReviewChange}
              onReviewImageChange={handleReviewImageChange}
              onAddReview={handleAddStudentReview}
              onRemoveReview={handleRemoveStudentReview}
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-between gap-4">
            <button
              onClick={handleCancel}
              className="bg-secondary text-text-primary rounded-lg px-6 py-2 hover:bg-red-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                isLoading ||
                createUniversityMutation.isPending ||
                uploadUniversityImagesMutation.isPending ||
                updateUniversityMutation.isPending
              }
              className="bg-primary rounded-lg px-6 py-2 text-white hover:bg-red-600 disabled:opacity-50"
            >
              {isLoading ||
              createUniversityMutation.isPending ||
              uploadUniversityImagesMutation.isPending ||
              updateUniversityMutation.isPending
                ? 'Processing...'
                : isEditing
                  ? 'Save'
                  : 'Publish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UniversityForm;
