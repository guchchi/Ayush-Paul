import { useState, useEffect, useCallback } from 'react';

export type SidebarMode = 'expanded' | 'collapsed';

const STORAGE_KEY = 'sidebar_mode';
// Legacy key migration support
const LEGACY_STORAGE_KEY = 'sidebar_collapsed';

export function useSidebarCollapse() {
  const [mode, setMode] = useState<SidebarMode>(() => {
    if (typeof window === 'undefined') return 'expanded';

    // Check new key
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'collapsed' || stored === 'expanded') {
      return stored as SidebarMode;
    }

    // Migrate legacy key if present
    const legacyStored = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyStored !== null) {
      const isLegacyCollapsed = legacyStored === 'true';
      const migratedMode = isLegacyCollapsed ? 'collapsed' : 'expanded';
      localStorage.setItem(STORAGE_KEY, migratedMode);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      return migratedMode;
    }

    return 'expanded';
  });

  // Keep synced across tabs AND local components in the same window
  useEffect(() => {
    const syncState = () => {
      if (typeof window === 'undefined') return;
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'collapsed' || stored === 'expanded') {
        setMode(stored as SidebarMode);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        if (e.newValue === 'collapsed' || e.newValue === 'expanded') {
          setMode(e.newValue as SidebarMode);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('sidebar-mode-changed', syncState);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sidebar-mode-changed', syncState);
    };
  }, []);

  const toggle = useCallback(() => {
    setMode((prev) => {
      const nextMode = prev === 'expanded' ? 'collapsed' : 'expanded';
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, nextMode);
        // Dispatch local event for same-window updates
        window.dispatchEvent(new Event('sidebar-mode-changed'));
      }
      return nextMode;
    });
  }, []);

  const isCollapsed = mode === 'collapsed';
  const isExpanded = mode === 'expanded';

  return { mode, isCollapsed, isExpanded, toggle };
}
