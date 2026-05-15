import { useEffect, useRef } from 'react';
import posthog from 'posthog-js';
import { collection, addDoc, writeBatch, doc } from 'firebase/firestore';
import { db } from '../firebase';

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

// Global Event Queue for Firestore Batching
interface AnalyticsEvent {
  eventName: string;
  properties: Record<string, any>;
  timestamp: string;
}
let eventQueue: AnalyticsEvent[] = [];
let flushTimeout: NodeJS.Timeout | null = null;

const flushQueue = async () => {
  if (eventQueue.length === 0) return;

  const batchEvents = [...eventQueue];
  eventQueue = []; // Clear queue immediately to prevent race conditions

  try {
    const batch = writeBatch(db);
    const analyticsRef = collection(db, "analytics_events");
    
    batchEvents.forEach((event) => {
      const newDocRef = doc(analyticsRef);
      batch.set(newDocRef, event);
    });

    await batch.commit();
    if (import.meta.env.DEV) {
      console.log(`[Analytics] Flushed ${batchEvents.length} events to Firestore.`);
    }
  } catch (e) {
    console.error("[Analytics] Failed to flush events to Firestore:", e);
    // Put them back in the queue on failure
    eventQueue = [...batchEvents, ...eventQueue];
  }
};

// Setup global flush listener for tab close/visibility change
if (typeof window !== 'undefined') {
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flushQueue();
    }
  });
  window.addEventListener('beforeunload', () => {
    flushQueue();
  });
}

export const useAnalytics = () => {
  // Track pageviews automatically when this hook is mounted (e.g. at the top of a Page component)
  useEffect(() => {
    if (posthog.__loaded) {
      posthog.capture('$pageview');
    }
  }, []);

  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    // 1. Send to PostHog (Primary Analytics)
    if (posthog.__loaded) {
      posthog.capture(eventName, properties);
    }
    
    // 2. Queue for Firestore (Batched Founder Metrics)
    eventQueue.push({
      eventName,
      properties: properties || {},
      timestamp: new Date().toISOString()
    });

    // Reset the 30-second flush timer
    if (flushTimeout) clearTimeout(flushTimeout);
    flushTimeout = setTimeout(() => {
      flushQueue();
    }, 30000);

    // Also log to console in dev mode
    if (import.meta.env.DEV) {
      console.log(`📊 [Analytics Event Queued]: ${eventName}`, properties || '');
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
