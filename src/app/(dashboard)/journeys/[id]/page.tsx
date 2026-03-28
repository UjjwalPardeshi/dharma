"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProgressTracker } from "@/components/journeys/progress-tracker";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OverrelianceReminder } from "@/components/modals/overreliance-reminder";
import type { JourneyDetail } from "@/app/api/journeys/[id]/route";
import type { DayContent, GuidanceResponse } from "@/app/api/journeys/[id]/day/[dayNumber]/route";
import type { ResponseFramework } from "@/types";

interface JourneyProgress {
  id: string;
  currentDay: number;
  status: "active" | "completed" | "paused";
  durationDays: number;
}

export default function JourneyPage() {
  const params = useParams();
  const router = useRouter();
  const journeyId = params.id as string;

  const [journey, setJourney] = useState<JourneyDetail | null>(null);
  const [progress, setProgress] = useState<JourneyProgress | null>(null);
  const [dayContent, setDayContent] = useState<DayContent | null>(null);
  const [reflection, setReflection] = useState("");
  const [guidance, setGuidance] = useState<ResponseFramework | null>(null);
  const [loading, setLoading] = useState(true);
  const [streaming, setStreaming] = useState(false);
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    async function loadJourney() {
      try {
        // Fetch journey details
        const journeyRes = await fetch(`/api/journeys/${journeyId}`);
        if (!journeyRes.ok) {
          router.push("/journeys");
          return;
        }
        const journeyData = await journeyRes.json();
        setJourney(journeyData.data);

        // TODO: Fetch user's progress from /api/journeys/[id]/progress when created
        // For now, simulate it
        const mockProgress: JourneyProgress = {
          id: "temp",
          currentDay: 1,
          status: "active",
          durationDays: journeyData.data.durationDays,
        };
        setProgress(mockProgress);

        // Fetch current day content
        const dayRes = await fetch(
          `/api/journeys/${journeyId}/day/${mockProgress.currentDay}`
        );
        if (dayRes.ok) {
          const dayData = await dayRes.json();
          setDayContent(dayData.data);
        }
      } catch (error) {
        console.error("Failed to load journey:", error);
        router.push("/journeys");
      } finally {
        setLoading(false);
      }
    }

    loadJourney();
  }, [journeyId, router]);

  const handleSubmitReflection = async () => {
    if (!reflection.trim() || !progress) return;

    setStreaming(true);
    let fullGuidance = "";

    try {
      const response = await fetch(
        `/api/journeys/${journeyId}/day/${progress.currentDay}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reflection }),
        }
      );

      if (!response.ok) {
        alert("Failed to get guidance");
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const json = JSON.parse(line.slice(6));
                if (json.type === "stream") {
                  fullGuidance += json.content;
                } else if (json.type === "done") {
                  // Parse final guidance
                  const match = fullGuidance.match(/\{[\s\S]*\}/);
                  if (match) {
                    const parsed = JSON.parse(match[0]);
                    setGuidance(parsed);
                  }

                  // Update progress
                  if (
                    progress.currentDay < progress.durationDays
                  ) {
                    setProgress((p) =>
                      p ? { ...p, currentDay: p.currentDay + 1 } : null
                    );
                    const nextDayRes = await fetch(
                      `/api/journeys/${journeyId}/day/${
                        progress.currentDay + 1
                      }`
                    );
                    if (nextDayRes.ok) {
                      const nextDay = await nextDayRes.json();
                      setDayContent(nextDay.data);
                    }
                  } else {
                    setProgress((p) =>
                      p ? { ...p, status: "completed" } : null
                    );
                  }

                  // Check if we should show reminder (every 10th consultation)
                  // This would be tracked in the DB in a real app
                  setShowReminder(false);
                }
              } catch (e) {
                // Not JSON, skip
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error submitting reflection:", error);
      alert("An error occurred while processing your reflection");
    } finally {
      setStreaming(false);
      setReflection("");
    }
  };

  const handleNextDay = () => {
    if (progress && progress.currentDay < progress.durationDays) {
      setGuidance(null);
      setReflection("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading journey...</p>
      </div>
    );
  }

  if (!journey || !progress || !dayContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Journey not found</p>
      </div>
    );
  }

  const isComplete = progress.status === "completed";

  return (
    <div className="min-h-screen bg-background p-6">
      <OverrelianceReminder
        open={showReminder}
        onDismiss={() => setShowReminder(false)}
      />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/journeys")}
            className="mb-4"
          >
            &larr; Back to Journeys
          </Button>
          <h1 className="text-3xl font-display text-saffron mb-2">
            {journey.title}
          </h1>
          <p className="text-muted-foreground">{journey.description}</p>
        </div>

        {/* Progress Tracker */}
        <ProgressTracker
          currentDay={progress.currentDay}
          totalDays={progress.durationDays}
        />

        {/* Verse Card */}
        <Card className="mb-6 p-6 bg-parchment border-saffron/20">
          <p className="text-xs uppercase tracking-wide text-saffron mb-2">
            Day {progress.currentDay} Verse
          </p>
          <p className="text-lg text-foreground mb-4 italic leading-relaxed">
            "{dayContent.verseText}"
          </p>
          <p className="text-sm text-muted-foreground">
            {dayContent.verseNumber}
          </p>
        </Card>

        {/* Reflection Section */}
        {!isComplete && !guidance && (
          <Card className="mb-6 p-6">
            <h2 className="text-xl font-display text-foreground mb-3">
              Reflect
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              {dayContent.reflectionPrompt}
            </p>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Share your thoughts and reflections..."
              className="w-full p-4 bg-background border border-border rounded-lg mb-4 min-h-32 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-saffron"
            />
            <Button
              onClick={handleSubmitReflection}
              disabled={!reflection.trim() || streaming}
              className="bg-saffron text-white hover:bg-saffron/90 w-full"
            >
              {streaming ? "Getting Guidance..." : "Get AI Guidance"}
            </Button>
          </Card>
        )}

        {/* Guidance Response */}
        {guidance && (
          <Card className="mb-6 p-6 space-y-6">
            <div>
              <h3 className="font-display text-saffron mb-2">Acknowledgment</h3>
              <p className="text-foreground">{guidance.empatheticAcknowledgment}</p>
            </div>

            {guidance.mythologicalParallel && (
              <div>
                <h3 className="font-display text-saffron mb-2">
                  {journey.tradition === "universal"
                    ? "A Parallel"
                    : "Wisdom from the Tradition"}
                </h3>
                <p className="text-foreground mb-2">
                  <strong>{guidance.mythologicalParallel.story}</strong>
                </p>
                <p className="text-foreground text-sm">
                  {guidance.mythologicalParallel.lesson}
                </p>
              </div>
            )}

            {guidance.practicalGuidance && guidance.practicalGuidance.length > 0 && (
              <div>
                <h3 className="font-display text-saffron mb-2">
                  Practical Steps
                </h3>
                <ul className="space-y-2">
                  {guidance.practicalGuidance.map((step, idx) => (
                    <li
                      key={idx}
                      className="text-foreground text-sm flex gap-3"
                    >
                      <span className="text-saffron font-semibold">
                        {idx + 1}.
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {guidance.lifeLesson && (
              <div>
                <h3 className="font-display text-saffron mb-2">Life Lesson</h3>
                <p className="text-foreground italic">
                  "{guidance.lifeLesson}"
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-border">
              {progress.currentDay < progress.durationDays && (
                <Button
                  onClick={handleNextDay}
                  className="flex-1 bg-saffron text-white hover:bg-saffron/90"
                >
                  Next Day
                </Button>
              )}
              {isComplete && (
                <Button
                  onClick={() => router.push("/journeys")}
                  className="flex-1 bg-saffron text-white hover:bg-saffron/90"
                >
                  Explore More Journeys
                </Button>
              )}
            </div>
          </Card>
        )}

        {isComplete && (
          <Card className="p-6 bg-parchment border-saffron/20 text-center">
            <h2 className="text-2xl font-display text-saffron mb-2">
              Journey Complete
            </h2>
            <p className="text-foreground mb-4">
              You have completed the {journey.title} journey. May the wisdom you
              gained continue to guide you.
            </p>
            <Button
              onClick={() => router.push("/journeys")}
              className="bg-saffron text-white hover:bg-saffron/90"
            >
              Explore More Journeys
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
