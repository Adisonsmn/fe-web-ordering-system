import { cn } from '@shared/utils/cn';
import type { FC } from 'react';

interface AvailabilityToggleProps {
  menuId: string;
  isAvailable: boolean;
  onToggle: (menuId: string, newValue: boolean) => void;
  isLoading?: boolean;
}

export const AvailabilityToggle: FC<AvailabilityToggleProps> = ({
  menuId,
  isAvailable,
  onToggle,
  isLoading = false,
}) => {
  const handleChange = () => {
    if (!isLoading) {
      onToggle(menuId, !isAvailable);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isAvailable}
      onClick={handleChange}
      disabled={isLoading}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-muted focus:ring-offset-1',
        isAvailable ? 'bg-teal-muted' : 'bg-slate-dark/20',
        isLoading && 'opacity-60 cursor-not-allowed',
      )}
    >
      <span className="sr-only">{isAvailable ? 'Tersedia' : 'Habis'}</span>
      <span
        className={cn(
          'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out',
          isAvailable ? 'translate-x-6' : 'translate-x-1',
        )}
      />
    </button>
  );
};
