import Link from "next/link";
import { BookOpen, MessageCircle, Sparkles, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: MessageCircle,
    title: "Life Consultation",
    description:
      "Share your dilemmas and receive wisdom-guided advice through empathetic conversation.",
  },
  {
    icon: BookOpen,
    title: "Scripture Explorer",
    description:
      "Browse and search ancient texts by theme, emotion, or keyword with AI explanations.",
  },
  {
    icon: Sun,
    title: "Daily Wisdom",
    description:
      "Start each day with a curated quote from the world's mythological traditions.",
  },
  {
    icon: Sparkles,
    title: "Guided Journeys",
    description:
      "Embark on 7 or 21-day reflection programmes rooted in ancient teachings.",
  },
];

const traditions = [
  { name: "Bhagavad Gita", tradition: "Hindu" },
  { name: "Dhammapada", tradition: "Buddhist" },
  { name: "Upanishads", tradition: "Vedic" },
  { name: "Mahabharata", tradition: "Hindu" },
  { name: "Ramayana", tradition: "Hindu" },
  { name: "Jataka Tales", tradition: "Buddhist" },
  { name: "Meditations", tradition: "Stoic" },
  { name: "Tao Te Ching", tradition: "Taoist" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-parchment to-background" />
        <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-saffron" />
            <span className="font-display text-xl font-bold tracking-tight">
              Divya Gyan
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/onboarding">
              <Button size="sm" className="bg-saffron hover:bg-saffron/90 text-foreground">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 pt-20 pb-28">
          <p className="text-sm font-medium tracking-widest uppercase text-saffron mb-4">
            The Mythological AI Life Consultant
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Ancient Wisdom.
            <br />
            <span className="text-saffron">Modern Clarity.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Life solutions rooted in timeless truth. Get personalized guidance
            from the Bhagavad Gita, Dhammapada, Stoic philosophy, and more —
            like speaking to a wise sage.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/onboarding">
              <Button
                size="lg"
                className="bg-saffron hover:bg-saffron/90 text-foreground text-lg px-8"
              >
                Begin Your Journey
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">
          Your Personal Sage
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-xl mx-auto">
          Divya Gyan bridges ancient philosophical knowledge and contemporary
          life challenges with empathetic, actionable guidance.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-8 hover:shadow-md transition-shadow"
            >
              <feature.icon className="h-10 w-10 text-saffron mb-4" />
              <h3 className="font-display text-xl font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Traditions */}
      <section className="py-24 px-6 bg-parchment">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">
            Wisdom From World Traditions
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            Drawing from humanity&apos;s deepest philosophical and mythological
            texts — digitised, annotated, and made conversational.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {traditions.map((t) => (
              <span
                key={t.name}
                className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-5 py-2.5 text-sm"
              >
                <span className="font-medium">{t.name}</span>
                <span className="text-muted-foreground text-xs">
                  {t.tradition}
                </span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
          Start Free, Go Deeper
        </h2>
        <p className="text-muted-foreground mb-12 max-w-lg mx-auto">
          5 free consultations every month. Upgrade for unlimited wisdom,
          guided journeys, and cross-tradition access.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="rounded-xl border border-border bg-card p-8">
            <h3 className="font-display text-xl font-semibold mb-2">Free</h3>
            <p className="text-3xl font-bold mb-4">
              $0<span className="text-sm text-muted-foreground">/month</span>
            </p>
            <ul className="text-left text-sm text-muted-foreground space-y-2">
              <li>5 consultations/month</li>
              <li>Basic scripture access</li>
              <li>Daily wisdom quotes</li>
            </ul>
          </div>
          <div className="rounded-xl border-2 border-saffron bg-card p-8 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-saffron text-xs font-semibold px-3 py-1 rounded-full">
              Most Popular
            </span>
            <h3 className="font-display text-xl font-semibold mb-2">
              Premium
            </h3>
            <p className="text-3xl font-bold mb-4">
              $9.99<span className="text-sm text-muted-foreground">/month</span>
            </p>
            <ul className="text-left text-sm text-muted-foreground space-y-2">
              <li>Unlimited consultations</li>
              <li>All traditions unlocked</li>
              <li>Guided reflection journeys</li>
              <li>Cross-session memory</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-saffron" />
            <span className="font-display font-semibold">Divya Gyan</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition">
              Terms of Service
            </Link>
            <Link href="/help" className="hover:text-foreground transition">
              Help
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Divya Gyan. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
