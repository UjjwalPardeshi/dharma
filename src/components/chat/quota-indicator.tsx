"use client";

interface QuotaIndicatorProps {
  used: number;
  limit: number;
}

export function QuotaIndicator({ used, limit }: QuotaIndicatorProps) {
  const percentage = (used / limit) * 100;
  const remaining = limit - used;

  return (
    <div className="mt-3 text-xs text-muted-foreground">
      <p className="mb-1.5">
        Consultations: <span className="font-semibold">{used} of {limit}</span> used
      </p>
      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-saffron transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {remaining > 0 && (
        <p className="mt-1.5 text-muted-foreground">
          {remaining} {remaining === 1 ? "consultation" : "consultations"} remaining
        </p>
      )}
    </div>
  );
}
