import {
  initialVCFStats,
  initialVCFStatsChromosomeVariant,
} from '@/constants/initial_vcf_stats';
import {
  CodingConsequence,
  VCFChromosomRecord,
  VCFStats,
  VCFVariant,
  VCFVariantInfo,
} from '@/types/vcf';
import cloneDeep from 'lodash/cloneDeep';

export class VCFParserService {
  private offset = 0;
  private chromosomeRecord: VCFChromosomRecord = {};
  private stats: VCFStats;
  private lineBuffer: Uint8Array;
  private resolve?: (value: [VCFChromosomRecord, VCFStats]) => void;
  private reject?: (value: string) => void;
  private readonly decoder: TextDecoder;
  private readonly fr: FileReader;
  private readonly chunkSize: number;
  private readonly file: File;

  constructor(file: File, chunkSize?: number) {
    this.file = file;
    this.chunkSize = chunkSize || 1024;
    this.fr = new FileReader();
    this.lineBuffer = new Uint8Array();
    this.decoder = new TextDecoder();
    this.fr.addEventListener('load', this.readLine.bind(this));
    this.fr.addEventListener('error', this.handleError.bind(this));
    this.stats = cloneDeep(initialVCFStats);
  }

  public async parse(): Promise<[VCFChromosomRecord, VCFStats]> {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
      this.seek();
    });
  }

  private seek(): void {
    if (this.offset >= this.file.size) {
      if (this.resolve && this.stats) {
        this.resolve([this.chromosomeRecord, this.stats]);
      }
      this.clearEventListeners();
      return;
    }
    const slice = this.file.slice(this.offset, this.offset + this.chunkSize);
    this.fr.readAsArrayBuffer(slice);
  }

  private mergeUint8Arrays(first: Uint8Array, second: Uint8Array): Uint8Array {
    const mergedArray = new Uint8Array(first.length + second.length);
    mergedArray.set(first);
    mergedArray.set(second, first.length);
    return mergedArray;
  }

  private readLine() {
    const view = new Uint8Array(this.fr.result as ArrayBuffer);
    const newlineIdx = view.findIndex((value) => value === 10);
    if (newlineIdx < 0) {
      this.lineBuffer = this.mergeUint8Arrays(this.lineBuffer, view);
      this.offset += this.chunkSize;
    } else {
      const line = this.decoder.decode(
        this.mergeUint8Arrays(this.lineBuffer, view.slice(0, newlineIdx))
      );
      this.parseLine(line);
      this.lineBuffer = new Uint8Array();
      this.offset += newlineIdx + 1;
    }
    this.seek();
  }

  private parseLine(line: string) {
    if (!line.startsWith('#')) {
      const [CHROM, POS, ID, REF, ALT, QUAL, FILTER, INFO] = line.split('\t');
      const variant: VCFVariant = {
        CHROM,
        POS: Number(POS),
        ID: Number(ID),
        REF,
        ALT,
        QUAL: Number(QUAL),
        FILTER,
        INFO: this.parseInfo(INFO),
      };
      if (this.chromosomeRecord[CHROM]) {
        this.chromosomeRecord[CHROM].push(variant);
      } else {
        this.chromosomeRecord[CHROM] = [variant];
      }
      this.updateStats(variant);
    }
  }

  private parseInfo(info: string): VCFVariantInfo {
    let NVF: number;
    let TYPE: 'SNP' | 'INDEL';
    let DBXREF: [string, string | number][];
    let SGVEP: {
      gene: string;
      geneStrand: '-' | '+' | '.';
      txName: string;
      exonRank: number | '.';
      cDNA: string;
      protein: string;
      codingConsequence: CodingConsequence;
    };

    info.split(';').forEach((data) => {
      const [key, value] = data.split('=');
      switch (key) {
        case 'NVF':
          NVF = Number(value);
          break;
        case 'TYPE':
          TYPE = value as 'SNP' | 'INDEL';
          break;
        case 'DBXREF':
          DBXREF = value
            .split(',')
            .map((data) => data.split(':') as [string, string | number]);
          break;
        case 'SGVEP':
          {
            const [
              gene,
              geneStrand,
              txName,
              exonRank,
              cDNA,
              protein,
              codingConsequence,
            ] = value.split('|');
            SGVEP = {
              gene,
              geneStrand: geneStrand as '-' | '+' | '.',
              txName,
              exonRank: exonRank === '.' ? exonRank : Number(exonRank),
              cDNA,
              protein,
              codingConsequence: codingConsequence as CodingConsequence,
            };
          }
          break;
      }
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return { NVF, TYPE, DBXREF, SGVEP };
  }

  private updateStats(variant: VCFVariant) {
    const filter = variant.FILTER === 'PASS' ? 'pass' : 'fail';
    this.stats.total += 1;
    this.stats.variantFiltered[filter] += 1;
    this.stats.variantType[variant.INFO.TYPE][filter] += 1;
    this.stats.variantConsequence[filter][
      variant.INFO.SGVEP.codingConsequence
    ] += 1;
    if (!this.stats.variantPerChromosome[variant.CHROM]) {
      this.stats.variantPerChromosome[variant.CHROM] = cloneDeep(
        initialVCFStatsChromosomeVariant
      );
    }
    this.stats.variantPerChromosome[variant.CHROM].total += 1;
    this.stats.variantPerChromosome[variant.CHROM][filter].total += 1;
    this.stats.variantPerChromosome[variant.CHROM][filter][
      variant.INFO.TYPE
    ].total += 1;
    this.stats.variantPerChromosome[variant.CHROM][filter][variant.INFO.TYPE][
      variant.INFO.SGVEP.codingConsequence
    ] += 1;
  }

  private clearEventListeners() {
    this.fr.removeEventListener('load', this.readLine);
    this.fr.removeEventListener('error', this.handleError);
  }

  private handleError() {
    if (this.reject) {
      this.reject('Error in FileReader');
    }
    this.fr.removeEventListener('load', this.readLine);
    this.fr.removeEventListener('error', this.handleError);
  }
}
