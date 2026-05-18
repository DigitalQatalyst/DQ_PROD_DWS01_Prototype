import React, { useState, createContext, useContext } from 'react';
export type ViewingMode = 'first-time' | 'returning';
interface ViewingModeContextType {
  mode: ViewingMode;
  setMode: (mode: ViewingMode) => void;
}
const ViewingModeContext = createContext<ViewingModeContextType | undefined>(undefined);
export function ViewingModeProvider({
  children


}: {children: ReactNode;}) {
  const [mode, setMode] = useState<ViewingMode>('first-time');
  return <ViewingModeContext.Provider value={{
    mode,
    setMode
  }}>
      {children}
    </ViewingModeContext.Provider>;
}
export function useViewingMode() {
  const ctx = useContext(ViewingModeContext);
  if (!ctx) {
    throw new Error('useViewingMode must be used within a ViewingModeProvider');
  }
  return ctx;
}