"use client";

import { useEffect, useState } from "react";
import { useUIStore } from "@/lib/stores/ui-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PricingPlan } from "@/app/api/billing/plans/route";
import { CheckCircle } from "lucide-react";

export function UpgradeModal() {
  const upgradeModalOpen = useUIStore((state) => state.upgradeModalOpen);
  const setUpgradeModalOpen = useUIStore((state) => state.setUpgradeModalOpen);

  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await fetch("/api/billing/plans");
        if (response.ok) {
          const data = await response.json();
          setPlans(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch pricing plans:", error);
      } finally {
        setLoading(false);
      }
    }

    if (upgradeModalOpen) {
      fetchPlans();
    }
  }, [upgradeModalOpen]);

  const premiumPlans = plans.filter((p) => p.id !== "free");

  return (
    <Dialog open={upgradeModalOpen} onOpenChange={setUpgradeModalOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-saffron">Unlock Premium Access</DialogTitle>
          <DialogDescription className="text-base mt-2">
            Get unlimited consultations and exclusive features
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center text-muted-foreground">
            Loading pricing plans...
          </div>
        ) : (
          <div className="space-y-6 my-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {premiumPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    plan.billingPeriod === "annual"
                      ? "border-saffron bg-parchment"
                      : "border-border hover:border-saffron/50"
                  }`}
                >
                  {plan.billingPeriod === "annual" && (
                    <div className="mb-3">
                      <Badge className="bg-saffron text-white">Best Value</Badge>
                    </div>
                  )}

                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {plan.description}
                  </p>

                  <div className="mb-4">
                    <span className="text-3xl font-bold text-saffron">
                      ${plan.price}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">
                      /{plan.billingPeriod === "monthly" ? "month" : "year"}
                    </span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-saffron flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full bg-saffron text-white hover:bg-saffron/90"
                    onClick={() => {
                      // MVP: Show coming soon message
                      alert(
                        "Stripe integration coming soon! Thank you for your interest."
                      );
                    }}
                  >
                    {plan.billingPeriod === "monthly"
                      ? "Start Free Trial"
                      : "Get Premium Annual"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-3">
                    Coming soon: Secure payment processing
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-parchment border border-saffron/20 p-4 rounded-lg">
              <p className="text-sm text-foreground">
                <span className="font-semibold text-saffron">Free features:</span> 5
                consultations per month, access to all traditions, guided
                reflections
              </p>
              <p className="text-sm text-foreground mt-2">
                <span className="font-semibold text-saffron">Premium unlocks:</span> Unlimited
                consultations, advanced guidance, exclusive journeys, and priority
                support
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
