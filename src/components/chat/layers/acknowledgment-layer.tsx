"use client";

import { Heart } from "lucide-react";

interface AcknowledgmentLayerProps {
  text: string;
}

export function AcknowledgmentLayer({ text }: AcknowledgmentLayerProps) {
  return (
    <div className="rounded-lg border-l-4 border-saffron bg-saffron/5 p-4">
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-1">
          <Heart className="h-5 w-5 text-saffron" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-saffron mb-2 uppercase tracking-wide">
            Understanding
          </p>
          <p className="text-sm text-foreground leading-relaxed">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
