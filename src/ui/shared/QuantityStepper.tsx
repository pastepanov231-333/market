type Props = {
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
  compact?: boolean;
};

export function QuantityStepper({ value, onIncrease, onDecrease, compact }: Props) {
  if (value <= 0) {
    return (
      <button
        onClick={onIncrease}
        className={`${
          compact ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"
        } rounded-xl bg-[var(--fresh-green)] text-white font-semibold`}
      >
        +
      </button>
    );
  }

  return (
    <div className={`flex items-center ${compact ? "gap-1.5" : "gap-2"}`}>
      <button
        onClick={onDecrease}
        className={`${
          compact ? "w-6 h-6 text-xs" : "w-7 h-7 text-sm"
        } rounded-lg bg-gray-100 text-gray-700 font-semibold`}
      >
        -
      </button>
      <span className={`${compact ? "min-w-4 text-xs" : "min-w-5 text-sm"} text-center font-semibold`}>
        {value}
      </span>
      <button
        onClick={onIncrease}
        className={`${
          compact ? "w-6 h-6 text-xs" : "w-7 h-7 text-sm"
        } rounded-lg bg-[var(--fresh-green)] text-white font-semibold`}
      >
        +
      </button>
    </div>
  );
}

