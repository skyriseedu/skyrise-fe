import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DropdownInput from '@/components/common/DropdownInput';
import { TextEditor } from '@/components/common/TextEditor/TextEditor';
import CustomCalendar from '@/components/common/CustomCalendar';
import {
  StudentReview,
  type StudentReviewData,
} from '@/components/program-setup/StudentReview';
import ImageUpload from '@/components/program-setup/ImageUpload';
import Calendar from '@/assets/calendar.svg?react';
import CaretDown from '@/assets/caret-down.svg?react';
import CaretUp from '@/assets/caret-up.svg?react';
import RemoveIcon from '@/assets/bin.svg?react';
import {
  useCreateProgram,
  useProgramBySlug,
  useUpdateProgram,
} from '@/queries/programs';
import { useUploadProgramImages } from '@/queries/uploads';
import type {
  CreateProgramPayload,
  UpdateProgramParams,
} from '@/types/users/program';
import type { UploadedImage } from '@/types/uploads';

type ProgramFormData = {
  programName: string;
  universityName: string;
  applicationDeadline: string;
  universityRanking: string;
  universityRankingType: string;
  aboutProgram: string;
  degree: string;
  duration: string;
  location: string;
  applicationFee: string;
  totalTuitionFees: string;
  upcomingIntakes: Array<{ year: string; month: string }>;
  totalCreditRequirement: string;
  programStructure: string;
  undergraduateEntryRequirement: string;
  careerPaths: string;
  studentReviews: Array<StudentReviewData>;
  coverImages: {
    primary?: File | string;
    secondary?: File | string;
  };
};

const initialFormData: ProgramFormData = {
  programName: '',
  universityName: '',
  applicationDeadline: '',
  universityRanking: '',
  universityRankingType: 'Public',
  aboutProgram: '',
  degree: 'Bachelor',
  duration: '1 year',
  location: '',
  applicationFee: 'Free',
  totalTuitionFees: '',
  upcomingIntakes: [{ year: '', month: '' }],
  totalCreditRequirement: '',
  programStructure: '',
  undergraduateEntryRequirement: '',
  careerPaths: '',
  studentReviews: [],
  coverImages: {},
};

