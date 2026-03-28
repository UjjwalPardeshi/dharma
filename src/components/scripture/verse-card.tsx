"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
interface VerseCardVerse {
  id: string;
  verseNumber: string;
  text: string;
  themes: string[];
  tags: string[];
  scripture: {
    title: string;
    tradition: string;
  };
}

interface VerseCardProps {
  verse: VerseCardVerse;
  onClick?: () => void;
}

const TRADITION_COLORS: Record<string, string> = {
  hindu: "bg-amber-100 text-amber-900",
  buddhist: "bg-purple-100 text-purple-900",
  greek: "bg-blue-100 text-blue-900",
  universal: "bg-green-100 text-green-900",
};

export function VerseCard({ verse, onClick }: VerseCardProps) {
  const truncatedText =
    verse.text.length > 150 ? `${verse.text.substring(0, 150)}...` : verse.text;

  const traditionColor = TRADITION_COLORS[verse.scripture.tradition] || "bg-gray-100 text-gray-900";

  return (
    <Card
      className="p-6 h-full flex flex-col hover:shadow-lg transition-shadow cursor-pointer bg-parchment border-saffron/20"
      onClick={onClick}
    >
      <div className="flex-1">
        <p className="text-sm text-saffron/70 mb-2 font-serif">
          {verse.scripture.title} • {verse.verseNumber}
        </p>
        <p className="text-base leading-relaxed font-serif text-gray-800 mb-4">
          "{truncatedText}"
        </p>
      </div>

      <div className="flex flex-wrap gap-2 items-end justify-between">
        <div className="flex flex-wrap gap-1">
          {verse.themes.slice(0, 2).map((theme) => (
            <Badge key={theme} variant="secondary" className="text-xs">
              {theme}
            </Badge>
          ))}
        </div>
        <Badge className={`${traditionColor} text-xs font-semibold`}>
          {verse.scripture.tradition.charAt(0).toUpperCase() + verse.scripture.tradition.slice(1)}
        </Badge>
      </div>
    </Card>
  );
}
