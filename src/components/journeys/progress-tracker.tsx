"use client";

interface ProgressTrackerProps {
  currentDay: number;
  totalDays: number;
}

export function ProgressTracker({ currentDay, totalDays }: ProgressTrackerProps) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({ length: totalDays }).map((_, idx) => {
        const dayNum = idx + 1;
        const isComplete = dayNum < currentDay;
        const isCurrent = dayNum === currentDay;

        return (
          <div
            key={dayNum}
            className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
              isCurrent
                ? "bg-saffron text-white ring-2 ring-saffron ring-offset-2"
                : isComplete
                  ? "bg-saffron/30 text-saffron"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {dayNum}
          </div>
        );
      })}
    </div>
  );
}
