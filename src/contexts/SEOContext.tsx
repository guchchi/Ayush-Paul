import React, { createContext, useContext } from 'react';

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  noindex?: boolean;
  schema?: Record<string, any>;
}

export interface SEOContextType {
  isClient: boolean;
  seoData: SEOData | null;
}

export const SEOContext = createContext<SEOContextType | null>(null);

export const SEOProvider: React.FC<{ children: React.ReactNode; isClient?: boolean; contextData?: SEOContextType }> = ({ 
  children, 
  isClient = true,
  contextData
}) => {
  // If contextData is provided (SSR), use it. Otherwise create a dummy one for client
  const value = contextData || { isClient, seoData: null };
  return (
    <SEOContext.Provider value={value}>
      {children}
    </SEOContext.Provider>
  );
};
