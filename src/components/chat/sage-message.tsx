"use client";

import type { ResponseFramework, Citation } from "@/types";
import { Sparkles } from "lucide-react";
import { ResponseLayers } from "./response-layers";

interface SageMessageProps {
  content: string;
  responseJson: ResponseFramework | null;
  citations: Citation[] | null;
}

export function SageMessage({
  content,
  responseJson,
  citations,
}: SageMessageProps) {
  return (
    <div className="flex gap-3">
      {/* Sage avatar */}
      <div className="flex-shrink-0 mt-1">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-saffron/20">
          <Sparkles className="h-5 w-5 text-saffron" />
        </div>
      </div>

      {/* Message content */}
      <div className="flex-1 min-w-0">
        {responseJson ? (
          <ResponseLayers
            framework={responseJson}
            citations={citations}
          />
        ) : (
          <div className="max-w-2xl px-4 py-3 rounded-lg bg-muted text-foreground">
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {content}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
