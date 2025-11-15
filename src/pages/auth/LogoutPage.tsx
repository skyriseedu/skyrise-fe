import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/common/Loading';
import Button from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';

const LogoutPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    const performLogout = async () => {
      try {
        await logout();
        if (isMounted) {
          navigate('/login', { replace: true });
        }
      } catch (err) {
        if (!isMounted) {
          return;
        }
        const message =
          err instanceof Error
            ? err.message
            : 'Something went wrong while logging you out.';
        setError(message);
      }
    };

    void performLogout();

    return () => {
      isMounted = false;
    };
  }, [logout, navigate]);

  const handleGoToLogin = () => {
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
      <div className="flex flex-col items-center space-y-4 text-center">
        {error ? (
          <>
            <p className="text-h4 font-semibold text-red-600">Logout failed</p>
            <p className="text-body-2 text-text-secondary">{error}</p>
            <Button onClick={handleGoToLogin}>Go to Login</Button>
          </>
        ) : (
          <>
            <LoadingSpinner size="lg" color="primary" />
            <p className="text-body-2 text-text-secondary">Signing you out...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default LogoutPage;
