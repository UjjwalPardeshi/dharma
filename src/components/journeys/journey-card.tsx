"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Journey } from "@/types";
import { Calendar, BookOpen } from "lucide-react";

interface JourneyCardProps {
  journey: Journey;
  isInProgress?: boolean;
  onStartClick: () => void;
  onContinueClick?: () => void;
}

export function JourneyCard({
  journey,
  isInProgress = false,
  onStartClick,
  onContinueClick,
}: JourneyCardProps) {
  return (
    <div className="bg-white border border-border rounded-lg p-5 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-display text-saffron flex-1">{journey.title}</h3>
        {journey.isPremium && (
          <Badge className="bg-saffron text-white ml-2">Premium</Badge>
        )}
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {journey.description}
      </p>

      <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{journey.durationDays} days</span>
        </div>
        <div className="flex items-center gap-1">
          <BookOpen className="w-4 h-4" />
          <span className="capitalize">{journey.tradition}</span>
        </div>
      </div>

      <p className="text-xs bg-parchment px-2 py-1 rounded mb-4 inline-block">
        Theme: {journey.theme}
      </p>

      <Button
        onClick={isInProgress ? onContinueClick : onStartClick}
        className="w-full bg-saffron text-white hover:bg-saffron/90"
      >
        {isInProgress ? "Continue Journey" : "Start Journey"}
      </Button>
    </div>
  );
}
