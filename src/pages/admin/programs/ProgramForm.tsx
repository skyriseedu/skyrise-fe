import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextEditor } from '@/components/common/TextEditor/TextEditor';
import CustomCalendar from '@/components/common/CustomCalendar';
import ArrowLeft from '@/assets/arrow-left.svg?react';
import ImageUpload from '@/assets/img-upload.svg?react';
import Calendar from '@/assets/calendar.svg?react';
import CaretDown from '@/assets/caret-down.svg?react';
import CaretUp from '@/assets/caret-up.svg?react';

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
  upcomingIntakes: Array<{ year: string }>;
  totalCreditRequirement: string;
  programStructure: string;
  undergraduateEntryRequirement: string;
  careerPaths: string;
  studentReviews: Array<{
    studentName: string;
    major: string;
    review: string;
    image?: string;
  }>;
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
  upcomingIntakes: [{ year: '' }],
  totalCreditRequirement: '',
  programStructure: '',
  undergraduateEntryRequirement: '',
  careerPaths: '',
  studentReviews: [],
  coverImages: {},
};

const ProgramForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

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
      upcomingIntakes: [...prev.upcomingIntakes, { year: '' }],
    }));
  };

  const handleIntakeChange = (index: number, year: string) => {
    setFormData((prev) => ({
      ...prev,
      upcomingIntakes: prev.upcomingIntakes.map((intake, i) =>
        i === index ? { year } : intake
      ),
    }));
  };

  const handleAddStudentReview = () => {
    setFormData((prev) => ({
      ...prev,
      studentReviews: [
        ...prev.studentReviews,
        { studentName: '', major: '', review: '' },
      ],
    }));
  };

  const handleStudentReviewChange = (
    index: number,
    field: keyof ProgramFormData['studentReviews'][0],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      studentReviews: prev.studentReviews.map((review, i) =>
        i === index ? { ...review, [field]: value } : review
      ),
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
      // In a real app, this would submit to an API
      console.log('Submitting program data:', formData);

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
    <div className="min-h-screen p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            PROGRAM SETUP
          </button>
          <span className="text-gray-400">—</span>
          <span className="font-medium text-gray-900">
            {isEditing ? 'EDIT' : 'CREATE'}
          </span>
        </div>

        {/* Form */}
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <h1 className="mb-8 text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Program' : 'New Program'}
          </h1>

          <div className="space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Program Name
                </label>
                <input
                  type="text"
                  placeholder="Program Name"
                  value={formData.programName}
                  onChange={(e) =>
                    handleInputChange('programName', e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
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
                    readOnly
                    onClick={() => {
                      setShowRankingDropdown(false);
                      setShowCalendar(!showCalendar);
                    }}
                    className="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <Calendar
                    className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 cursor-pointer text-black"
                    onClick={() => {
                      setShowRankingDropdown(false);
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
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  University Name
                </label>
                <input
                  type="text"
                  placeholder="University Name"
                  value={formData.universityName}
                  onChange={(e) =>
                    handleInputChange('universityName', e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block flex justify-between text-sm font-medium text-gray-700">
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
                      <div className="absolute top-full left-0 z-[100] mt-1 w-full rounded-lg border border-gray-200 shadow-lg">
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
              <label className="mb-4 block text-sm font-medium text-gray-700">
                Cover Images
              </label>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Primary Image */}
                <div className="rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 p-8 text-center">
                  <div className="flex flex-col items-center">
                    <div className="mb-2 text-blue-500">
                      <ImageUpload className="h-12 w-12" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      Maximum size 5MB
                      <br />
                      Supported: JPG, JPEG
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload('primary', file);
                    }}
                    className="hidden"
                  />
                </div>

                {/* Secondary Image */}
                <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                  <div className="flex flex-col items-center">
                    <div className="mb-2 text-gray-400">
                      <ImageUpload className="h-12 w-12" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      Maximum size 5MB
                      <br />
                      Supported: JPG, JPEG
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload('secondary', file);
                    }}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* About Program */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                About Program
              </label>
              <div className="w-full rounded-lg">
                <TextEditor
                  value={formData.aboutProgram}
                  onChange={(value) => handleInputChange('aboutProgram', value)}
                  placeholder="Description about program"
                  className="-mx-5"
                />
              </div>
            </div>

            {/* Key Information */}
            <div>
              <label className="mb-4 block text-sm font-medium text-gray-700">
                Key Information
              </label>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div>
                  <label className="mb-1 block text-xs text-gray-500">
                    Degree
                  </label>
                  <select
                    value={formData.degree}
                    onChange={(e) =>
                      handleInputChange('degree', e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Bachelor">Bachelor</option>
                    <option value="Master">Master</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs text-gray-500">
                    Duration
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) =>
                      handleInputChange('duration', e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="1 year">1 year</option>
                    <option value="2 years">2 years</option>
                    <option value="3 years">3 years</option>
                    <option value="4 years">4 years</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs text-gray-500">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Location"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange('location', e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-gray-500">
                    Application fee
                  </label>
                  <select
                    value={formData.applicationFee}
                    onChange={(e) =>
                      handleInputChange('applicationFee', e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Free">Free</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Upcoming Intakes */}
            <div>
              <label className="mb-4 block text-sm font-medium text-gray-700">
                Upcoming Intakes
              </label>
              <div className="space-y-2">
                {formData.upcomingIntakes.map((intake, index) => (
                  <div key={index} className="flex gap-2">
                    <label className="flex items-center text-xs text-gray-500">
                      Year
                    </label>
                    <input
                      type="text"
                      placeholder="Year"
                      value={intake.year}
                      onChange={(e) =>
                        handleIntakeChange(index, e.target.value)
                      }
                      className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddIntake}
                  className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
                >
                  <span className="text-lg">+</span> Intake
                </button>
              </div>
            </div>

            {/* Program Structure */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Program Structure
              </label>
              <div className="mb-4">
                <label className="mb-1 block text-xs text-gray-500">
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
                    className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="flex items-center text-sm text-gray-500">
                    CREDITS
                  </span>
                </div>
              </div>
              <div className="rounded-lg border border-gray-300">
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
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Undergraduate Entry Requirement
              </label>
              <div className="rounded-lg border border-gray-300">
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
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Career Paths (if any)
              </label>
              <div className="rounded-lg border border-gray-300">
                <TextEditor
                  value={formData.careerPaths}
                  onChange={(value) => handleInputChange('careerPaths', value)}
                  placeholder="Career paths information..."
                />
              </div>
            </div>

            {/* Student Review */}
            <div>
              <label className="mb-4 block text-sm font-medium text-gray-700">
                Student Review
              </label>
              <div className="space-y-4">
                {formData.studentReviews.map((review, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 p-4 md:grid-cols-4"
                  >
                    <div>
                      <label className="mb-1 block text-xs text-gray-500">
                        Student Name
                      </label>
                      <input
                        type="text"
                        value={review.studentName}
                        onChange={(e) =>
                          handleStudentReviewChange(
                            index,
                            'studentName',
                            e.target.value
                          )
                        }
                        className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-gray-500">
                        Major
                      </label>
                      <input
                        type="text"
                        value={review.major}
                        onChange={(e) =>
                          handleStudentReviewChange(
                            index,
                            'major',
                            e.target.value
                          )
                        }
                        className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-xs text-gray-500">
                        Reviews
                      </label>
                      <textarea
                        value={review.review}
                        onChange={(e) =>
                          handleStudentReviewChange(
                            index,
                            'review',
                            e.target.value
                          )
                        }
                        className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                        rows={2}
                      />
                    </div>
                    <div className="md:col-span-4">
                      <label className="mb-1 block text-xs text-gray-500">
                        Images
                      </label>
                      <button className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50">
                        Upload .png
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddStudentReview}
                  className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
                >
                  <span className="text-lg">+</span> Student
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={handleCancel}
              className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="rounded-lg bg-red-500 px-6 py-2 text-white hover:bg-red-600 disabled:opacity-50"
            >
              {isLoading ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramForm;
