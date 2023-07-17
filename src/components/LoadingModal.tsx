import { Dialog, Transition } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

type LoadingModalProps = {
  open: boolean;
  title?: ReactNode;
};

export const LoadingModal = ({ open, title }: LoadingModalProps) => (
  <Transition show={open} as={Fragment}>
    <Dialog className="relative z-50" onClose={() => {}}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className="fixed inset-0 bg-slate-100/25 backdrop-blur-sm"
          aria-hidden="true"
        />
      </Transition.Child>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded-lg p-10 bg-black">
            <Dialog.Title className="text-2xl font-bold mb-6">
              {title || 'Loading...'}
            </Dialog.Title>
            <div className="w-full flex justify-center">
              <LoadingSpinner />
            </div>
          </Dialog.Panel>
        </div>
      </Transition.Child>
    </Dialog>
  </Transition>
);
