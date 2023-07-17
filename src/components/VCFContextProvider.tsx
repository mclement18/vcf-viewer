'use client';
import { VCFContext, VCFContextData } from '@/constants/VCFContext';
import { PropsWithChildren, useState } from 'react';

export const VCFContextProvider = ({ children }: PropsWithChildren) => {
  const [vcfContextData, setVcfContextData] = useState<VCFContextData>(null);
  return (
    <VCFContext.Provider
      value={{ value: vcfContextData, setContext: setVcfContextData }}
    >
      {children}
    </VCFContext.Provider>
  );
};
