import React from 'react';
import { cn } from "@/src/lib/utils";

export const Container = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("layout-container", className)}>
    {children}
  </div>
);
