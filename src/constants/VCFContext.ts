import { VCFChromosomRecord, VCFStats } from '@/types/vcf';
import { Dispatch, SetStateAction, createContext } from 'react';

export type VCFContextData = {
  vcfData: VCFChromosomRecord;
  vcfStats: VCFStats;
  filename?: string;
} | null;

export type VCFContextType = {
  value: VCFContextData;
  setContext: Dispatch<SetStateAction<VCFContextData>>;
};

export const VCFContext = createContext<VCFContextType | null>(null);
