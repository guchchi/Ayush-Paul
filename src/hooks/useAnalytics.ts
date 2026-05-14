import { useEffect } from 'react';
import posthog from 'posthog-js';

// Initialize PostHog outside the component to ensure it only happens once
if (typeof window !== 'undefined') {
  const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
  const posthogHost = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

  if (posthogKey) {
    posthog.init(posthogKey, {
      api_host: posthogHost,
      autocapture: false, // We will manually track key events for privacy and performance
      capture_pageview: false, // Handled manually below
    });
  } else {
    console.warn('⚠️ [Analytics] VITE_POSTHOG_KEY is not set. Analytics disabled.');
  }
}

export const useAnalytics = () => {
  // Track pageviews automatically when this hook is mounted (e.g. at the top of a Page component)
  useEffect(() => {
    if (posthog.__loaded) {
      posthog.capture('$pageview');
    }
  }, []);

  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    if (posthog.__loaded) {
      posthog.capture(eventName, properties);
    }
    // Also log to console in dev mode
    if (import.meta.env.DEV) {
      console.log(`📊 [Analytics Event]: ${eventName}`, properties || '');
    }
  };

  const identifyUser = (userId: string, properties?: Record<string, any>) => {
    if (posthog.__loaded) {
      posthog.identify(userId, properties);
    }
  };

  const resetUser = () => {
    if (posthog.__loaded) {
      posthog.reset();
    }
  };

  return { trackEvent, identifyUser, resetUser };
};
