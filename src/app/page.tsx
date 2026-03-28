import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LandingPage } from "@/components/landing-page";

export default async function RootPage() {
  const session = await auth();

  if (session) {
    redirect("/chat");
  }

  return <LandingPage />;
}
