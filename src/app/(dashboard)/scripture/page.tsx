"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { VerseCard } from "@/components/scripture/verse-card";
import type { ApiResponse, Verse } from "@/types/index";

const TRADITIONS = ["Hindu", "Buddhist", "Greek", "Universal"];
const THEMES = ["career", "relationships", "grief", "purpose", "dharma", "love", "loss", "identity"];

interface VerseWithScripture extends Omit<Verse, "scripture"> {
  scripture: {
    title: string;
    tradition: string;
    description?: string | null;
    authorOrSource?: string | null;
  };
}

export default function ScriptureExplorerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTraditions, setSelectedTraditions] = useState<string[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedVerseId, setSelectedVerseId] = useState<string | null>(null);

  const searchParams = useMemo(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append("q", searchQuery.trim());
    if (selectedTraditions.length > 0) {
      params.append("tradition", selectedTraditions[0].toLowerCase());
    }
    if (selectedThemes.length > 0) {
      params.append("theme", selectedThemes[0]);
    }
    params.append("limit", "12");
    return params.toString();
  }, [searchQuery, selectedTraditions, selectedThemes]);

  const { data, isLoading, error } = useQuery<ApiResponse<VerseWithScripture[]>>({
    queryKey: ["verses", searchParams],
    queryFn: async () => {
      const response = await fetch(`/api/verses/search?${searchParams}`);
      if (!response.ok) throw new Error("Failed to fetch verses");
      return response.json();
    },
  });

  const { data: selectedVerseData } = useQuery<ApiResponse<VerseWithScripture | null>>({
    queryKey: ["verse", selectedVerseId],
    queryFn: async () => {
      if (!selectedVerseId) return null;
      const response = await fetch(`/api/verses/${selectedVerseId}`);
      if (!response.ok) throw new Error("Failed to fetch verse");
      return response.json();
    },
    enabled: !!selectedVerseId,
  });

  const toggleTradition = (tradition: string) => {
    setSelectedTraditions((prev) =>
      prev.includes(tradition) ? prev.filter((t) => t !== tradition) : [tradition]
    );
  };

  const toggleTheme = (theme: string) => {
    setSelectedThemes((prev) =>
      prev.includes(theme) ? prev.filter((t) => t !== theme) : [theme]
    );
  };

  const verses = data?.data || [];
  const selectedVerse = selectedVerseData?.data;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-display text-saffron mb-2">
            Scripture Explorer
          </h1>
          <p className="text-gray-600">
            Explore ancient wisdom from sacred traditions across cultures
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <Input
            placeholder="Search verses by text, theme, or scripture name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-lg py-6 bg-parchment border-saffron/20"
          />
        </div>

        {/* Tradition Filters */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Traditions</h3>
          <div className="flex flex-wrap gap-2">
            {TRADITIONS.map((tradition) => (
              <Badge
                key={tradition}
                variant={selectedTraditions.includes(tradition) ? "default" : "outline"}
                className={`cursor-pointer transition-all ${
                  selectedTraditions.includes(tradition)
                    ? "bg-saffron text-white border-saffron"
                    : "border-saffron/30"
                }`}
                onClick={() => toggleTradition(tradition)}
              >
                {tradition}
              </Badge>
            ))}
          </div>
        </div>

        {/* Theme Filters */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Themes</h3>
          <div className="flex flex-wrap gap-2">
            {THEMES.map((theme) => (
              <Badge
                key={theme}
                variant={selectedThemes.includes(theme) ? "default" : "outline"}
                className={`cursor-pointer transition-all capitalize ${
                  selectedThemes.includes(theme)
                    ? "bg-saffron text-white border-saffron"
                    : "border-saffron/30"
                }`}
                onClick={() => toggleTheme(theme)}
              >
                {theme}
              </Badge>
            ))}
          </div>
        </div>

        {/* Verses Grid */}
        <div>
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading verses...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">Failed to load verses</p>
            </div>
          ) : verses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Explore ancient wisdom by searching above
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {verses.map((verse) => (
                <VerseCard
                  key={verse.id}
                  verse={verse}
                  onClick={() => setSelectedVerseId(verse.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Verse Detail Modal */}
      {selectedVerse && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedVerseId(null)}
        >
          <div
            className="bg-parchment rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6">
              <Badge className="mb-4 bg-saffron text-white">
                {selectedVerse.scripture?.tradition || ""}
              </Badge>
              <h2 className="text-2xl font-display text-saffron mb-2">
                {selectedVerse.scripture?.title}
              </h2>
              <p className="text-sm text-gray-600">
                Verse {selectedVerse.verseNumber}
              </p>
            </div>

            <div className="mb-6 border-l-4 border-saffron pl-4">
              <p className="text-lg font-serif leading-relaxed text-gray-800 mb-4">
                "{selectedVerse.text}"
              </p>
              {selectedVerse.translation && (
                <p className="text-base font-serif text-gray-700 italic">
                  {selectedVerse.translation}
                </p>
              )}
            </div>

            {selectedVerse.themes && selectedVerse.themes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Themes</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedVerse.themes.map((theme) => (
                    <Badge key={theme} variant="secondary">
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {selectedVerse.scripture?.description && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  About this Scripture
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedVerse.scripture.description}
                </p>
              </div>
            )}

            <Button
              onClick={() => setSelectedVerseId(null)}
              className="w-full bg-saffron hover:bg-saffron/90 text-white"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
