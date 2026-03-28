"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface OverrelianceReminderProps {
  open: boolean;
  onDismiss: () => void;
}

export function OverrelianceReminder({ open, onDismiss }: OverrelianceReminderProps) {
  return (
    <Dialog open={open} onOpenChange={onDismiss}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-saffron">A Gentle Reminder</DialogTitle>
          <DialogDescription className="text-base mt-2">
            Taking a moment to reflect on our journey together
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <div className="bg-parchment p-4 rounded-lg border border-saffron/20">
            <p className="text-sm text-foreground leading-relaxed">
              <span className="font-semibold text-saffron">Divya Gyan</span> is here to guide and
              inspire you through wisdom and reflection.
            </p>
            <p className="text-sm text-foreground leading-relaxed mt-2">
              However, <span className="font-semibold">this cannot replace professional support</span> from
              therapists, counselors, or medical professionals.
            </p>
            <p className="text-sm text-foreground leading-relaxed mt-2">
              For significant challenges, please consider reaching out to a qualified professional
              who can provide personalized care.
            </p>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Your well-being is important. Use both wisdom and professional support as your tools
            for growth.
          </p>
        </div>

        <Button
          onClick={onDismiss}
          className="w-full bg-saffron text-white hover:bg-saffron/90"
        >
          I understand, continue
        </Button>
      </DialogContent>
    </Dialog>
  );
}
