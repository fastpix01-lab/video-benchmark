interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  highlight?: boolean;
}

export default function MetricCard({ label, value, unit, highlight }: MetricCardProps) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        highlight
          ? "border-blue-500/50 bg-blue-50 dark:bg-blue-950/30"
          : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
      }`}
    >
      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        {value}
        {unit && (
          <span className="ml-1 text-sm font-normal text-zinc-500 dark:text-zinc-400">
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}
