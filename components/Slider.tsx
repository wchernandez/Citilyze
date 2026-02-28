import { memo } from 'react';

interface SliderProps {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
}

/**
 * Reusable slider component for numeric input.
 */
const Slider = memo(function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
}: SliderProps) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        className="w-full cursor-pointer"
      />
      <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">
        {value}
      </span>
    </div>
  );
});

export default Slider;
