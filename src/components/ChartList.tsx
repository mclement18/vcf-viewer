import { useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import { RadioButton } from './RadioButton';
import { ChartWidget } from './ChartWidget';
import { wrapGrid } from 'animate-css-grid';

const gridLayouts = ['grid-cols-1', 'grid-cols-2', 'grid-cols-3'] as const;

type GridLayout = (typeof gridLayouts)[number];

export const ChartList = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridLayout, setGridLayout] = useState<GridLayout>('grid-cols-1');
  const [chartNb, setChartNb] = useState(1);

  const addChart = () => setChartNb((nb) => nb + 1);

  const removeChart = () => setChartNb((nb) => (nb === 1 ? nb : nb - 1));

  useEffect(() => {
    let unwrap: () => void;
    if (gridRef.current) {
      const { unwrapGrid } = wrapGrid(gridRef.current, {
        easing: 'backOut',
        duration: 400,
      });
      unwrap = unwrapGrid;
    }

    return () => {
      if (unwrap) {
        unwrap();
      }
    };
  }, []);

  return (
    <div className="p-5 mb-6 rounded-lg border border-slate-700">
      <div className="w-full mb-6 flex">
        <RadioButton<GridLayout>
          options={[
            {
              value: 'grid-cols-1',
              label: (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <title>One Column</title>
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M5 3m0 1a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v16a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1z" />
                </svg>
              ),
            },
            {
              value: 'grid-cols-2',
              label: (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <title>Two Columns</title>
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M3 3m0 1a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v16a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1zm9 -1v18" />
                </svg>
              ),
            },
            {
              value: 'grid-cols-3',
              label: (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <title>Three Columns</title>
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M3 3m0 1a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v16a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1zm6 -1v18m6 -18v18" />
                </svg>
              ),
            },
          ]}
          value={gridLayout}
          onChange={setGridLayout}
        />
        <div className="ml-auto">
          <Button onClick={addChart}>ADD CHART</Button>
          <Button onClick={removeChart} disabled={chartNb <= 1}>
            REMOVE CHART
          </Button>
        </div>
      </div>
      <div ref={gridRef} className={`grid gap-1 ${gridLayout}`}>
        {Array(chartNb)
          .fill(0)
          .map((_, idx) => (
            <ChartWidget key={`chart-${idx}`} />
          ))}
      </div>
    </div>
  );
};
