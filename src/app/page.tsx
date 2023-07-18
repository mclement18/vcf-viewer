'use client';
import { ChartList } from '@/components/ChartList';
import { FileInput } from '@/components/FileInput';
import { GlobalStats } from '@/components/GlobalStats';
import { useVCFContext } from '@/hooks/useVCFContext';

export default function Home() {
  const { value } = useVCFContext();

  return (
    <main className="min-h-screen">
      <div className="mx-auto p-2 md:p-0 md:max-w-screen-sm lg:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl">
        <h1 className="mt-5 mb-10 text-2xl font-bold italic text-center">
          VCF Viewer
        </h1>
        {value === null ? (
          <div className="max-w-lg mx-auto p-5 flex flex-col items-center rounded-lg border border-slate-700">
            <p className="text-lg mb-3">
              Welcome to <i>VCF Viewer</i> !
            </p>
            <p className="mb-6">
              A small tool to get some interactive summary visualisation of a{' '}
              <code className="text-slate-400">.vcf</code> file. Start by
              uploading a file to see what it can do!
            </p>
            <FileInput />
          </div>
        ) : (
          <>
            <GlobalStats />
            <ChartList />
          </>
        )}
      </div>
    </main>
  );
}