const ProgramForm: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const isEditing = Boolean(slug);

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const [formData, setFormData] = useState<ProgramFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showRankingDropdown, setShowRankingDropdown] = useState(false);
  const rankingDropdownRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const createProgramMutation = useCreateProgram();
  const updateProgramMutation = useUpdateProgram();
  const uploadProgramImagesMutation = useUploadProgramImages();
  console.log('ProgramForm render - slug:', slug, 'isEditing:', isEditing);

  const { data: programData, isLoading: isProgramLoading } = useProgramBySlug(
    slug || ''
  );

  useEffect(() => {
    if (isEditing && programData) {
      const program = programData.data;

      setFormData({
        programName: program.programName,

        universityName: program.universityName,

        applicationDeadline: program.applicationDeadline || '',

        universityRanking: (program.universityRanking && program.universityRanking.number !== undefined && program.universityRanking.number !== null)
          ? program.universityRanking.number.toString()
          : '',

        universityRankingType: program.universityRanking?.type || 'Public',

        aboutProgram: program.about || '',

        degree: program.keyInformation?.degree || '',

        duration: program.keyInformation?.duration || '',

        location: program.keyInformation?.location || '',

        applicationFee: program.keyInformation?.applicationFee || '',

        totalTuitionFees: program.keyInformation?.totalTuitionFees || '',

        upcomingIntakes: (program.keyInformation?.upcomingIntake || []).map(
          (intake) => {
            const parts = intake.split(' ');

            return { month: parts[0], year: parts[1] };
          }
        ),

        totalCreditRequirement: program.totalCredits?.toString() || '',

        programStructure: program.creditDetails || '',

        undergraduateEntryRequirement:
          program.undergraduateEntryRequirement || '',

        careerPaths: program.careerPaths || '',

        studentReviews: (program.studentReviews || []).map((review) => ({
          studentName: review.studentName || '',

          major: review.major || '',

          review: review.review || '',

          image: review.studentImage || undefined,
        })),

        coverImages: {
          primary: program.images?.image1 || undefined,

          secondary: program.images?.image2 || undefined,
        },
      });
    }
  }, [isEditing, programData, slug]);

  // Handle click outside of dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      // Handle ranking dropdown
      if (
        rankingDropdownRef.current &&
        !rankingDropdownRef.current.contains(target) &&
        showRankingDropdown
      ) {
        setShowRankingDropdown(false);
      }

      // Handle calendar dropdown
      if (
        calendarRef.current &&
        !calendarRef.current.contains(target) &&
        showCalendar
      ) {
        setShowCalendar(false);
      }
    }

    // Use capture phase to ensure our handler runs first
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [showRankingDropdown, showCalendar]);

  const handleInputChange = (
    field: keyof ProgramFormData,
    value: string | number | File
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddIntake = () => {
    setFormData((prev) => ({
      ...prev,
      upcomingIntakes: [...prev.upcomingIntakes, { year: '', month: '' }],
    }));
  };

  const handleIntakeChange = (
    index: number,
    field: 'year' | 'month',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      upcomingIntakes: prev.upcomingIntakes.map((intake, i) =>
        i === index ? { ...intake, [field]: value } : intake
      ),
    }));
  };

  const handleRemoveIntake = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      upcomingIntakes: prev.upcomingIntakes.filter((_, i) => i !== index),
    }));
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

  const handleReviewImageChange = (index: number, file: File) => {
    setFormData((prev) => ({
      ...prev,
      studentReviews: prev.studentReviews.map((review, i) =>
        i === index ? { ...review, image: file } : review
      ),
    }));
  };

  const handleRemoveStudentReview = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      studentReviews: prev.studentReviews.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (type: 'primary' | 'secondary', file: File) => {
    setFormData((prev) => ({
      ...prev,
      coverImages: {
        ...prev.coverImages,
        [type]: file,
      },
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      let primaryImage: UploadedImage | undefined;
      let secondaryImage: UploadedImage | undefined;

      if (formData.coverImages.primary instanceof File) {
        const imageFormData = new FormData();
        imageFormData.append('images', formData.coverImages.primary);
        const response =
          await uploadProgramImagesMutation.mutateAsync(imageFormData);
        primaryImage = response.data[0];
      } else if (typeof formData.coverImages.primary === 'string') {
        primaryImage = { id: '', url: formData.coverImages.primary };
      }

      if (formData.coverImages.secondary instanceof File) {
        const imageFormData = new FormData();
        imageFormData.append('images', formData.coverImages.secondary);
        const response =
          await uploadProgramImagesMutation.mutateAsync(imageFormData);
        secondaryImage = response.data[0];
      } else if (typeof formData.coverImages.secondary === 'string') {
        secondaryImage = { id: '', url: formData.coverImages.secondary };
      }

      const payload: CreateProgramPayload = {
        programName: formData.programName,
        universityName: formData.universityName,
        universityRanking: {
          type: formData.universityRankingType.toLowerCase(),
          number: parseInt(formData.universityRanking),
        },
        applicationDeadline: formData.applicationDeadline,
        images: {
          image1: primaryImage?.url || '',
          image2: secondaryImage?.url || '',
        },
        about: formData.aboutProgram,
        keyInformation: {
          degree: formData.degree,
          duration: formData.duration,
          location: formData.location,
          applicationFee: formData.applicationFee,
          totalTuitionFees: formData.totalTuitionFees,
          upcomingIntake: formData.upcomingIntakes.map(
            (intake) => `${intake.month} ${intake.year}`
          ),
        },
        totalCredits: parseInt(formData.totalCreditRequirement),
        creditDetails: formData.programStructure,
        undergraduateEntryRequirement: formData.undergraduateEntryRequirement,
        careerPaths: formData.careerPaths,
        studentReviews: formData.studentReviews.map((review) => ({
          studentName: review.studentName,
          major: review.major,
          studentImage: review.image instanceof File ? '' : review.image || '',
          review: review.review,
        })),
        status: 'published',
      };

      if (isEditing) {
        const updatePayload: UpdateProgramParams = {
          id: programData!.data._id,
          payload: payload,
        };
        await updateProgramMutation.mutateAsync(updatePayload);
      } else {
        await createProgramMutation.mutateAsync(payload);
      }

      navigate('/admin/program-setup');
    } catch (error) {
      console.error('Error submitting program:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/program-setup');
  };

  if (isProgramLoading) return <div>Loading program data...</div>;

  return (
    <div className="min-h-screen px-6">
      <div className="">
        {/* Form */}
        <div className="bg-white p-8">
          <h1 className="text-h2 mb-4 font-semibold">
            {isEditing ? 'Edit Program' : 'New Program'}
          </h1>

          <div className="space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="text-h3 block font-semibold text-gray-700">
                  Program Name
                </label>
                <input
                  type="text"
                  placeholder="Program Name"
                  value={formData.programName}
                  onChange={(e) =>
                    handleInputChange('programName', e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                />
              </div>

              <div>
                <label className="text-h3 mb-2 block font-semibold">
                  Application Deadline
                </label>
                <div
                  className="relative"
                  onClick={(e) => e.stopPropagation()}
                  ref={calendarRef}
                >
                  <input
                    type="text"
                    value={
                      formData.applicationDeadline
                        ? new Date(
                            formData.applicationDeadline
                          ).toLocaleDateString('en-GB')
                        : ''
                    }
                    placeholder="dd/mm/yyyy"
                    onClick={() => {
                      setShowCalendar(!showCalendar);
                    }}
                    className="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-2 pr-10"
                  />
                  <Calendar
                    className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 cursor-pointer text-black"
                    onClick={() => {
                      setShowCalendar(!showCalendar);
                    }}
                  />
                  {showCalendar && (
                    <div className="absolute top-full right-0 left-0 z-50 mt-1">
                      <CustomCalendar
                        selectedDate={
                          formData.applicationDeadline
                            ? new Date(formData.applicationDeadline)
                            : null
                        }
                        onDateSelect={(date) => {
                          // Format date as YYYY-MM-DD without timezone conversion
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(
                            2,
                            '0'
                          );
                          const day = String(date.getDate()).padStart(2, '0');
                          const dateString = `${year}-${month}-${day}`;
                          handleInputChange('applicationDeadline', dateString);
                          setShowCalendar(false);
                        }}
                        className="border-0 shadow-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

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
                <label className="text-h3 mb-2 flex justify-between font-semibold">
                  <span>University Ranking</span>
                </label>
                <div
                  className="relative flex overflow-visible rounded-lg border border-gray-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Custom Dropdown */}
                  <div className="relative" ref={rankingDropdownRef}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // Stop propagation to prevent other handlers
                        setShowCalendar(false);
                        setShowRankingDropdown(!showRankingDropdown);
                      }}
                      className={`flex items-center justify-between border-0 border-r border-gray-300 px-3 py-2 focus:outline-none ${showRankingDropdown ? '' : ''}`}
                    >
                      <span>{formData.universityRankingType}</span>
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
                          className={`w-full px-3 py-2 text-left first:rounded-t-lg hover:bg-gray-100 ${formData.universityRankingType === 'Public' ? 'bg-gray-100 font-medium' : ''}`}
                          onClick={() => {
                            handleInputChange(
                              'universityRankingType',
                              'Public'
                            );
                            setShowRankingDropdown(false);
                          }}
                        >
                          Public
                        </button>
                        <button
                          type="button"
                          className={`w-full px-3 py-2 text-left last:rounded-b-lg hover:bg-gray-100 ${formData.universityRankingType === 'Private' ? 'bg-gray-100 font-medium' : ''}`}
                          onClick={() => {
                            handleInputChange(
                              'universityRankingType',
                              'Private'
                            );
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
                    value={formData.universityRanking}
                    onClick={(e) => e.stopPropagation()} // Prevent clicks on the input from closing the dropdown
                    onChange={(e) => {
                      // Only allow numbers
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      handleInputChange('universityRanking', value);
                    }}
                    className="w-20 border-0 px-4 py-2 focus:ring-0 focus:outline-none"
                    style={{
                      appearance: 'textfield',
                      MozAppearance: 'textfield',
                      WebkitAppearance: 'none',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Cover Images */}
            <div>
              <h2 className="text-h3 mb-3 font-semibold">Cover Images</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-h5 mb-1 block text-gray-500">
                    Primary Image
                  </label>
                  <ImageUpload
                    image={formData.coverImages.primary}
                    onImageUpload={(file) => handleImageUpload('primary', file)}
                  />
                </div>
                <div>
                  <label className="text-h5 mb-1 block text-gray-500">
                    Secondary Image
                  </label>
                  <ImageUpload
                    image={formData.coverImages.secondary}
                    onImageUpload={(file) =>
                      handleImageUpload('secondary', file)
                    }
                  />
                </div>
              </div>
            </div>

            {/* About Program */}
            <div>
              <label className="text-h3 mb-2 block font-semibold text-gray-700">
                About Program
              </label>
              <div className="w-full rounded-lg">
                <TextEditor
                  value={formData.aboutProgram}
                  onChange={(value) => handleInputChange('aboutProgram', value)}
                  placeholder="Description about program"
                  className=""
                />
              </div>
            </div>

            {/* Key Information */}
            <div>
              <label className="text-h3 mb-4 block font-semibold text-gray-700">
                Key Information
              </label>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div>
                  <label className="text-h5 mb-1 block text-gray-500">
                    Degree
                  </label>
                  <DropdownInput
                    options={[
                      { value: 'Bachelor', label: 'Bachelor' },
                      { value: 'Master', label: 'Master' },
                      { value: 'PhD', label: 'Foundation' },
                    ]}
                    value={formData.degree}
                    onChange={(value) => handleInputChange('degree', value)}
                    placeholder="Select Degree"
                  />
                </div>

                <div>
                  <label className="text-h5 mb-1 block text-gray-500">
                    Duration
                  </label>
                  <DropdownInput
                    options={[
                      { value: '1 year', label: '1 year' },
                      { value: '1.5 years', label: '1.5 years' },
                      { value: '2 years', label: '2 years' },
                      { value: '2.5 years', label: '2.5 years' },
                      { value: '3 years', label: '3 years' },
                      { value: '3.5 years', label: '3.5 years' },
                      { value: '4 years', label: '4 years' },
                      { value: '4.5 years', label: '4.5 years' },
                    ]}
                    value={formData.duration}
                    onChange={(value) => handleInputChange('duration', value)}
                    placeholder="Select Duration"
                  />
                </div>

                <div>
                  <label className="text-h5 mb-1 block text-gray-500">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Location"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange('location', e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-h5 mb-1 block text-gray-500">
                    Application fee
                  </label>
                  <DropdownInput
                    options={[
                      { value: 'Free', label: 'Free' },
                      { value: 'Paid', label: 'Charged' },
                    ]}
                    value={formData.applicationFee}
                    onChange={(value) =>
                      handleInputChange('applicationFee', value)
                    }
                    placeholder="Select Application Fee"
                  />
                </div>
              </div>
            </div>

            {/* Upcoming Intakes */}
            <div>
              <label className="text-h3 mb-4 block font-semibold text-gray-700">
                Upcoming Intakes
              </label>
              <div className="space-y-2">
                {formData.upcomingIntakes.map((intake, index) => {
                  const selectedMonths = formData.upcomingIntakes.map(
                    (i) => i.month
                  );
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <label className="flex items-center text-xs text-gray-500">
                        Year
                      </label>
                      <input
                        type="text"
                        placeholder="Year"
                        value={intake.year}
                        onChange={(e) =>
                          handleIntakeChange(index, 'year', e.target.value)
                        }
                        className="w-24 rounded-lg border border-gray-300 px-3 py-2"
                      />
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
                      {formData.upcomingIntakes.length > 1 && (
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

            {/* Program Structure */}
            <div>
              <label className="text-h3 mb-2 block font-semibold text-gray-700">
                Program Structure
              </label>
              <div className="mb-4">
                <label className="text-h5 mb-1 block text-gray-500">
                  Total Credit Requirement
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="120"
                    value={formData.totalCreditRequirement}
                    onChange={(e) =>
                      handleInputChange(
                        'totalCreditRequirement',
                        e.target.value
                      )
                    }
                    className="rounded-lg border border-gray-300 px-3 py-2"
                  />
                  <span className="flex items-center text-sm text-gray-500">
                    CREDITS
                  </span>
                </div>
              </div>
              <div className="">
                <TextEditor
                  value={formData.programStructure}
                  onChange={(value) =>
                    handleInputChange('programStructure', value)
                  }
                  placeholder="Program structure details..."
                />
              </div>
            </div>

            {/* Undergraduate Entry Requirement */}
            <div>
              <label className="text-h3 mb-2 block font-semibold text-gray-700">
                Undergraduate Entry Requirement
              </label>
              <div className="">
                <TextEditor
                  value={formData.undergraduateEntryRequirement}
                  onChange={(value) =>
                    handleInputChange('undergraduateEntryRequirement', value)
                  }
                  placeholder="Entry requirements..."
                />
              </div>
            </div>

            {/* Career Paths */}
            <div>
              <label className="text-h3 mb-2 block font-semibold text-gray-700">
                Career Paths (if any)
              </label>
              <div className="">
                <TextEditor
                  value={formData.careerPaths}
                  onChange={(value) => handleInputChange('careerPaths', value)}
                  placeholder="Career paths information..."
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
                createProgramMutation.isPending ||
                uploadProgramImagesMutation.isPending ||
                updateProgramMutation.isPending
              }
              className="bg-primary rounded-lg px-6 py-2 text-white hover:bg-red-600 disabled:opacity-50"
            >
              {isLoading ||
              createProgramMutation.isPending ||
              uploadProgramImagesMutation.isPending ||
              updateProgramMutation.isPending
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

export default ProgramForm;
