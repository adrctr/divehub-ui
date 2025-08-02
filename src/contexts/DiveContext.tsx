import React, { createContext, useContext } from 'react';
import type { Dive, DiveDto } from '../types/Dive';
import { useDiveApi } from '../hooks/useDiveApi';

interface DiveContextValue {
  dives: Dive[];
  loading: boolean;
  error: string | null;
  addNewDive: (dive: DiveDto) => Promise<void>;
  updateExistingDive: (dive: Dive) => Promise<void>;
  removeDive: (id: number) => Promise<void>;
}

const DiveContext = createContext<DiveContextValue | undefined>(undefined);

export function DiveProvider({ children }: { children: React.ReactNode }) {
  const diveApi = useDiveApi();

  return <DiveContext.Provider value={diveApi}>{children}</DiveContext.Provider>;
}

export function useDive() {
  const context = useContext(DiveContext);
  if (!context) {
    throw new Error('useDive must be used within a DiveProvider');
  }
  return context;
}
