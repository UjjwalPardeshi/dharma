"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { JourneyCard } from "@/components/journeys/journey-card";
import type { Journey, UserJourney } from "@/types";

export default function JourneysPage() {
  const router = useRouter();
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [userJourneys, setUserJourneys] = useState<UserJourney[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch available journeys
        const journeysResponse = await fetch("/api/journeys");
        if (journeysResponse.ok) {
          const data = await journeysResponse.json();
          setJourneys(data.data || []);
        }

        // TODO: Fetch user's journeys from /api/journeys/my-journeys when created
        // For now, set empty
        setUserJourneys([]);
      } catch (error) {
        console.error("Failed to load journeys:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleStartJourney = async (journeyId: string) => {
    try {
      const response = await fetch(`/api/journeys/${journeyId}/start`, {
        method: "POST",
      });

      if (response.ok) {
        router.push(`/journeys/${journeyId}`);
      } else {
        alert("Failed to start journey");
      }
    } catch (error) {
      console.error("Error starting journey:", error);
      alert("An error occurred while starting the journey");
    }
  };

  const handleContinueJourney = (journeyId: string) => {
    router.push(`/journeys/${journeyId}`);
  };

  const inProgressJourneyIds = new Set(userJourneys.map((uj) => uj.journey.id));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading journeys...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-display text-saffron mb-2">Guided Journeys</h1>
          <p className="text-muted-foreground">
            Embark on structured reflection journeys grounded in wisdom traditions
          </p>
        </div>

        {userJourneys.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-display text-foreground mb-4">
              In Progress
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userJourneys.map((uj) => (
                <JourneyCard
                  key={uj.id}
                  journey={uj.journey}
                  isInProgress={true}
                  onStartClick={() => {}}
                  onContinueClick={() =>
                    handleContinueJourney(uj.journey.id)
                  }
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-display text-foreground mb-4">
            Available Journeys
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {journeys.length === 0 ? (
              <div className="col-span-full p-8 text-center border border-dashed rounded-lg">
                <p className="text-muted-foreground">
                  No journeys available yet. Check back soon!
                </p>
              </div>
            ) : (
              journeys
                .filter((j) => !inProgressJourneyIds.has(j.id))
                .map((journey) => (
                  <JourneyCard
                    key={journey.id}
                    journey={journey}
                    isInProgress={false}
                    onStartClick={() => handleStartJourney(journey.id)}
                  />
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
