interface Props {
  score: number | null | undefined;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

// The recurring motif across OxyNews: a small gold arc instead of a star
// rating, because the number underneath is a computed opportunity signal,
// not a subjective rating.
export default function OpportunityMeter({
  score,
  size = 40,
  strokeWidth = 4,
  showLabel = true,
}: Props) {
  const value = Math.max(0, Math.min(100, score ?? 0));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // 270 degree arc (like a speedometer), starting at -225deg
  const arcFraction = 0.75;
  const dash = circumference * arcFraction;
  const progress = dash * (value / 100);

  return (
    <div className="flex items-center gap-2" title={`Opportunity score: ${value}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-[135deg] shrink-0"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E9E2D6"
          strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#D4AF37"
          strokeWidth={strokeWidth}
          strokeDasharray={`${progress} ${circumference}`}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {showLabel && (
        <span className="font-mono text-xs font-semibold text-plum tabular-nums">
          {value}
          <span className="text-ink-faint">/100</span>
        </span>
      )}
    </div>
  );
}
