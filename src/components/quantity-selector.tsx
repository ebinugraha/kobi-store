import { useState } from "react";

interface QuantitySelectorProps {
  min?: number;
  max?: number;
  initial: number;
  onChange?: (value: number) => void;
}

export const QuantitySelector = ({
  min = 1,
  max = 99,
  initial = 1,
  onChange,
}: QuantitySelectorProps) => {
  const [value, setValue] = useState(initial);

  const handleDecrease = () => {
    if (value > min) {
      const newValue = value - 1;
      setValue(newValue);
      onChange?.(newValue);
    }
  };
  const handleIncrease = () => {
    if (value < max) {
      const newValue = value + 1;
      setValue(newValue);
      onChange?.(newValue);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center border rounded-lg overflow-hidden">
        <button
          className="px-3 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          onClick={handleDecrease}
          disabled={value === min}
        >
          −
        </button>
        <div className="px-4 py-1 text-gray-700">{value}</div>
        <button
          className="px-3 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          onClick={handleIncrease}
          disabled={value === max}
        >
          +
        </button>
      </div>
    </div>
  );
};
