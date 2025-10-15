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

type ProgramFormData = {
  programName: string;
  universityName: string;
  applicationDeadline: string;
  universityRanking: string;
  universityRankingType: 'Public' | 'Private';
  aboutProgram: string;
  degree: string;
  duration: string;
  location: string;
  applicationFee: string;
  creditTransfer: string;
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
  creditTransfer: 'Not Available',
  location: '',
  applicationFee: 'Free',
  upcomingIntakes: [{ year: '', month: '' }],
  totalCreditRequirement: '',
  programStructure: '',
  undergraduateEntryRequirement: '',
  careerPaths: '',
  studentReviews: [],
  coverImages: {},
};

const UniversityForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

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

  useEffect(() => {
    if (isEditing && id) {
      // Load existing program data for editing
      // In a real app, this would fetch from an API
      console.log('Loading program for editing:', id);
      // setFormData(existingProgramData);
    }
  }, [isEditing, id]);

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
      const formattedData = {
        ...formData,
        upcomingIntakes: formData.upcomingIntakes.map(
          (intake) => `${intake.month} ${intake.year}`
        ),
      };

      // In a real app, this would submit to an API
      console.log('Submitting program data:', formattedData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      navigate('/admin/programs');
    } catch (error) {
      console.error('Error submitting program:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/program-setup');
  };

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
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              />
            </div>

            <div>
              <h2 className="text-h3 mb-3 font-semibold">Logo</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ImageUpload
                  image={formData.coverImages.secondary}
                  onImageUpload={(file) => handleImageUpload('secondary', file)}
                />
              </div>
            </div>

            {/* Cover Images */}
            <div>
              <h2 className="text-h3 mb-3 font-semibold">Cover Images</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ImageUpload
                  image={formData.coverImages.primary}
                  onImageUpload={(file) => handleImageUpload('primary', file)}
                />
                <ImageUpload
                  image={formData.coverImages.secondary}
                  onImageUpload={(file) => handleImageUpload('secondary', file)}
                />
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                <div>
                  <label className="text-h5 mb-1 flex justify-between text-gray-500">
                    <span>Thailand University Ranking</span>
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
                <div>
                  <label className="text-h5 mb-1 block text-gray-500">
                    Founded Year
                  </label>
                  <input
                    type="number"
                    placeholder="yyyy"
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
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange('location', e.target.value)
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
                    value={formData.creditTransfer}
                    onChange={(value) =>
                      handleInputChange('creditTransfer', value)
                    }
                    placeholder="Select Credit Transfer"
                  />
                </div>
                <div>
                  <label className="text-h5 mb-1 block text-gray-500">
                    Programs
                  </label>
                  <input
                    type="text"
                    placeholder="Programs"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
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
              disabled={isLoading}
              className="bg-primary rounded-lg px-6 py-2 text-white hover:bg-red-600 disabled:opacity-50"
            >
              {isLoading ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityForm;
