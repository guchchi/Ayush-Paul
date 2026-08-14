import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SidebarMode = 'expanded' | 'collapsed';

interface SidebarStore {
  mode: SidebarMode;
  toggle: () => void;
  setMode: (mode: SidebarMode) => void;
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      mode: 'expanded',
      toggle: () =>
        set((state) => ({
          mode: state.mode === 'expanded' ? 'collapsed' : 'expanded',
        })),
      setMode: (mode) => set({ mode }),
    }),
    {
      name: 'sidebar_mode_store',
    }
  )
);

export function useSidebarCollapse() {
  const mode = useSidebarStore((s) => s.mode);
  const toggle = useSidebarStore((s) => s.toggle);
  const setMode = useSidebarStore((s) => s.setMode);

  const isCollapsed = mode === 'collapsed';
  const isExpanded = mode === 'expanded';

  return { mode, isCollapsed, isExpanded, toggle, setMode };
}
