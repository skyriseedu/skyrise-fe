import * as Yup from 'yup';

export const bookConsultationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .required('Name is required'),

  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),

  phoneNumber: Yup.string()
    .matches(/^\+\d{1,4}\s\d{6,15}$/, 'Please enter a valid phone number')
    .required('Phone number is required'),

  bookingTimeSchedule: Yup.string().required('Please select a booking time'),

  bookingDateSchedule: Yup.string().required('Please select a booking date'),

  location: Yup.string().required('Please select your location'),

  question: Yup.string()
    .max(500, 'Question must not exceed 500 characters')
    .optional(),
});

export const applyConsultantSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .required('Name is required'),

  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),

  phoneNumber: Yup.string()
    .matches(/^\+\d{1,4}\s\d{6,15}$/, 'Please enter a valid phone number')
    .required('Phone number is required'),

  reason: Yup.string()
    .min(
      10,
      'Please provide at least 10 characters explaining why you want to join'
    )
    .max(1000, 'Reason must not exceed 1000 characters')
    .required('Please tell us why you want to join'),
});

export const applicationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .required('Name is required'),

  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),

  phoneNumber: Yup.string()
    .matches(/^\+\d{1,4}\s\d{6,15}$/, 'Please enter a valid phone number')
    .required('Phone number is required'),

  bookingTimeSchedule: Yup.string().required('Please select a booking time'),

  bookingDateSchedule: Yup.string().required('Please select a booking date'),

  location: Yup.string().required('Please select your location'),

  question: Yup.string()
    .max(500, 'Question must not exceed 500 characters')
    .optional(),
});
