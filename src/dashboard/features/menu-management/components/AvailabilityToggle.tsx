import { cn } from '@shared/utils/cn';
import type { ChangeEvent, FC } from 'react';

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
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (!isLoading) {
      onToggle(menuId, e.target.value === 'true');
    }
  };

  return (
    <select
      value={isAvailable ? 'true' : 'false'}
      onChange={handleChange}
      onClick={(e) => e.stopPropagation()}
      disabled={isLoading}
      className={cn(
        'bg-white border border-slate-dark/20 rounded-md px-3 py-1.5 text-[13px] text-slate-dark outline-none cursor-pointer focus:border-teal-muted focus:ring-1 focus:ring-teal-muted transition-colors',
        isLoading && 'opacity-60 cursor-not-allowed',
      )}
    >
      <option value="true">Tersedia</option>
      <option value="false">Tidak Tersedia</option>
    </select>
  );
};
