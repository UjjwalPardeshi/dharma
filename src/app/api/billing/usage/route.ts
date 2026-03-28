import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { ApiResponse, BillingUsage } from "@/types";

export async function GET(request: Request) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json(
        {
          success: false,
          error: "Unauthorized",
        } as ApiResponse<never>,
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get subscription
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      return Response.json(
        {
          success: false,
          error: "No subscription found",
        } as ApiResponse<never>,
        { status: 404 }
      );
    }

    // Calculate current month's reset date (first day of month)
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Get usage count for this month
    const usedCount = await prisma.usageLog.count({
      where: {
        userId,
        createdAt: {
          gte: monthStart,
        },
      },
    });

    // Determine limit based on plan
    const limit =
      subscription.planType === "free"
        ? 5
        : -1; // -1 means unlimited for premium

    const billingUsage: BillingUsage = {
      used: usedCount,
      limit: limit === -1 ? 9999 : limit, // Return large number for unlimited for UI purposes
      resetDate: monthEnd.toISOString(),
      planType: subscription.planType as "free" | "premium_monthly" | "premium_annual",
    };

    return Response.json(
      {
        success: true,
        data: billingUsage,
      } as ApiResponse<BillingUsage>,
      { status: 200 }
    );
  } catch (error) {
    console.error("Billing usage error:", error);

    return Response.json(
      {
        success: false,
        error: "Internal server error",
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}
