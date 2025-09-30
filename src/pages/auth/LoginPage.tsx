import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/common/Button';
import type { LoginCredentials } from '@/types/auth';
import SkyRiseLogo from '@/assets/skyrise-logo.svg?react';
import PasswordHideIcon from '@/assets/password-hide.svg?react';
import { loginSchema } from '@/schemas';

const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const from = location.state?.from?.pathname || '/admin';

  const initialValues: LoginCredentials = {
    email: '',
    password: '',
  };

  const handleSubmit = async (values: LoginCredentials) => {
    try {
      setError('');
      await login(values);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto mb-6 flex justify-center">
            <SkyRiseLogo className="h-40 w-auto" />
          </div>
          <h2 className="text-h1 text-text-primary mb-2 font-semibold">
            LOGIN TO SKYRISE
          </h2>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="space-y-6">
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-800">{error}</div>
                </div>
              )}

              <div className="space-y-4">
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
                    className="bg-bg absolute top-0 left-3 -translate-y-1/2 px-2 text-sm text-gray-500"
                  >
                    Email
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
                    autoComplete="current-password"
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
              </div>

              {/* Login Button */}
              <div>
                <Button
                  type="submit"
                  className="bg-primary w-full rounded-xl px-4 py-3 font-semibold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Login'}
                </Button>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <Link
                  to="/register"
                  className="text-text-primary decoration-primary font-medium underline decoration-4 underline-offset-5"
                >
                  Register to SkyRise
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;
