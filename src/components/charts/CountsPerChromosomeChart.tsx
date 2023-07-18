import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  TooltipComponent,
  DatasetComponent,
} from 'echarts/components';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

import type { BarSeriesOption, LineSeriesOption } from 'echarts/charts';
import type {
  GridComponentOption,
  LegendComponentOption,
  ToolboxComponentOption,
  TooltipComponentOption,
  DatasetComponentOption,
} from 'echarts/components';
import type { ComposeOption } from 'echarts/core';
import { useCallback, useMemo } from 'react';
import { useVCFContext } from '@/hooks/useVCFContext';
import map from 'lodash/map';
import {
  averageGeneLength,
  chromosomeInfoRecord,
  chromosomeMedianLength,
} from '@/constants/chromosome_info';

echarts.use([
  BarChart,
  LineChart,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  TooltipComponent,
  DatasetComponent,
  UniversalTransition,
  CanvasRenderer,
]);

type ECOption = ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | GridComponentOption
  | LegendComponentOption
  | ToolboxComponentOption
  | TooltipComponentOption
  | DatasetComponentOption
>;

export type CountMethod = 'RAW' | 'LEN' | 'COD' | 'LENCOD';

const yAxisNamePerCountMethod: Record<CountMethod, string> = {
  RAW: 'Variants (n)',
  LEN: 'Variants (n) / Chromosome Length',
  COD: 'Variants (n) / \nChromosome Coding \nRegions Overall Length',
  LENCOD:
    'Variants (n) / \nChromosome Length * \nChromosome Coding \nRegions Overall Length',
};

type CountsPerChromosomeChartProps = {
  applyFilters: boolean;
  countMethod: CountMethod;
  splitType: boolean;
};

export const CountsPerChromosomeChart = ({
  applyFilters,
  countMethod,
  splitType,
}: CountsPerChromosomeChartProps) => {
  const { value } = useVCFContext();

  const normalizeCounts = useCallback(
    (chromosome: string, counts: number) => {
      const { length, geneNb } = chromosomeInfoRecord[chromosome];
      switch (countMethod) {
        case 'RAW':
          return counts;
        case 'LEN':
          return counts / (length / chromosomeMedianLength);
        case 'COD':
          return counts / (length / (geneNb * averageGeneLength));
        case 'LENCOD':
          return (
            (counts / (length / chromosomeMedianLength)) *
            (length / (geneNb * averageGeneLength))
          );
      }
    },
    [countMethod]
  );

  const option = useMemo<ECOption>(() => {
    const dataSource = map(
      value?.vcfStats.variantPerChromosome,
      (stats, chromosome) => {
        return splitType
          ? {
              Chromosome: chromosome,
              SNP: applyFilters
                ? normalizeCounts(chromosome, stats.pass.SNP.total)
                : normalizeCounts(
                    chromosome,
                    stats.pass.SNP.total + stats.fail.SNP.total
                  ),
              INDEL: applyFilters
                ? normalizeCounts(chromosome, stats.pass.INDEL.total)
                : normalizeCounts(
                    chromosome,
                    stats.pass.INDEL.total + stats.fail.INDEL.total
                  ),
            }
          : {
              Chromosome: chromosome,
              Variants: applyFilters
                ? normalizeCounts(chromosome, stats.pass.total)
                : normalizeCounts(
                    chromosome,
                    stats.pass.total + stats.fail.total
                  ),
            };
      }
    ) as unknown as Record<string, string | number>[];

    const dimensions = splitType
      ? ['Chromosome', 'SNP', 'INDEL']
      : ['Chromosome', 'Variants'];

    return {
      grid: {
        top: 80,
        right: '7%',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        backgroundColor: '#000',
        textStyle: {
          color: '#fff',
        },
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        feature: {
          saveAsImage: { show: true, name: 'counts_per_chromosome' },
          magicType: { show: true, type: ['bar', 'line'] },
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
      legend: {
        show: splitType,
        textStyle: {
          color: '#fff',
        },
      },
      dataset: {
        dimensions,
        source: dataSource,
      },
      xAxis: {
        type: 'category',
        name: 'Chromosomes',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          color: '#fff',
        },
        axisLabel: {
          color: '#fff',
        },
      },
      yAxis: {
        type: 'value',
        name: yAxisNamePerCountMethod[countMethod],
        nameTextStyle: {
          color: '#fff',
        },
        axisLabel: {
          color: '#fff',
        },
      },
      series: [
        {
          type: 'bar',
          emphasis: {
            focus: 'series',
          },
        },
        splitType
          ? {
              type: 'bar',
              emphasis: {
                focus: 'series',
              },
            }
          : {},
      ],
    };
  }, [
    applyFilters,
    countMethod,
    normalizeCounts,
    splitType,
    value?.vcfStats.variantPerChromosome,
  ]);

  return (
    <ReactEChartsCore echarts={echarts} option={option} lazyUpdate notMerge />
  );
};
