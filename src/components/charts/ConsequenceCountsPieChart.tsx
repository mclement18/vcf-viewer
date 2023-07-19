import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  DatasetComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

import type { PieSeriesOption } from 'echarts/charts';
import type {
  TitleComponentOption,
  TooltipComponentOption,
  DatasetComponentOption,
} from 'echarts/components';
import type { ComposeOption } from 'echarts/core';
import { useMemo } from 'react';
import { useVCFContext } from '@/hooks/useVCFContext';
import map from 'lodash/map';
import { CODING_CONSEQUENCE } from '@/constants/coding_consequences';

echarts.use([
  PieChart,
  TitleComponent,
  TooltipComponent,
  DatasetComponent,
  CanvasRenderer,
]);

type ECOption = ComposeOption<
  | PieSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | DatasetComponentOption
>;

type ConsequenceCountsPieChartProps = {
  applyFilters: boolean;
};

export const ConsequenceCountsPieChart = ({
  applyFilters,
}: ConsequenceCountsPieChartProps) => {
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
      title: {
        text: 'Coding Consequences',
        left: 'center',
        textStyle: {
          color: '#fff',
          fontSize: '0.9rem',
          fontWeight: 'normal',
        },
      },
      dataset: {
        source: map(CODING_CONSEQUENCE, (consequence) => {
          let counts = 0;
          if (value) {
            const pass = value.vcfStats.variantConsequence.pass[consequence];
            const fail = value.vcfStats.variantConsequence.fail[consequence];
            counts = applyFilters ? pass : pass + fail;
          }
          return {
            Variants: consequence,
            value: counts,
          };
        }),
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
    [applyFilters, value]
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
