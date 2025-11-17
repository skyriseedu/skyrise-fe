import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/common/Button';
import type { RegisterCredentials } from '@/types/auth';
import SkyRiseLogo from '@/assets/skyrise-logo.svg?react';
import PasswordHideIcon from '@/assets/password-hide.svg?react';
import { registerSchema } from '@/schemas';

const RegisterPage: React.FC = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const initialValues: RegisterCredentials = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const handleSubmit = async (values: RegisterCredentials) => {
    try {
      setError('');
      await register(values);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Registration failed. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          {/* Logo */}
          <div className="flex justify-center">
            <SkyRiseLogo className="h-20 w-auto" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join SKYRISE today
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="mt-8 space-y-6">
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-800">{error}</div>
                </div>
              )}

              <div className="space-y-4">
                {/* Name Field */}
                <div className="relative">
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    className={`border-text-secondary focus:border-text-primary w-full rounded-lg border px-4 pt-6 pb-3 text-gray-900 focus:outline-none ${
                      errors.name && touched.name
                        ? 'border-red-300 focus:border-red-500'
                        : ''
                    }`}
                  />
                  <label
                    htmlFor="name"
                    className="absolute top-0 left-3 -translate-y-1/2 bg-white px-2 text-sm text-gray-500"
                  >
                    Full Name
                  </label>
                  <ErrorMessage
                    name="name"
                    component="p"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                {/* Email Field */}
                <div className="relative">
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={`border-text-secondary focus:border-text-primary w-full rounded-lg border px-4 pt-6 pb-3 text-gray-900 focus:outline-none ${
                      errors.email && touched.email
                        ? 'border-red-300 focus:border-red-500'
                        : ''
                    }`}
                  />
                  <label
                    htmlFor="email"
                    className="absolute top-0 left-3 -translate-y-1/2 bg-white px-2 text-sm text-gray-500"
                  >
                    Email Address
                  </label>
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                {/* Password Field */}
                <div className="relative">
                  <Field
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={`border-text-secondary focus:border-text-primary w-full rounded-lg border px-4 pt-6 pr-12 pb-3 text-gray-900 focus:outline-none ${
                      errors.password && touched.password
                        ? 'border-red-300 focus:border-red-500'
                        : ''
                    }`}
                  />
                  <label
                    htmlFor="password"
                    className="absolute top-0 left-3 -translate-y-1/2 bg-white px-2 text-sm text-gray-500"
                  >
                    Password
                  </label>
                  {/* Eye icon */}
                  <div
                    className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <PasswordHideIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                {/* Confirm Password Field */}
                <div className="relative">
                  <Field
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={`border-text-secondary focus:border-text-primary w-full rounded-lg border px-4 pt-6 pr-12 pb-3 text-gray-900 focus:outline-none ${
                      errors.confirmPassword && touched.confirmPassword
                        ? 'border-red-300 focus:border-red-500'
                        : ''
                    }`}
                  />
                  <label
                    htmlFor="confirmPassword"
                    className="absolute top-0 left-3 -translate-y-1/2 bg-white px-2 text-sm text-gray-500"
                  >
                    Confirm Password
                  </label>
                  {/* Eye icon */}
                  <div
                    className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <PasswordHideIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <ErrorMessage
                    name="confirmPassword"
                    component="p"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>
              </div>

              {/* Register Button */}
              <div>
                <Button
                  type="submit"
                  primary
                  size="lg"
                  loading={isLoading}
                  className="w-full"
                >
                  Create Account
                </Button>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Already have an account?{' '}
                </span>
                <Link
                  to="/login"
                  className="text-primary hover:text-primary/80 font-medium underline"
                >
                  Sign in to SKYRISE
                </Link>
              </div>

              {/* Terms and Privacy */}
              <div className="text-center text-xs text-gray-600">
                By creating an account, you agree to our{' '}
                <Link
                  to="/terms"
                  className="text-red-500 underline hover:text-red-600"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  to="/privacy"
                  className="text-red-500 underline hover:text-red-600"
                >
                  Privacy Policy
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RegisterPage;
