import { Switch as HLUISwitch } from '@headlessui/react';
import { useMemo, useState } from 'react';

type SwitchProps = {
  label: string;
  enabled?: boolean;
  defaultValue?: boolean;
  onChange?: (checked: boolean) => void;
};

export const Switch = ({
  label,
  enabled,
  defaultValue,
  onChange,
}: SwitchProps) => {
  const [localEnabled, setLocalEnabled] = useState(
    defaultValue === undefined ? false : defaultValue
  );

  const onToggle = (checked: boolean) => {
    setLocalEnabled(checked);
    if (onChange) {
      onChange(checked);
    }
  };

  const checked = useMemo(
    () => (enabled === undefined ? localEnabled : enabled),
    [enabled, localEnabled]
  );

  return (
    <HLUISwitch.Group>
      <div className="flex items-center">
        <HLUISwitch.Label className="mr-2 text-sm">{label}</HLUISwitch.Label>
        <HLUISwitch
          checked={checked}
          onChange={onToggle}
          className={`${
            checked ? 'bg-sky-600' : 'bg-slate-700'
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
        >
          <span
            className={`${
              checked ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-slate-800 transition-transform`}
          />
        </HLUISwitch>
      </div>
    </HLUISwitch.Group>
  );
};
