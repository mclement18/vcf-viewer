import { Popover, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { Switch } from './Switch';
import { RadioButton } from './RadioButton';
import { Select, SelectOption } from './Select';
import {
  VariantsPerChromosomeChart,
  YAxisType,
} from './charts/VariantsPerChromosomeChart';
import {
  CountMethod,
  CountsPerChromosomeChart,
} from './charts/CountsPerChromosomeChart';

type ChartType = 'variants' | 'counts';

const chartTypeOptions: SelectOption<ChartType>[] = [
  {
    value: 'variants',
    label: 'Variants per Chromosome',
  },
  {
    value: 'counts',
    label: 'Variant Counts per Chromosome',
  },
];

export const ChartWidget = () => {
  const [chartType, setChartType] = useState<SelectOption<ChartType>>(
    chartTypeOptions[0]
  );
  const [applyFilters, setApplyFilters] = useState(false);
  const [colorConsequence, setColorConsequence] = useState(false);
  const [yAxisType, setYAXisType] = useState<YAxisType>('NULL');
  const [countMethod, setCountMethod] = useState<CountMethod>('RAW');
  const [splitType, setSplitType] = useState(false);

  return (
    <div>
      <div>
        <div className="w-full flex mb-1">
          <Select<ChartType>
            options={chartTypeOptions}
            selected={chartType}
            onChange={setChartType}
          />
          <Popover className="relative ml-auto">
            <Popover.Button className="relative p-2 z-0 rounded-full hover:bg-slate-800 active:bg-slate-600">
              <svg
                className="w-6 h-6 stroke-slate-400"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
                <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
              </svg>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Popover.Panel className="absolute z-40 -translate-x-[260px]">
                <div className="relative z-40 p-5 min-w-[300px] bg-black border border-slate-700 rounded-md">
                  <div className="mb-4">
                    <Switch
                      label="Apply passing filters"
                      enabled={applyFilters}
                      onChange={setApplyFilters}
                    />
                  </div>
                  {chartType.value === 'variants' ? (
                    <>
                      <div className="mb-4">
                        <Switch
                          label="Color Coding Consequence"
                          enabled={colorConsequence}
                          onChange={setColorConsequence}
                        />
                      </div>
                      <div>
                        <p className="text-sm mb-2">Y Axis Type</p>
                        <RadioButton<YAxisType>
                          options={[
                            {
                              value: 'NULL',
                              label: <span title="No Y Axis">NULL</span>,
                            },
                            {
                              value: 'QUAL',
                              label: <span title="Variant Quality">QUAL</span>,
                            },
                            {
                              value: 'NVF',
                              label: (
                                <span title="Variant Allele Fraction">NVF</span>
                              ),
                            },
                          ]}
                          value={yAxisType}
                          onChange={setYAXisType}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mb-4">
                        <Switch
                          label="Split Variant Types"
                          enabled={splitType}
                          onChange={setSplitType}
                        />
                      </div>
                      <div>
                        <p className="text-sm mb-2">Count Method</p>
                        <RadioButton<CountMethod>
                          options={[
                            {
                              value: 'RAW',
                              label: <span title="Raw Variants">RAW</span>,
                            },
                            {
                              value: 'LEN',
                              label: (
                                <span title="Variants / Chromosome Length">
                                  LEN
                                </span>
                              ),
                            },
                            {
                              value: 'COD',
                              label: (
                                <span title="Variants / Chromosome Coding Regions Overall Length">
                                  COD
                                </span>
                              ),
                            },
                            {
                              value: 'LENCOD',
                              label: (
                                <span title="Variants / (Chromosome Length * Chromosome Coding Regions Overall Length)">
                                  LENCOD
                                </span>
                              ),
                            },
                          ]}
                          value={countMethod}
                          onChange={setCountMethod}
                        />
                      </div>
                    </>
                  )}
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>
        </div>
        {chartType.value === 'variants' ? (
          <VariantsPerChromosomeChart
            applyFilters={applyFilters}
            colorConsequence={colorConsequence}
            yAxisType={yAxisType}
          />
        ) : (
          <CountsPerChromosomeChart
            applyFilters={applyFilters}
            countMethod={countMethod}
            splitType={splitType}
          />
        )}
      </div>
    </div>
  );
};
