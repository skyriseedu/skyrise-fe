import React, { useState } from 'react';
import {
  useWebViewDetection,
  redirectToSystemBrowser,
} from '@/hooks/useWebViewDetection';

const WebViewRedirect: React.FC = () => {
  const { isWebView } = useWebViewDetection();
  const [showOverlay, setShowOverlay] = useState(true);

  const handleOpenInBrowser = () => {
    redirectToSystemBrowser();
  };

  const handleContinueHere = () => {
    setShowOverlay(false);
  };

  // Don't show overlay if not in WebView or user dismissed it
  if (!isWebView || !showOverlay) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80">
      <div className="mx-4 max-w-sm rounded-lg bg-white p-6 text-center shadow-xl">
        <h3 className="text-h2 text-text-primary mb-4 font-semibold">
          For Better Experience
        </h3>
        <p className="text-body-3 text-text-secondary mb-6 leading-relaxed">
          Please open this link in your default browser for full functionality
          and the best user experience.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleOpenInBrowser}
            className="bg-primary hover:bg-primary/90 text-body-4 rounded-lg px-6 py-3 font-medium text-white transition-colors"
          >
            Open in Browser
          </button>
          <button
            onClick={handleContinueHere}
            className="text-body-4 text-text-primary rounded-lg bg-gray-200 px-6 py-3 font-medium transition-colors hover:bg-gray-300"
          >
            Continue Here
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebViewRedirect;
