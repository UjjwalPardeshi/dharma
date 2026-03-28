"use client";

import { Card } from "@/components/ui/card";
import { Heart, Briefcase, Users, Lightbulb } from "lucide-react";

interface WelcomeStateProps {
  userName?: string | null;
  onSelectTopic: (topic: string) => void;
}

const suggestedTopics = [
  {
    id: "career",
    label: "Career",
    icon: Briefcase,
    description: "Guidance on work, purpose, and professional growth",
    starterQuestion:
      "I'm facing a challenge in my career and would like guidance from ancient wisdom about navigating this situation.",
  },
  {
    id: "relationships",
    label: "Relationships",
    icon: Users,
    description: "Insights for love, family, and interpersonal connections",
    starterQuestion:
      "I'm seeking guidance on how to nurture and strengthen my relationships with those close to me.",
  },
  {
    id: "purpose",
    label: "Purpose",
    icon: Lightbulb,
    description: "Finding meaning and life direction",
    starterQuestion:
      "I'm searching for clarity about my life's purpose and would appreciate wisdom to guide me on this journey.",
  },
  {
    id: "inner-peace",
    label: "Inner Peace",
    icon: Heart,
    description: "Cultivating calm, resilience, and emotional balance",
    starterQuestion:
      "I'm seeking inner peace and would like guidance on cultivating calm and emotional balance in my life.",
  },
];

export function WelcomeState({
  userName,
  onSelectTopic,
}: WelcomeStateProps) {
  return (
    <div className="space-y-8 py-8">
      {/* Greeting */}
      <div className="space-y-3">
        <p className="text-base text-muted-foreground">
          Welcome back{userName ? `, ${userName}` : ""}
        </p>
        <h2 className="font-display text-4xl font-semibold text-foreground">
          What's on your mind today?
        </h2>
      </div>

      {/* Suggested Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestedTopics.map((topic) => {
          const Icon = topic.icon;
          return (
            <Card
              key={topic.id}
              className="p-5 cursor-pointer transition-all hover:shadow-md hover:border-saffron/50 group"
              onClick={() => onSelectTopic(topic.starterQuestion)}
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-saffron/10 group-hover:bg-saffron/20 transition-colors">
                    <Icon className="w-6 h-6 text-saffron" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1">
                    {topic.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {topic.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Helpful text */}
      <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
        <p className="text-sm text-muted-foreground">
          💡 <span className="font-medium">Tip:</span> The more specific your question, the more personalized and relevant the guidance will be.
        </p>
      </div>
    </div>
  );
}
