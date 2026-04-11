type Props = {
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
};

export function QuantityStepper({ value, onIncrease, onDecrease }: Props) {
  if (value <= 0) {
    return (
      <button
        onClick={onIncrease}
        className="px-3 py-1.5 rounded-xl bg-[var(--fresh-green)] text-white text-sm font-semibold"
      >
        +
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onDecrease}
        className="w-7 h-7 rounded-lg bg-gray-100 text-gray-700 text-sm font-semibold"
      >
        -
      </button>
      <span className="min-w-5 text-center text-sm font-semibold">{value}</span>
      <button
        onClick={onIncrease}
        className="w-7 h-7 rounded-lg bg-[var(--fresh-green)] text-white text-sm font-semibold"
      >
        +
      </button>
    </div>
  );
}

