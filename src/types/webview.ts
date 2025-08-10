/**
 * WebView detection types
 */
export interface WebViewDetectionResult {
  isWebView: boolean;
  userAgent: string;
}

export type WebViewType = 'facebook' | 'instagram' | 'messenger' | 'unknown';

/**
 * WebView detection patterns
 */
export interface WebViewPattern {
  name: WebViewType;
  pattern: RegExp;
}

/**
 * Browser redirect options
 */
export interface RedirectOptions {
  url?: string;
  fallbackMessage?: string;
}
