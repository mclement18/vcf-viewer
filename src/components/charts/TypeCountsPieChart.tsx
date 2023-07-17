import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import {
  LegendComponent,
  TooltipComponent,
  DatasetComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

import type { PieSeriesOption } from 'echarts/charts';
import type {
  LegendComponentOption,
  TooltipComponentOption,
  DatasetComponentOption,
} from 'echarts/components';
import type { ComposeOption } from 'echarts/core';
import { useMemo } from 'react';
import { useVCFContext } from '@/hooks/useVCFContext';

echarts.use([
  PieChart,
  LegendComponent,
  TooltipComponent,
  DatasetComponent,
  CanvasRenderer,
]);

type ECOption = ComposeOption<
  | PieSeriesOption
  | LegendComponentOption
  | TooltipComponentOption
  | DatasetComponentOption
>;

type TypeCountsPieChartProps = {
  applyFilters: boolean;
};

export const TypeCountsPieChart = ({
  applyFilters,
}: TypeCountsPieChartProps) => {
  const { value } = useVCFContext();

  const option = useMemo<ECOption>(() => {
    let snpCounts = 0;
    let indelCounts = 0;
    if (value) {
      const { SNP, INDEL } = value.vcfStats.variantType;
      snpCounts = applyFilters ? SNP.pass : SNP.pass + SNP.fail;
      indelCounts = applyFilters ? INDEL.pass : INDEL.pass + INDEL.fail;
    }

    return {
      tooltip: {
        trigger: 'item',
        backgroundColor: '#000',
        textStyle: {
          color: '#fff',
        },
      },
      legend: {
        left: 'center',
        textStyle: {
          color: '#fff',
        },
      },
      dataset: {
        source: [
          { Variants: 'SNP', value: snpCounts },
          {
            Variants: 'INDEL',
            value: indelCounts,
          },
        ],
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          itemStyle: {
            borderRadius: 10,
            borderColor: '#000',
            borderWidth: 2,
          },
          label: {
            show: false,
          },
        },
      ],
    };
  }, [applyFilters, value]);

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      style={{ height: '200px' }}
      lazyUpdate
      notMerge
    />
  );
};
