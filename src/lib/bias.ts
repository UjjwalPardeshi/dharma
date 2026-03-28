import type { Verse, Tradition } from "@/types";

/**
 * Checks if a collection of verses is too heavily weighted toward one tradition
 * and reorders them to ensure diversity if needed.
 */
export function ensureTraditionDiversity(verses: Verse[]): Verse[] {
  if (verses.length === 0) return verses;

  // Count traditions
  const traditionCounts: Record<Tradition, number> = {
    hindu: 0,
    buddhist: 0,
    greek: 0,
    universal: 0,
  };

  verses.forEach((verse) => {
    const tradition = verse.scripture?.tradition as Tradition;
    if (tradition && tradition in traditionCounts) {
      traditionCounts[tradition]++;
    }
  });

  // Check if any single tradition dominates (>60%)
  const maxCount = Math.max(...Object.values(traditionCounts));
  const dominancePercentage = (maxCount / verses.length) * 100;

  if (dominancePercentage <= 60) {
    // Distribution is already diverse enough
    return verses;
  }

  // Reorder to spread out dominant tradition
  const reordered: Verse[] = [];
  const byTradition: Record<Tradition, Verse[]> = {
    hindu: [],
    buddhist: [],
    greek: [],
    universal: [],
  };

  verses.forEach((verse) => {
    const tradition = verse.scripture?.tradition as Tradition;
    if (tradition && tradition in byTradition) {
      byTradition[tradition].push(verse);
    }
  });

  // Distribute verses in round-robin fashion from largest to smallest group
  const traditions = Object.keys(byTradition) as Tradition[];
  const sortedTraditions = traditions.sort(
    (a, b) => byTradition[b].length - byTradition[a].length
  );

  let maxLength = Math.max(...sortedTraditions.map((t) => byTradition[t].length));

  for (let i = 0; i < maxLength; i++) {
    for (const tradition of sortedTraditions) {
      if (byTradition[tradition][i]) {
        reordered.push(byTradition[tradition][i]);
      }
    }
  }

  return reordered;
}

/**
 * Gets a balanced selection of verses ensuring diverse tradition representation.
 * If not enough verses available from multiple traditions, fills from available sources.
 */
export function getBalancedVerses(verses: Verse[], targetCount: number): Verse[] {
  if (verses.length === 0) return [];
  if (verses.length <= targetCount) return ensureTraditionDiversity(verses);

  // Group by tradition
  const byTradition: Record<Tradition, Verse[]> = {
    hindu: [],
    buddhist: [],
    greek: [],
    universal: [],
  };

  verses.forEach((verse) => {
    const tradition = verse.scripture?.tradition as Tradition;
    if (tradition && tradition in byTradition) {
      byTradition[tradition].push(verse);
    }
  });

  // Calculate target allocation per tradition
  // Ideal: equal distribution, fallback: proportional to available
  const availableTraditions = Object.entries(byTradition).filter(
    ([_, list]) => list.length > 0
  );

  if (availableTraditions.length === 0) return verses.slice(0, targetCount);

  const selectedVerses: Verse[] = [];
  const perTradition = Math.floor(targetCount / availableTraditions.length);
  const remainder = targetCount % availableTraditions.length;

  availableTraditions.forEach(([tradition, traditionalVerses], idx) => {
    const count = perTradition + (idx < remainder ? 1 : 0);
    const toTake = Math.min(count, traditionalVerses.length);
    selectedVerses.push(...traditionalVerses.slice(0, toTake));
  });

  // If we don't have enough, fill from any remaining verses
  if (selectedVerses.length < targetCount) {
    const selected = new Set(selectedVerses.map((v) => v.id));
    const remaining = verses.filter((v) => !selected.has(v.id));
    const needed = targetCount - selectedVerses.length;
    selectedVerses.push(...remaining.slice(0, needed));
  }

  return ensureTraditionDiversity(selectedVerses);
}
