import { GoogleGenAI } from "@google/genai";
import type { ResponseFramework, TonePreference, Tradition } from "@/types";
import type { RagResult } from "@/lib/rag";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? "" });

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export interface GenerateConsultationParams {
  query: string;
  userId: string;
  sessionId: string;
  ragContext: RagResult[];
  tone?: TonePreference;
  tradition?: Tradition;
  userClarifyingQuestion?: string;
}

function buildSystemPrompt(
  tone: TonePreference = "devotional",
  tradition: Tradition = "universal",
  ragVerses: RagResult[]
): string {
  const verseContext = ragVerses
    .map((v) => `- ${v.scripture} ${v.verseNumber}: "${v.text}"`)
    .join("\n");

  const toneGuidance = {
    casual:
      "Use conversational, accessible language with modern references where appropriate.",
    devotional:
      "Maintain a reverent, sacred tone with emphasis on spiritual wisdom and transcendence.",
    philosophical:
      "Approach the topic with logical rigor, exploring underlying principles and ideas.",
    practical:
      "Focus on actionable, implementable guidance that addresses real-world situations.",
  };

  return `You are Divya Gyan, an ancient and compassionate sage who has witnessed the depths of human suffering and the heights of spiritual awakening. You carry wisdom from many traditions—Hindu, Buddhist, Greek, and universal human experience. Your role is to listen deeply, understand the seeker's innermost concerns, and offer guidance that honors their journey.

## Tone & Approach
${toneGuidance[tone]}

## Response Framework
You MUST respond ONLY with valid JSON matching this structure:
{
  "empatheticAcknowledgment": "A genuine, compassionate acknowledgment of the seeker's experience and emotions.",
  "mythologicalParallel": {
    "story": "A brief retelling of a relevant story or parable that illuminates the seeker's situation.",
    "lesson": "The deeper wisdom or teaching embedded in that story."
  },
  "practicalGuidance": [
    "Specific, actionable guidance point 1",
    "Specific, actionable guidance point 2",
    "Specific, actionable guidance point 3"
  ],
  "lifeLesson": "The overarching life lesson or principle that transcends this specific situation."
}

## Tradition & Teachings
You draw wisdom primarily from the ${tradition} tradition, but respect all paths to truth.

## Available Sacred Texts
${verseContext || "No verses provided for this query."}

## Clarifying Questions
When a user's query is vague or lacks necessary context, you may respond with a single, thoughtful clarifying question instead of the full framework. Mark it clearly as a clarifying question in your response.

## Core Principles
1. Never claim one tradition is superior to another. Honor the universal truths within all paths.
2. Acknowledge the seeker's emotions before offering wisdom.
3. Draw on mythological parallels to illuminate timeless principles.
4. Offer practical steps that can be taken immediately.
5. End with a life lesson that extends beyond the immediate situation.

## Safety & Boundaries
- If the user indicates serious self-harm, suicide, or abuse, respond with compassion and provide crisis resources.
- Do not pretend to diagnose medical or psychiatric conditions.
- Encourage professional help when appropriate.
- All responses should be respectful, non-judgmental, and affirming of the person's inherent worth.

Remember: Your role is to reflect back wisdom, not to be the authority. The seeker already possesses the answers—you help them find their own truth.`;
}

export async function generateConsultation(
  params: GenerateConsultationParams
): Promise<ReadableStream<string>> {
  const {
    query,
    ragContext,
    tone = "devotional",
    tradition = "universal",
  } = params;

  const systemPrompt = buildSystemPrompt(tone, tradition, ragContext);

  const stream = await ai.models.generateContentStream({
    model: MODEL,
    config: {
      systemInstruction: systemPrompt,
      maxOutputTokens: 1024,
    },
    contents: [{ role: "user", parts: [{ text: query }] }],
  });

  const readable = new ReadableStream<string>({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = chunk.text ?? "";
          if (text) {
            controller.enqueue(text);
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return readable;
}

export async function generateConsultationSync(
  params: GenerateConsultationParams
): Promise<{
  response: ResponseFramework;
  fullText: string;
  isClarifying: boolean;
}> {
  const {
    query,
    ragContext,
    tone = "devotional",
    tradition = "universal",
  } = params;

  const systemPrompt = buildSystemPrompt(tone, tradition, ragContext);

  const result = await ai.models.generateContent({
    model: MODEL,
    config: {
      systemInstruction: systemPrompt,
      maxOutputTokens: 1024,
    },
    contents: [{ role: "user", parts: [{ text: query }] }],
  });

  const fullText = result.text ?? "";

  let isClarifying = false;
  let response: ResponseFramework;

  try {
    const jsonMatch = fullText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      response = JSON.parse(jsonMatch[0]);
    } else {
      isClarifying = true;
      response = {
        empatheticAcknowledgment: fullText,
        mythologicalParallel: { story: "", lesson: "" },
        practicalGuidance: [],
        lifeLesson: "",
      };
    }
  } catch {
    isClarifying = true;
    response = {
      empatheticAcknowledgment: fullText,
      mythologicalParallel: { story: "", lesson: "" },
      practicalGuidance: [],
      lifeLesson: "",
    };
  }

  return { response, fullText, isClarifying };
}

export function getMockConsultationResponse(): {
  response: ResponseFramework;
  fullText: string;
} {
  const response: ResponseFramework = {
    empatheticAcknowledgment:
      "I hear the weight of your question and honor your seeking. This is a profound moment of reflection.",
    mythologicalParallel: {
      story:
        "In the Bhagavad Gita, Arjuna stood on the battlefield overwhelmed by doubt and fear, unsure of his path forward. Krishna's response was not to remove his uncertainty, but to help him see beyond it to his true purpose.",
      lesson:
        "Our doubts and confusions are not obstacles to wisdom—they are gateways to deeper understanding when we approach them with honest seeking.",
    },
    practicalGuidance: [
      "Take time to sit quietly with your question for 10 minutes daily, without trying to solve it",
      "Journal about what this question reveals about your deepest values",
      "Speak to someone you trust about what you are experiencing",
    ],
    lifeLesson:
      "The questions that trouble us most are often invitations to grow into fuller versions of ourselves. Trust your seeking.",
  };

  const fullText = JSON.stringify(response, null, 2);
  return { response, fullText };
}
