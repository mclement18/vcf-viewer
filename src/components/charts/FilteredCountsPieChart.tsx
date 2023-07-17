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

export const FilteredCountsPieChart = () => {
  const { value } = useVCFContext();

  const option = useMemo<ECOption>(
    () => ({
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
          { Variants: 'Passing', value: value?.vcfStats.variantFiltered.pass },
          { Variants: 'Filtered', value: value?.vcfStats.variantFiltered.fail },
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
    }),
    [value?.vcfStats.variantFiltered.fail, value?.vcfStats.variantFiltered.pass]
  );

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
