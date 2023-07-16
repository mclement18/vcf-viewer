import {
  VCFStats,
  VCFStatsChromosomeVariant,
  VCFStatsVariantConsequence,
  VCFStatsVariantFiltered,
  VCFStatsVariantType,
} from '@/types/vcf';
import cloneDeep from 'lodash/cloneDeep';

export const initialVCFStatsVariantConsenquence: VCFStatsVariantConsequence = {
  missense: 0,
  synonymous: 0,
  frameshift: 0,
  'no-start': 0,
  'no-stop': 0,
  nonsense: 0,
  intronic: 0,
  intergenic: 0,
  'non-coding': 0,
  "3'UTR": 0,
  "5'UTR": 0,
  inframe_3: 0,
  inframe_6: 0,
  inframe_12: 0,
  'splice_acceptor_-1': 0,
  'splice_acceptor_-2': 0,
  splice_acceptor_cds_indel: 0,
  'splice_donor_+1': 0,
  'splice_donor_+2': 0,
  'splice_donor_+3': 0,
  'splice_donor_+4': 0,
  'invalid-transcript': 0,
  unknown: 0,
};

export const initialVCFStatsVariantFiltered: VCFStatsVariantFiltered = {
  pass: 0,
  fail: 0,
};

export const initialVCFStatsVariantType: VCFStatsVariantType = {
  INDEL: { ...initialVCFStatsVariantFiltered },
  SNP: { ...initialVCFStatsVariantFiltered },
};

export const initialVCFStatsChromosomeVariant: VCFStatsChromosomeVariant = {
  total: 0,
  pass: {
    total: 0,
    INDEL: {
      ...initialVCFStatsVariantConsenquence,
      total: 0,
    },
    SNP: {
      ...initialVCFStatsVariantConsenquence,
      total: 0,
    },
  },
  fail: {
    total: 0,
    INDEL: {
      ...initialVCFStatsVariantConsenquence,
      total: 0,
    },
    SNP: {
      ...initialVCFStatsVariantConsenquence,
      total: 0,
    },
  },
};

export const initialVCFStats: VCFStats = {
  total: 0,
  variantPerChromosome: {},
  variantFiltered: { ...initialVCFStatsVariantFiltered },
  variantType: cloneDeep(initialVCFStatsVariantType),
  variantConsequence: {
    pass: { ...initialVCFStatsVariantConsenquence },
    fail: { ...initialVCFStatsVariantConsenquence },
  },
};
