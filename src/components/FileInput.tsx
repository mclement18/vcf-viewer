'use client';
import { VCFChromosomRecord, VCFStats } from '@/types/vcf';
import { ChangeEventHandler, useEffect, useRef, useState } from 'react';
import { LoadingModal } from './LoadingModal';
import { useVCFContext } from '@/hooks/useVCFContext';

export const FileInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | undefined>();
  const [loading, setLoading] = useState(false);

  const { setContext, value } = useVCFContext();

  const onClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.currentTarget.files) {
      setLoading(true);
      setFile(e.currentTarget.files[0]);
    }
  };

  useEffect(() => {
    const worker = new Worker(
      new URL('../workers/parse_vcf.worker.ts', import.meta.url)
    );
    worker.onmessage = (e: MessageEvent<[VCFChromosomRecord, VCFStats]>) => {
      setLoading(false);
      const [vcfData, vcfStats] = e.data;
      setContext({ vcfData, vcfStats, filename: file?.name });
    };
    if (file) {
      worker.postMessage(file);
    }
    return () => worker.terminate();
  }, [file, setContext]);

  return (
    <>
      <div className="flex items-center">
        <input
          ref={inputRef}
          type="file"
          accept=".vcf"
          onChange={onChange}
          className="hidden"
        />
        <p className="mr-3 italic text-sm">
          {file?.name || value?.filename || 'Upload a VCF file'}
        </p>
        <button
          type="button"
          onClick={onClick}
          className="rounded-full p-2 hover:bg-slate-800 active:bg-slate-600"
        >
          <svg viewBox="0 -2 30 30" className="h-5 w-5">
            <title>Upload</title>
            <desc>Created with Sketch Beta.</desc>
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g
                transform="translate(-571.000000, -676.000000)"
                className="fill-slate-400"
              >
                <path d="M599,692 C597.896,692 597,692.896 597,694 L597,698 L575,698 L575,694 C575,692.896 574.104,692 573,692 C571.896,692 571,692.896 571,694 L571,701 C571,701.479 571.521,702 572,702 L600,702 C600.604,702 601,701.542 601,701 L601,694 C601,692.896 600.104,692 599,692 L599,692 Z M582,684 L584,684 L584,693 C584,694.104 584.896,695 586,695 C587.104,695 588,694.104 588,693 L588,684 L590,684 C590.704,684 591.326,684.095 591.719,683.7 C592.11,683.307 592.11,682.668 591.719,682.274 L586.776,676.283 C586.566,676.073 586.289,675.983 586.016,675.998 C585.742,675.983 585.465,676.073 585.256,676.283 L580.313,682.274 C579.921,682.668 579.921,683.307 580.313,683.7 C580.705,684.095 581.608,684 582,684 L582,684 Z"></path>
              </g>
            </g>
          </svg>
        </button>
      </div>
      <LoadingModal open={loading} title="Loading file..." />
    </>
  );
};
