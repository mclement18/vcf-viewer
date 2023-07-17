import { VCFContext, VCFContextType } from '@/constants/VCFContext';
import { useContext } from 'react';

export function useVCFContext(): VCFContextType {
  const vcfContext = useContext(VCFContext);

  if (vcfContext === null) {
    throw new Error('Trying to access VCFContext outside of provider.');
  }

  return vcfContext;
}
