"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { Sparkles, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import type { Tradition, TonePreference } from "@/types";

// Form schemas
const step1Schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const step2Schema = z.object({
  age: z.string().optional(),
  culturalBackground: z.string().optional(),
  preferredTradition: z.enum(["hindu", "buddhist", "greek", "universal"]),
  tonePreference: z.enum(["casual", "devotional", "philosophical", "practical"]),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);

  const form1 = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
  });

  const form2 = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      preferredTradition: "universal",
      tonePreference: "practical",
    },
  });

  async function handleStep1Submit(data: Step1Data) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Registration failed");
        return;
      }

      setStep1Data(data);
      setStep(2);
      toast.success("Account created! Now customize your preferences.");
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStep2Submit(data: Step2Data) {
    setIsLoading(true);
    try {
      if (!step1Data) return;

      // Update user preferences
      const updateResponse = await fetch("/api/user/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: data.age ? parseInt(data.age, 10) : undefined,
          culturalBackground: data.culturalBackground,
          preferredTradition: data.preferredTradition,
          tonePreference: data.tonePreference,
        }),
      });

      if (!updateResponse.ok) {
        toast.error("Failed to save preferences");
        return;
      }

      // Sign in the user
      const result = await signIn("credentials", {
        email: step1Data.email,
        password: step1Data.password,
        redirect: false,
      });

      if (result?.ok) {
        setStep(3);
        // Redirect after showing welcome screen
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        toast.error("Failed to sign in");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="font-display text-3xl font-semibold text-foreground">
            Divya Gyan
          </h1>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-colors ${
                i === step ? "bg-primary" : i < step ? "bg-primary/50" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <Card className="border-border/50">
          {step === 1 && (
            <>
              <CardHeader className="space-y-2 text-center">
                <CardTitle className="font-display text-2xl">
                  Create Your Account
                </CardTitle>
                <p className="text-sm text-muted-foreground">Step 1 of 3</p>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={form1.handleSubmit(handleStep1Submit)}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name
                    </label>
                    <Input
                      placeholder="Your name"
                      {...form1.register("name")}
                      disabled={isLoading}
                    />
                    {form1.formState.errors.name && (
                      <p className="text-xs text-destructive mt-1">
                        {form1.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...form1.register("email")}
                      disabled={isLoading}
                    />
                    {form1.formState.errors.email && (
                      <p className="text-xs text-destructive mt-1">
                        {form1.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Password
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...form1.register("password")}
                      disabled={isLoading}
                    />
                    {form1.formState.errors.password && (
                      <p className="text-xs text-destructive mt-1">
                        {form1.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Next"}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader className="space-y-2 text-center">
                <CardTitle className="font-display text-2xl">
                  Your Preferences
                </CardTitle>
                <p className="text-sm text-muted-foreground">Step 2 of 3</p>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={form2.handleSubmit(handleStep2Submit)}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Age (Optional)
                    </label>
                    <Input
                      type="number"
                      placeholder="18"
                      {...form2.register("age")}
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Cultural Background (Optional)
                    </label>
                    <Input
                      placeholder="e.g., Indian, Western, Mixed"
                      {...form2.register("culturalBackground")}
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Preferred Tradition
                    </label>
                    <Select
                      value={form2.watch("preferredTradition")}
                      onValueChange={(value) =>
                        form2.setValue("preferredTradition", value as Tradition)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hindu">Hindu</SelectItem>
                        <SelectItem value="buddhist">Buddhist</SelectItem>
                        <SelectItem value="greek">Greek</SelectItem>
                        <SelectItem value="universal">Universal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Tone Preference
                    </label>
                    <Select
                      value={form2.watch("tonePreference")}
                      onValueChange={(value) =>
                        form2.setValue("tonePreference", value as TonePreference)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="devotional">Devotional</SelectItem>
                        <SelectItem value="philosophical">Philosophical</SelectItem>
                        <SelectItem value="practical">Practical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 gap-2"
                      onClick={() => setStep(1)}
                      disabled={isLoading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                      disabled={isLoading}
                    >
                      {isLoading ? "Completing..." : "Complete"}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </>
          )}

          {step === 3 && (
            <>
              <CardHeader className="space-y-4 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="font-display text-2xl">
                  Welcome to Divya Gyan!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 text-sm text-muted-foreground">
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      How to Ask
                    </h3>
                    <p>
                      Share your questions, dilemmas, or concerns. Be as specific
                      as you'd like.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      What to Expect
                    </h3>
                    <p>
                      Receive guidance grounded in timeless wisdom, tailored to
                      your preferences.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Example Topics
                    </h3>
                    <p>
                      Career decisions, relationships, purpose, stress, ethics,
                      grief, and more.
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => router.push("/dashboard")}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Start Exploring
                </Button>
              </CardContent>
            </>
          )}
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Ancient wisdom. Modern clarity.
        </p>
      </div>
    </div>
  );
}
