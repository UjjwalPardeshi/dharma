"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { ApiResponse, DailyWisdom } from "@/types/index";

interface DailyWisdomResponse {
  id: string;
  verse: {
    id: string;
    scriptureId: string;
    verseNumber: string;
    text: string;
    translation: string | null;
    themes: string[];
    tags: string[];
    scripture: {
      title: string;
      tradition: string;
      description: string | null;
      authorOrSource: string | null;
    };
  };
  aiInsight: string;
  date: string;
}

const TRADITION_COLORS: Record<string, string> = {
  hindu: "bg-amber-100 text-amber-900",
  buddhist: "bg-purple-100 text-purple-900",
  greek: "bg-blue-100 text-blue-900",
  universal: "bg-green-100 text-green-900",
};

export default function DailyWisdomPage() {
  const { data, isLoading, error } = useQuery<ApiResponse<DailyWisdomResponse | null>>({
    queryKey: ["daily-wisdom"],
    queryFn: async () => {
      const response = await fetch("/api/daily-wisdom");
      if (!response.ok) throw new Error("Failed to fetch daily wisdom");
      return response.json();
    },
  });

  const wisdom = data?.data;
  const verse = wisdom?.verse;

  const traditionColor = verse
    ? TRADITION_COLORS[verse.scripture.tradition] || "bg-gray-100 text-gray-900"
    : "";

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-display text-saffron mb-4">Today's Wisdom</h1>
          <p className="text-gray-600 text-lg">
            Daily guidance from ancient traditions
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading today's wisdom...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">Failed to load today's wisdom</p>
          </div>
        )}

        {/* Wisdom Card */}
        {verse && wisdom && (
          <Card className="bg-parchment border-saffron/20 overflow-hidden shadow-lg">
            <div className="p-12">
              {/* Tradition Badge */}
              <div className="mb-8 flex justify-center">
                <Badge className={`${traditionColor} text-lg px-4 py-2 font-semibold`}>
                  {verse.scripture.tradition.charAt(0).toUpperCase() +
                    verse.scripture.tradition.slice(1)}
                </Badge>
              </div>

              {/* Quote Text */}
              <div className="mb-8">
                <p className="text-4xl font-display text-saffron mb-2 text-center leading-relaxed">
                  "{verse.text}"
                </p>
                {verse.translation && (
                  <p className="text-center text-lg font-serif text-gray-700 italic leading-relaxed">
                    {verse.translation}
                  </p>
                )}
              </div>

              {/* Scripture Source */}
              <div className="mb-8 py-6 border-y border-saffron/20 text-center">
                <p className="text-sm text-gray-600 mb-1">From</p>
                <p className="text-2xl font-display text-saffron">
                  {verse.scripture.title}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Verse {verse.verseNumber}
                </p>
              </div>

              {/* AI Insight */}
              <div className="mb-8 bg-white/50 rounded-lg p-6">
                <h3 className="font-display text-saffron text-lg mb-3">Today's Reflection</h3>
                <p className="text-gray-700 leading-relaxed font-serif">
                  {wisdom.aiInsight}
                </p>
              </div>

              {/* Themes */}
              {verse.themes && verse.themes.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Themes</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {verse.themes.map((theme) => (
                      <Badge key={theme} variant="secondary" className="capitalize">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Scripture Description */}
              {verse.scripture.description && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    About this Scripture
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {verse.scripture.description}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <Link href="/scripture">
                  <Button className="bg-saffron hover:bg-saffron/90 text-white">
                    Explore More Verses
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
