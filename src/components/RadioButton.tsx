import { RadioGroup } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';
import { Button } from './Button';

export type RadioButtonOption<T> = {
  value: T;
  label?: ReactNode;
};

type RadioButtonProps<T> = {
  options: RadioButtonOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

export const RadioButton = <T,>({
  options,
  value,
  onChange,
}: RadioButtonProps<T>) => {
  return (
    <RadioGroup value={value} onChange={onChange}>
      {options.map(({ value: optionValue, label }, idx) => (
        <RadioGroup.Option
          key={
            label || typeof optionValue === 'string'
              ? `${optionValue}`
              : idx.toString()
          }
          value={optionValue}
          as={Fragment}
        >
          {({ checked }) => (
            <Button className={checked ? 'bg-slate-600 text-slate-800' : ''}>
              {label || (optionValue as string)}
            </Button>
          )}
        </RadioGroup.Option>
      ))}
    </RadioGroup>
  );
};
