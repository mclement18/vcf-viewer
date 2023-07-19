import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { ScatterChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  TooltipComponent,
  DatasetComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

import type { ScatterSeriesOption } from 'echarts/charts';
import type {
  GridComponentOption,
  LegendComponentOption,
  ToolboxComponentOption,
  TooltipComponentOption,
  DatasetComponentOption,
} from 'echarts/components';
import type { ComposeOption } from 'echarts/core';
import { useMemo } from 'react';
import { useVCFContext } from '@/hooks/useVCFContext';
import { chromosomeInfoRecord } from '@/constants/chromosome_info';
import reduce from 'lodash/reduce';
import filter from 'lodash/filter';
import get from 'lodash/get';
import { CodingConsequence, VCFChromosomRecord, VCFVariant } from '@/types/vcf';
import {
  colorPerChromosome,
  colorPerConsequence,
} from '@/constants/color_palettes';

echarts.use([
  ScatterChart,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  TooltipComponent,
  DatasetComponent,
  CanvasRenderer,
]);

type ECOption = ComposeOption<
  | ScatterSeriesOption
  | GridComponentOption
  | LegendComponentOption
  | ToolboxComponentOption
  | TooltipComponentOption
  | DatasetComponentOption
>;

export type YAxisType = 'NULL' | 'QUAL' | 'NVF';

type VariantsPerChromosomeChartProps = {
  applyFilters: boolean;
  colorConsequence: boolean;
  yAxisType: YAxisType;
};

export const VariantsPerChromosomeChart = ({
  applyFilters,
  colorConsequence,
  yAxisType,
}: VariantsPerChromosomeChartProps) => {
  const { value } = useVCFContext();

  const jitter = (amount: number) =>
    Math.random() * (0.45 - -0.45) + -0.45 + amount;

  const getRandomIntInclusive = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const chromosomeIdx = (chromosome: string | number) => {
    const idx = Number(chromosome);
    if (Number.isNaN(idx)) {
      return chromosome === 'X' ? 23 : 24;
    }
    return idx;
  };

  const option = useMemo<ECOption>(() => {
    const dataSource = reduce<VCFChromosomRecord, VCFVariant[]>(
      value?.vcfData,
      (previous, current) => [
        ...previous,
        ...filter(current, (variant) =>
          applyFilters ? variant.FILTER === 'PASS' : true
        ),
      ],
      []
    ).map((variant) => {
      const baseData = {
        Chromosome: variant.CHROM,
        Xjit: jitter(chromosomeIdx(variant.CHROM)),
        data: variant,
      };
      switch (yAxisType) {
        case 'NULL':
          return {
            ...baseData,
            Yval: getRandomIntInclusive(0, 1000),
          };
        case 'QUAL':
          return {
            ...baseData,
            QUAL: variant.QUAL,
          };
        case 'NVF':
          return {
            ...baseData,
            NVF: variant.INFO.NVF,
          };
      }
    }) as unknown as Record<string, number | string>[];

    return {
      grid: {
        right: '7%',
      },
      tooltip: {
        trigger: 'item',
        triggerOn: 'click',
        enterable: true,
        backgroundColor: '#000',
        textStyle: {
          color: '#fff',
        },
        formatter: (params) => {
          if (Array.isArray(params)) return '';
          const {
            CHROM,
            QUAL,
            POS,
            REF,
            ALT,
            INFO: {
              TYPE,
              NVF,
              SGVEP: {
                gene,
                geneStrand,
                txName,
                exonRank,
                cDNA,
                protein,
                codingConsequence,
              },
            },
          } = get(params.data, 'data') as unknown as VCFVariant;
          const DBXREF: VCFVariant['INFO']['DBXREF'] = get(
            params.data,
            ['data', 'INFO', 'DBXREF'],
            []
          );
          return (
            `<span style="display: flex;"><span style="padding-right: 10px; color: rgb(148 163 184);">CHROM:</span><span style="margin-left: auto;"><b>${CHROM}</b></span></span>` +
            `<span style="display: flex;"><span style="padding-right: 10px; color: rgb(148 163 184);">TYPE:</span><span style="margin-left: auto;"><b>${TYPE}</b></span></span>` +
            `<span style="display: flex;"><span style="padding-right: 10px; color: rgb(148 163 184);">QUAL:</span><span style="margin-left: auto;"><b>${QUAL}</b></span></span>` +
            `<span style="display: flex;"><span style="padding-right: 10px; color: rgb(148 163 184);">POS:</span><span style="margin-left: auto;"><b>${POS}</b></span></span>` +
            `<span style="display: flex;"><span style="padding-right: 10px; color: rgb(148 163 184);">REF:</span><span style="margin-left: auto;"><b>${REF}</b></span></span>` +
            `<span style="display: flex;"><span style="padding-right: 10px; color: rgb(148 163 184);">ALT:</span><span style="margin-left: auto;"><b>${ALT}</b></span></span>` +
            `<span style="display: flex;"><span style="padding-right: 10px; color: rgb(148 163 184);">NVF:</span><span style="margin-left: auto;"><b>${NVF}</b></span></span>` +
            `<span style="color: rgb(148 163 184);">SGVEP:</span><br/><span style="font-size: 0.85em;">${[
              gene,
              geneStrand,
              txName,
              exonRank,
              cDNA,
              protein,
              codingConsequence,
            ].join(' | ')}</span><br/>` +
            `<span style="color: rgb(148 163 184);">DBXREF:</span><br/>${DBXREF.map(
              (dbRef) =>
                '<span style="font-size: 0.85em; margin-right: 20px">' +
                dbRef.join(' : ') +
                '</span>'
            ).join('<br/>')}`
          );
        },
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            show: true,
            name: 'variants_per_chromosome',
            backgroundColor: 'rgba(0,0,0,0)',
          },
        },
        iconStyle: {
          borderColor: '#fff',
        },
        emphasis: {
          iconStyle: {
            borderColor: '#666',
            textFill: '#fff',
          },
        },
      },
      dataset: {
        dimensions: [
          'Chromosome',
          'Xjit',
          'data',
          yAxisType === 'NULL' ? 'Yval' : yAxisType,
        ],
        source: dataSource,
      },
      xAxis: [
        {
          data: Object.keys(chromosomeInfoRecord),
          splitLine: { show: true, interval: 0 },
          name: 'Chromosomes',
          nameGap: 30,
          nameLocation: 'middle',
          nameTextStyle: {
            color: '#fff',
          },
          axisLabel: {
            color: '#fff',
            interval: 0,
            hideOverlap: true,
          },
        },
        {
          type: 'value',
          min: 0.5,
          max: 24.5,
          axisLabel: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
        },
      ],
      yAxis: {
        show: yAxisType !== 'NULL',
        splitLine: { show: false },
        name: yAxisType === 'NULL' ? '' : yAxisType,
        nameTextStyle: {
          color: '#fff',
        },
        axisLabel: {
          color: '#fff',
        },
      },
      series: [
        {
          type: 'scatter',
          symbolSize: 9,
          xAxisIndex: 1,
          encode: { x: 'Xjit', y: yAxisType === 'NULL' ? 'Yval' : yAxisType },
          itemStyle: {
            color: (params) => {
              return colorConsequence
                ? colorPerConsequence[
                    get(
                      params.data,
                      ['data', 'INFO', 'SGVEP', 'codingConsequence'],
                      'missense'
                    ) as CodingConsequence
                  ]
                : colorPerChromosome[get(params.data, 'Chromosome', '1')];
            },
          },
        },
      ],
    };
  }, [applyFilters, colorConsequence, value?.vcfData, yAxisType]);

  return (
    <ReactEChartsCore echarts={echarts} option={option} lazyUpdate notMerge />
  );
};
