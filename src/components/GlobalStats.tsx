import { useVCFContext } from '@/hooks/useVCFContext';
import { FileInput } from './FileInput';
import { Switch } from './Switch';
import { useState } from 'react';
import { FilteredCountsPieChart } from './charts/FilteredCountsPieChart';
import { TypeCountsPieChart } from './charts/TypeCountsPieChart';
import { ConsequenceCountsPieChart } from './charts/ConsequenceCountsPieChart';

export const GlobalStats = () => {
  const [applyFilters, setApplyFilters] = useState(false);

  const { value } = useVCFContext();

  return (
    <div className="mb-8 p-5 rounded-lg border border-slate-700">
      <div className="flex w-full mb-6">
        {/* switch for passing filters */}
        <Switch
          label="Apply passing filters"
          enabled={applyFilters}
          onChange={setApplyFilters}
        />
        <div className="ml-auto">
          <FileInput />
        </div>
      </div>
      <div className="grid grid-cols-4">
        <div className="flex flex-col items-center justify-center font-bold">
          <p className="text-slate-400 mb-6">TOTAL VARIANTS</p>
          <p className="text-xl">{value?.vcfStats.total}</p>
        </div>
        <FilteredCountsPieChart />
        <TypeCountsPieChart applyFilters={applyFilters} />
        <ConsequenceCountsPieChart applyFilters={applyFilters} />
      </div>
    </div>
  );
};
