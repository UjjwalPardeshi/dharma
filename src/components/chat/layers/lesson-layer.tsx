"use client";

import { Lightbulb } from "lucide-react";

interface LessonLayerProps {
  text: string;
}

export function LessonLayer({ text }: LessonLayerProps) {
  return (
    <div className="rounded-lg border-l-4 border-saffron bg-gradient-to-r from-saffron/5 to-yellow-400/5 p-4">
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-1">
          <Lightbulb className="h-5 w-5 text-saffron" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-saffron mb-2 uppercase tracking-wide">
            Life Lesson
          </p>
          <p className="text-sm italic leading-relaxed text-foreground">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
