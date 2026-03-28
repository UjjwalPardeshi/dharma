import type { ApiResponse } from "@/types";

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingPeriod: "monthly" | "annual";
  consultationLimit: number;
  features: string[];
  description: string;
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    currency: "USD",
    billingPeriod: "monthly",
    consultationLimit: 5,
    features: [
      "5 consultations per month",
      "Access to all traditions",
      "Basic guidance",
    ],
    description: "Perfect for exploring Divya Gyan",
  },
  {
    id: "premium_monthly",
    name: "Premium Monthly",
    price: 9.99,
    currency: "USD",
    billingPeriod: "monthly",
    consultationLimit: -1, // Unlimited
    features: [
      "Unlimited consultations",
      "Access to all traditions",
      "Advanced guidance",
      "Guided reflection journeys",
      "Priority support",
    ],
    description: "Flexible monthly plan",
  },
  {
    id: "premium_annual",
    name: "Premium Annual",
    price: 79,
    currency: "USD",
    billingPeriod: "annual",
    consultationLimit: -1, // Unlimited
    features: [
      "Unlimited consultations",
      "Access to all traditions",
      "Advanced guidance",
      "Guided reflection journeys",
      "Priority support",
      "Save 34% vs monthly",
    ],
    description: "Best value - save with annual billing",
  },
];

export async function GET(request: Request) {
  try {
    return Response.json(
      {
        success: true,
        data: PRICING_PLANS,
      } as ApiResponse<PricingPlan[]>,
      { status: 200 }
    );
  } catch (error) {
    console.error("Plans fetch error:", error);

    return Response.json(
      {
        success: false,
        error: "Internal server error",
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}
