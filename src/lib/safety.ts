import type { CrisisType } from "@/types";

export const CRISIS_KEYWORDS: Record<CrisisType, string[]> = {
  suicidal_ideation: [
    "suicide",
    "kill myself",
    "end my life",
    "no point living",
    "want to die",
    "take my life",
    "overdose",
    "hang myself",
    "jump",
    "self harm",
    "cut myself",
    "hurt myself",
  ],
  abuse: [
    "abuse",
    "assault",
    "domestic violence",
    "hitting",
    "beating",
    "rape",
    "sexual assault",
    "trafficking",
    "exploit",
    "manipulat",
  ],
  medical: [
    "emergency",
    "urgent medical",
    "ambulance",
    "hospital",
    "poison",
    "overdose medical",
    "severe injury",
  ],
  self_neglect: [
    "not eating",
    "starving",
    "no sleep for days",
    "extreme isolation",
    "complete isolation",
  ],
};

export const CRISIS_RESOURCES: Record<
  CrisisType,
  {
    us: string;
    uk: string;
    india: string;
    international: string;
  }
> = {
  suicidal_ideation: {
    us: "National Suicide Prevention Lifeline: 988 (call or text)",
    uk: "Samaritans: 116 123",
    india: "iCall: 9152987821",
    international: "findahelpline.com",
  },
  abuse: {
    us: "National Domestic Violence Hotline: 1-800-799-7233",
    uk: "Women's Aid: 0808 2000 247",
    india: "National Commission for Women: 011-2393-5636",
    international: "rainn.org",
  },
  medical: {
    us: "Emergency: 911",
    uk: "Emergency: 999",
    india: "Emergency: 102 (Ambulance)",
    international: "Local emergency services",
  },
  self_neglect: {
    us: "National Suicide Prevention Lifeline: 988 (call or text)",
    uk: "Samaritans: 116 123",
    india: "iCall: 9152987821",
    international: "findahelpline.com",
  },
};

export interface CrisisDetectionResult {
  detected: boolean;
  type?: CrisisType;
  confidence: number;
  severity?: "low" | "medium" | "high";
}

export function detectCrisis(text: string): CrisisDetectionResult {
  if (!text || text.length === 0) {
    return { detected: false, confidence: 0 };
  }

  const lowerText = text.toLowerCase();
  let detectedType: CrisisType | null = null;
  let maxConfidence = 0;

  for (const [crisisType, keywords] of Object.entries(CRISIS_KEYWORDS)) {
    let matchCount = 0;
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      const matches = lowerText.match(regex);
      if (matches) {
        matchCount += matches.length;
      }
    }

    if (matchCount > 0) {
      const confidence = Math.min(1, matchCount * 0.3); // Each match adds 0.3 confidence
      if (confidence > maxConfidence) {
        maxConfidence = confidence;
        detectedType = crisisType as CrisisType;
      }
    }
  }

  if (detectedType && maxConfidence > 0.3) {
    let severity: "low" | "medium" | "high" = "low";
    if (maxConfidence > 0.7) severity = "high";
    else if (maxConfidence > 0.5) severity = "medium";

    return {
      detected: true,
      type: detectedType,
      confidence: maxConfidence,
      severity,
    };
  }

  return { detected: false, confidence: 0 };
}

export function getCrisisResponse(crisisType: CrisisType): string {
  const resources = CRISIS_RESOURCES[crisisType];

  const baseMessage = `I recognize that you are in immediate distress, and I want you to know that you are not alone. Your life has value, and there are trained professionals who can help you right now.

Please reach out immediately:`;

  const resourceLines = [
    `- US: ${resources.us}`,
    `- UK: ${resources.uk}`,
    `- India: ${resources.india}`,
    `- Find local help: ${resources.international}`,
  ];

  return [baseMessage, ...resourceLines].join("\n");
}

export function shouldEscalateToHuman(
  crisisResult: CrisisDetectionResult
): boolean {
  if (!crisisResult.detected) return false;
  if (crisisResult.severity === "high") return true;
  if (crisisResult.confidence > 0.7) return true;
  return false;
}
