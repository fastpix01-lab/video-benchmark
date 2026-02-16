interface RankBadgeProps {
  rank: number;
}

const COLORS: Record<number, { bg: string; text: string; label: string }> = {
  1: { bg: "bg-amber-100 dark:bg-amber-900/40", text: "text-amber-700 dark:text-amber-300", label: "1st" },
  2: { bg: "bg-zinc-100 dark:bg-zinc-800", text: "text-zinc-600 dark:text-zinc-300", label: "2nd" },
  3: { bg: "bg-orange-100 dark:bg-orange-900/40", text: "text-orange-700 dark:text-orange-300", label: "3rd" },
};

export default function RankBadge({ rank }: RankBadgeProps) {
  const style = COLORS[rank];
  if (!style) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
        {rank}th
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  );
}
