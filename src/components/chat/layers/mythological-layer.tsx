"use client";

import type { Citation } from "@/types";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MythologicalLayerProps {
  story: string;
  lesson: string;
  citations: Citation[] | null;
}

export function MythologicalLayer({
  story,
  lesson,
  citations,
}: MythologicalLayerProps) {
  return (
    <div className="rounded-lg border-l-4 border-indigo-500 bg-indigo-500/5 p-4">
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-1">
          <BookOpen className="h-5 w-5 text-indigo-500" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-indigo-500 mb-3 uppercase tracking-wide">
            Ancient Wisdom
          </p>

          <div className="space-y-3">
            {/* Story */}
            <div>
              <p className="text-sm text-foreground leading-relaxed">
                {story}
              </p>
            </div>

            {/* Lesson */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">
                The Lesson:
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                {lesson}
              </p>
            </div>

            {/* Citations */}
            {citations && citations.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-indigo-500/20">
                {citations.map((citation) => (
                  <Badge
                    key={citation.id}
                    variant="secondary"
                    className="text-xs"
                  >
                    {citation.scripture} {citation.verseNumber}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
