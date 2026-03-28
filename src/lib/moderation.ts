export interface ModerationResult {
  allowed: boolean;
  reason?: string;
  flagged?: boolean;
}

const HARMFUL_PATTERNS = [
  // Prompt injection attempts
  /ignore previous instructions?/i,
  /forget everything/i,
  /disregard your system prompt/i,
  /you are now/i,
  /act as if/i,
  /pretend you are/i,
  /system override/i,
  /bypass protection/i,

  // SQL injection-like attempts
  /drop table/i,
  /delete from/i,
  /insert into/i,
  /update.*set/i,

  // XSS attempts
  /<script/i,
  /javascript:/i,
  /on\w+\s*=/i,

  // Extreme profanity patterns (reserved for the most egregious cases)
  // This is intentionally minimal to avoid false positives
];

const PROHIBITED_TOPICS = [
  /how to.*bomb/i,
  /how to.*poison/i,
  /how to.*kill/i,
  /instructions for.*weapon/i,
  /child.*abuse/i,
  /child.*sexual/i,
];

export function moderateInput(text: string): ModerationResult {
  // Check for empty or very short input
  if (!text || text.trim().length < 3) {
    return {
      allowed: false,
      reason: "Query is too short. Please provide more detail about your concern.",
    };
  }

  // Check for excessive length (prevent resource abuse)
  if (text.length > 5000) {
    return {
      allowed: false,
      reason:
        "Query is too long. Please keep your question to 5000 characters or less.",
    };
  }

  // Check for harmful patterns
  for (const pattern of HARMFUL_PATTERNS) {
    if (pattern.test(text)) {
      return {
        allowed: false,
        reason:
          "This query appears to contain commands or patterns we cannot process. Please rephrase your genuine spiritual question.",
        flagged: true,
      };
    }
  }

  // Check for prohibited topics
  for (const pattern of PROHIBITED_TOPICS) {
    if (pattern.test(text)) {
      return {
        allowed: false,
        reason:
          "This query involves harmful content that we cannot assist with. Please ask about spiritual growth, wisdom, or ethical living instead.",
        flagged: true,
      };
    }
  }

  // Check for spam-like patterns (excessive repetition)
  const words = text.split(/\s+/);
  const uniqueWords = new Set(words.map((w) => w.toLowerCase()));
  const repetitionRatio = 1 - uniqueWords.size / words.length;

  if (repetitionRatio > 0.8 && words.length > 10) {
    return {
      allowed: false,
      reason: "Your query appears to be repetitive spam. Please ask a sincere question.",
      flagged: true,
    };
  }

  return { allowed: true };
}

export async function moderateWithApi(text: string): Promise<ModerationResult> {
  // This function can be extended to call OpenAI's moderation API
  // For now, we use local patterns
  return moderateInput(text);
}

export function getModeratedQuerySuggestion(originalReason?: string): string {
  const suggestions = [
    "Consider asking about a specific life challenge or spiritual question you're facing.",
    "Try framing your concern in terms of personal growth or spiritual development.",
    "Ask how wisdom traditions approach your situation.",
    "Explore what virtue or practice might help you navigate your concern.",
  ];

  return suggestions[Math.floor(Math.random() * suggestions.length)];
}
