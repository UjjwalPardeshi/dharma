import { prisma } from "@/lib/db";
import type { Tradition } from "@/types";

export interface RagResult {
  verseId: string;
  verseNumber: string;
  text: string;
  tradition: Tradition;
  scripture: string;
  relevanceScore: number;
}

interface PineconeResult {
  id: string;
  score: number;
  metadata?: {
    verseNumber?: string;
    text?: string;
    tradition?: string;
    scripture?: string;
  };
}

let pineconeClient: any = null;
let openaiClient: any = null;

// Stub OpenAI client for when package is not installed
class StubOpenAI {
  async embeddings() {
    return { data: [{ embedding: [] }] };
  }
}

async function initOpenAI() {
  if (openaiClient) return openaiClient;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  try {
    // Try to dynamically import the real OpenAI client
    // @ts-ignore - openai is optional
    const OpenAI = (await import("openai")).default;
    openaiClient = new OpenAI({ apiKey });
    return openaiClient;
  } catch (error) {
    // Fallback to stub if openai package is not installed
    console.warn(
      "OpenAI package not installed. RAG with embeddings requires: npm install openai"
    );
    return null;
  }
}

export async function initPinecone() {
  if (pineconeClient) return pineconeClient;

  const apiKey = process.env.PINECONE_API_KEY;
  if (!apiKey) {
    return null;
  }

  try {
    // This is optional - Pinecone is not required
    // For now, we just return null and fallback to DB search
    return null;
  } catch {
    console.warn(
      "Pinecone initialization failed. Falling back to database search."
    );
    return null;
  }
}

async function embedQuery(query: string): Promise<number[] | null> {
  const openai = await initOpenAI();
  if (!openai) return null;

  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });

  return response.data[0]?.embedding || null;
}

export async function queryRelevantVerses(
  query: string,
  tradition?: Tradition,
  topK: number = 5
): Promise<RagResult[]> {
  // Try Pinecone first if available
  const pinecone = await initPinecone();
  if (pinecone) {
    try {
      const embedding = await embedQuery(query);
      if (!embedding) {
        return fallbackSearch(query, tradition, topK);
      }

      const index = pinecone.Index(process.env.PINECONE_INDEX_NAME || "dharma");
      const results = await index.query({
        vector: embedding,
        topK,
        filter: tradition ? { tradition: { $eq: tradition } } : undefined,
        includeMetadata: true,
      });

      return (results.matches as PineconeResult[]).map((match) => ({
        verseId: match.id,
        verseNumber: match.metadata?.verseNumber || "",
        text: match.metadata?.text || "",
        tradition: (match.metadata?.tradition as Tradition) || "universal",
        scripture: match.metadata?.scripture || "",
        relevanceScore: match.score || 0,
      }));
    } catch (error) {
      console.warn("Pinecone query failed, falling back to database search:", error);
      return fallbackSearch(query, tradition, topK);
    }
  }

  // Fallback to database search
  return fallbackSearch(query, tradition, topK);
}

export async function fallbackSearch(
  query: string,
  tradition?: Tradition,
  topK: number = 5
): Promise<RagResult[]> {
  const keywords = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);

  const verses = await prisma.verse.findMany({
    where: {
      AND: [
        {
          OR: keywords.map((keyword) => ({
            text: {
              contains: keyword,
              mode: "insensitive",
            },
          })),
        },
        tradition
          ? {
              scripture: {
                tradition: tradition as any,
              },
            }
          : {},
      ],
    },
    include: {
      scripture: true,
    },
    take: topK,
  });

  return verses.map((verse) => ({
    verseId: verse.id,
    verseNumber: verse.verseNumber,
    text: verse.text,
    tradition: verse.scripture.tradition as Tradition,
    scripture: verse.scripture.title,
    relevanceScore: 0.5, // Generic score for database search
  }));
}

export interface RagContext {
  verses: RagResult[];
  queryEmbedding?: number[];
}

export async function buildRagContext(
  query: string,
  tradition?: Tradition,
  topK?: number
): Promise<RagContext> {
  const verses = await queryRelevantVerses(query, tradition, topK);
  const embedding = await embedQuery(query);

  return {
    verses,
    queryEmbedding: embedding || undefined,
  };
}
