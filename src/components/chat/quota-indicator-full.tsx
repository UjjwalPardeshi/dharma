"use client";

import { useEffect, useState } from "react";
import { useUIStore } from "@/lib/stores/ui-store";
import { Button } from "@/components/ui/button";
import type { BillingUsage } from "@/types";

export function QuotaIndicatorFull() {
  const [usage, setUsage] = useState<BillingUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const setUpgradeModalOpen = useUIStore((state) => state.setUpgradeModalOpen);

  useEffect(() => {
    async function fetchUsage() {
      try {
        const response = await fetch("/api/billing/usage");
        if (response.ok) {
          const data = await response.json();
          setUsage(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch billing usage:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsage();
  }, []);

  if (loading || !usage) {
    return null;
  }

  // Hide for premium users
  if (usage.planType !== "free") {
    return null;
  }

  const percentage = (usage.used / usage.limit) * 100;
  const remaining = usage.limit - usage.used;
  const showUpgradeButton = remaining < 2;

  return (
    <div className="mt-4 p-3 rounded-lg bg-parchment border border-saffron/20">
      <div className="mb-2">
        <p className="text-sm font-display text-saffron">
          {usage.used} of {usage.limit} consultations used
        </p>
      </div>
      <div className="w-full h-2 rounded-full bg-saffron/10 overflow-hidden mb-3">
        <div
          className="h-full bg-saffron transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {remaining > 0 && (
        <p className="text-xs text-muted-foreground mb-3">
          {remaining} {remaining === 1 ? "consultation" : "consultations"} remaining this month
        </p>
      )}
      {showUpgradeButton && (
        <Button
          onClick={() => setUpgradeModalOpen(true)}
          size="sm"
          className="w-full text-xs"
        >
          Upgrade to Premium
        </Button>
      )}
    </div>
  );
}
