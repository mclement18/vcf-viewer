import { CODING_CONSEQUENCE } from '@/constants/coding_consequences';

export type VCFChromosomRecord = Record<string | number, VCFVariant[]>;

export type VCFVariant = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  CHROM: string | number;
  POS: number;
  ID: number;
  REF: string;
  ALT: string;
  QUAL: number;
  FILTER: string;
  INFO: VCFVariantInfo;
};

export type VCFVariantInfo = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  NVF: number;
  TYPE: 'SNP' | 'INDEL';
  DBXREF: [string, string | number][];
  SGVEP: {
    gene: string;
    geneStrand: '-' | '+' | '.';
    txName: string;
    exonRank: number | '.';
    cDNA: string;
    protein: string;
    codingConsequence: CodingConsequence;
  };
};

export type CodingConsequence = (typeof CODING_CONSEQUENCE)[number];

export type VCFStatsTotal = {
  total: number;
};

export type VCFStatsVariantFiltered<T = number> = {
  pass: T;
  fail: T;
};

export type VCFStatsVariantType<T = VCFStatsVariantFiltered> = {
  SNP: T;
  INDEL: T;
};

export type VCFStatsVariantConsequence<T = number> = Record<
  CodingConsequence,
  T
>;

export type VCFStatsChromosomeVariant = VCFStatsVariantFiltered<
  VCFStatsVariantType<VCFStatsVariantConsequence & VCFStatsTotal> &
    VCFStatsTotal
> &
  VCFStatsTotal;

export type VCFStatsVariantPerChromosome = Record<
  string | number,
  VCFStatsChromosomeVariant
>;

export type VCFStats = {
  variantPerChromosome: VCFStatsVariantPerChromosome;
  variantFiltered: VCFStatsVariantFiltered;
  variantType: VCFStatsVariantType;
  variantConsequence: VCFStatsVariantFiltered<VCFStatsVariantConsequence>;
} & VCFStatsTotal;
