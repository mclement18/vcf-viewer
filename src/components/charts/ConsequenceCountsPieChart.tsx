import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  DatasetComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

import type { PieSeriesOption } from 'echarts/charts';
import type {
  TitleComponentOption,
  ToolboxComponentOption,
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
  ToolboxComponent,
  TooltipComponent,
  DatasetComponent,
  CanvasRenderer,
]);

type ECOption = ComposeOption<
  | PieSeriesOption
  | TitleComponentOption
  | ToolboxComponentOption
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
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            show: true,
            name: 'total_counts_per_coding_consequence',
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
