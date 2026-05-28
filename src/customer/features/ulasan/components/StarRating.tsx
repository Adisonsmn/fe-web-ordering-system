import { cn } from '@shared/utils/cn';
import { Star } from 'lucide-react';
import type { FC } from 'react';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

const StarRating: FC<StarRatingProps> = ({ value, onChange, size = 'md', readonly = false }) => {
  const stars = [1, 2, 3, 4, 5];

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange && onChange(star)}
          className={cn(
            'flex items-center justify-center transition-colors',
            readonly ? 'cursor-default' : 'cursor-pointer',
          )}
        >
          <Star
            className={cn(
              sizeClasses[size],
              star <= value
                ? 'fill-[#ffdba0] text-[#ffdba0]' // Figma design token equivalent for star gold
                : 'fill-slate-dark/10 text-slate-dark/10', // Empty star
            )}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
