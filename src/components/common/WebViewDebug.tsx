import React from 'react';
import { useWebViewDetection } from '@/hooks/useWebViewDetection';

/**
 * Debug component to test WebView detection
 * Remove this from production
 */
const WebViewDebug: React.FC = () => {
  const { isWebView, webViewType, userAgent } = useWebViewDetection();

  // Only show in development
  if (import.meta.env.PROD) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-xs rounded-lg bg-gray-800 p-4 text-white shadow-lg">
      <h4 className="text-body-5 mb-2 font-semibold">WebView Debug</h4>
      <div className="text-body-5 space-y-1">
        <div>
          <strong>Is WebView:</strong> {isWebView ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Type:</strong> {webViewType}
        </div>
        <div>
          <strong>User Agent:</strong>
          <div className="text-body-5 mt-1 break-all opacity-75">
            {userAgent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebViewDebug;
