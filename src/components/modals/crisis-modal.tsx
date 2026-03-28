"use client";

import { useUIStore } from "@/lib/stores/ui-store";
import { CRISIS_RESOURCES } from "@/lib/safety";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { CrisisType } from "@/types";

interface CrisisModalProps {
  crisisType?: CrisisType;
}

export function CrisisModal({ crisisType = "suicidal_ideation" }: CrisisModalProps) {
  const crisisModalOpen = useUIStore((state) => state.crisisModalOpen);
  const setCrisisModalOpen = useUIStore((state) => state.setCrisisModalOpen);

  const resources = CRISIS_RESOURCES[crisisType];

  const handleDismiss = () => {
    setCrisisModalOpen(false);
  };

  return (
    <Dialog open={crisisModalOpen} onOpenChange={setCrisisModalOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-saffron">We Care About You</DialogTitle>
          <DialogDescription className="text-base mt-2">
            I sense you may be in distress. You are not alone, and there is help available.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <p className="text-sm text-foreground leading-relaxed">
            Speaking with a trained professional can make a real difference. Please reach out
            to someone who can provide immediate support:
          </p>

          <div className="space-y-3 bg-parchment p-4 rounded-lg border border-saffron/20">
            <div>
              <p className="font-semibold text-saffron text-sm mb-1">United States</p>
              <p className="text-sm text-foreground">{resources.us}</p>
            </div>
            <div>
              <p className="font-semibold text-saffron text-sm mb-1">United Kingdom</p>
              <p className="text-sm text-foreground">{resources.uk}</p>
            </div>
            <div>
              <p className="font-semibold text-saffron text-sm mb-1">India</p>
              <p className="text-sm text-foreground">{resources.india}</p>
            </div>
            <div>
              <p className="font-semibold text-saffron text-sm mb-1">International</p>
              <p className="text-sm text-foreground">{resources.international}</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground italic">
            Your life has value. Your thoughts and feelings matter. Please reach out today.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleDismiss}
            className="flex-1"
          >
            I'm okay, continue
          </Button>
          <Button
            className="flex-1 bg-saffron text-white hover:bg-saffron/90"
            onClick={() => {
              window.open("https://findahelpline.com", "_blank");
            }}
          >
            Find Help
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
