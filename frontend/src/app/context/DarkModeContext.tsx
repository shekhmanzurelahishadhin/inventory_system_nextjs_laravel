'use client';

import React, { createContext, useContext, ReactNode } from 'react';

interface DarkModeContextType {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};

interface DarkModeProviderProps {
  value: DarkModeContextType;
  children: ReactNode;
}

export const DarkModeProvider: React.FC<DarkModeProviderProps> = ({ value, children }) => {
  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
};