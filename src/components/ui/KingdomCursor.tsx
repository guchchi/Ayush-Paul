import React from 'react';
import { useKingdomCursor } from '../../hooks/useKingdomCursor';
import { cn } from '../../lib/utils';

export const KingdomCursor = () => {
  const { isActive } = useKingdomCursor();

  // On touch devices, hide the custom cursor completely
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <div className={cn("kingdom-cursor hidden md:block", isActive && "active")} />
  );
};
