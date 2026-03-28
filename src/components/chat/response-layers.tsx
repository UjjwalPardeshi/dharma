"use client";

import type { ResponseFramework, Citation } from "@/types";
import { AcknowledgmentLayer } from "./layers/acknowledgment-layer";
import { MythologicalLayer } from "./layers/mythological-layer";
import { PracticalLayer } from "./layers/practical-layer";
import { LessonLayer } from "./layers/lesson-layer";

interface ResponseLayersProps {
  framework: ResponseFramework;
  citations: Citation[] | null;
}

export function ResponseLayers({
  framework,
  citations,
}: ResponseLayersProps) {
  return (
    <div className="max-w-2xl space-y-4">
      {/* Layer 1: Acknowledgment */}
      <div className="animate-in fade-in duration-500" style={{ animationDelay: "0ms" }}>
        <AcknowledgmentLayer text={framework.empatheticAcknowledgment} />
      </div>

      {/* Layer 2: Mythological */}
      <div className="animate-in fade-in duration-500" style={{ animationDelay: "150ms" }}>
        <MythologicalLayer
          story={framework.mythologicalParallel.story}
          lesson={framework.mythologicalParallel.lesson}
          citations={citations}
        />
      </div>

      {/* Layer 3: Practical */}
      <div className="animate-in fade-in duration-500" style={{ animationDelay: "300ms" }}>
        <PracticalLayer steps={framework.practicalGuidance} />
      </div>

      {/* Layer 4: Life Lesson */}
      <div className="animate-in fade-in duration-500" style={{ animationDelay: "450ms" }}>
        <LessonLayer text={framework.lifeLesson} />
      </div>
    </div>
  );
}
