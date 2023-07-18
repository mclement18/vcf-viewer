import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export type SelectOption<T> = {
  value: T;
  label: string;
};

type SelectProps<T> = {
  options: SelectOption<T>[];
  selected: SelectOption<T>;
  onChange: (option: SelectOption<T>) => void;
};

export const Select = <T,>({ options, selected, onChange }: SelectProps<T>) => {
  return (
    <Listbox value={selected} onChange={onChange}>
      <div className="relative">
        <Listbox.Button className="flex items-center min-w-[300px] pl-3 pr-1 py-2 border border-slate-700 rounded-lg">
          <span className="mr-2">{selected.label}</span>
          <span className="ml-auto">
            <svg
              className="h-5 w-5 fill-slate-400"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-2 py-3 w-full rounded-lg border border-slate-700 bg-black">
            {options.map((option) => (
              <Listbox.Option
                key={option.label}
                value={option}
                className={({ selected }) =>
                  `px-3 py-2 text-slate-400 hover:bg-slate-800 cursor-pointer ${
                    selected ? 'bg-slate-700 text-slate-300' : ''
                  }`
                }
              >
                {option.label}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};
