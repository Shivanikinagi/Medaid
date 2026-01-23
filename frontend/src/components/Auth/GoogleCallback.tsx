import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import oauthService from '../../services/oauthService';

const GoogleCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const errorParam = params.get('error');

      if (errorParam) {
        setError('Google authentication was cancelled or failed');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      if (!code) {
        setError('No authorization code received');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      try {
        await oauthService.handleGoogleCallback(code);
        navigate('/dashboard');
      } catch (err: any) {
        setError(err.message || 'Authentication failed');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        {error ? (
          <>
            <div className="mb-4">
              <svg
                className="w-16 h-16 text-red-500 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Authentication Failed</h2>
            <p className="text-red-400 mb-4">{error}</p>
            <p className="text-gray-400">Redirecting to login...</p>
          </>
        ) : (
          <>
            <div className="mb-4">
              <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Authenticating with Google...</h2>
            <p className="text-gray-400">Please wait while we sign you in</p>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleCallback;
