"use client";

import { Compass } from "lucide-react";

interface PracticalLayerProps {
  steps: string[];
}

export function PracticalLayer({ steps }: PracticalLayerProps) {
  return (
    <div className="rounded-lg border-l-4 border-orange-700 bg-orange-700/5 p-4">
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-1">
          <Compass className="h-5 w-5 text-orange-700" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-orange-700 mb-3 uppercase tracking-wide">
            Practical Steps
          </p>

          <ol className="space-y-2">
            {steps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-orange-700/20 text-xs font-semibold text-orange-700">
                  {index + 1}
                </span>
                <span className="flex-1 text-sm text-foreground leading-relaxed pt-0.5">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
