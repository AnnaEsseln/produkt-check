type Props = {
  label: string;
  wert: number;
};

export default function ScoreBar({ label, wert }: Props) {
  const anteil = Math.max(0, Math.min(10, wert)) * 10;

  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-sm text-black/70">{label}</span>
      <div
        className="h-2 flex-1 overflow-hidden rounded-full bg-warmgrau"
        role="img"
        aria-label={`${label}: ${wert} von 10`}
      >
        <div
          className="h-full rounded-full bg-braun"
          style={{ width: `${anteil}%` }}
        />
      </div>
      <span className="w-6 shrink-0 text-right text-sm tabular-nums">
        {wert}
      </span>
    </div>
  );
}
