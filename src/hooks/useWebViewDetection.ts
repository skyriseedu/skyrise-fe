import { useEffect, useState } from 'react';
import type {
  WebViewDetectionResult,
  WebViewType,
  WebViewPattern,
} from '@/types/webview';

/**
 * WebView detection patterns
 */
const WEBVIEW_PATTERNS: WebViewPattern[] = [
  { name: 'facebook', pattern: /FBAN|FBAV/i },
  { name: 'instagram', pattern: /Instagram/i },
  { name: 'messenger', pattern: /Messenger/i },
];

/**
 * Hook to detect if the app is running in Facebook, Instagram, or Messenger WebView
 */
export const useWebViewDetection = (): WebViewDetectionResult & {
  webViewType: WebViewType;
} => {
  const [isWebView, setIsWebView] = useState(false);
  const [webViewType, setWebViewType] = useState<WebViewType>('unknown');

  useEffect(() => {
    const userAgent = navigator.userAgent;

    // Find matching WebView pattern
    const matchedPattern = WEBVIEW_PATTERNS.find(({ pattern }) =>
      pattern.test(userAgent)
    );

    if (matchedPattern) {
      setIsWebView(true);
      setWebViewType(matchedPattern.name);
    } else {
      setIsWebView(false);
      setWebViewType('unknown');
    }
  }, []);

  return {
    isWebView,
    webViewType,
    userAgent: navigator.userAgent,
  };
};

/**
 * Utility function to redirect to system browser
 */
export const redirectToSystemBrowser = () => {
  const currentUrl = window.location.href;

  try {
    // Try to open in system browser
    window.open(currentUrl, '_system');
  } catch {
    // Fallback: Try to copy URL to clipboard
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(currentUrl)
        .then(() => {
          alert('URL copied to clipboard. Please paste it in your browser.');
        })
        .catch(() => {
          // Final fallback: prompt user to manually copy URL
          prompt('Copy this URL to open in your browser:', currentUrl);
        });
    } else {
      // For older browsers: use prompt as fallback
      prompt('Copy this URL to open in your browser:', currentUrl);
    }
  }
};
