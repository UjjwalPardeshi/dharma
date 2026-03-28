export type Tradition = "hindu" | "buddhist" | "greek" | "universal";
export type TonePreference = "casual" | "devotional" | "philosophical" | "practical";
export type PlanType = "free" | "premium_monthly" | "premium_annual";
export type SubscriptionStatus = "active" | "cancelled" | "expired";
export type CrisisType = "suicidal_ideation" | "abuse" | "medical" | "self_neglect";
export type SafetyAction = "escalated" | "resource_provided" | "manual_review";

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  age: number | null;
  culturalBackground: string | null;
  preferredTradition: Tradition;
  image: string | null;
}

export interface UserPreferences {
  tonePreference: TonePreference;
  notificationEnabled: boolean;
  dailyWisdom: boolean;
  language: string;
}

export interface Session {
  id: string;
  userId: string;
  title: string | null;
  topicCategory: string | null;
  startedAt: string;
  lastMessageAt: string;
  endedAt: string | null;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  responseJson: ResponseFramework | null;
  citations: Citation[] | null;
  createdAt: string;
}

export interface ResponseFramework {
  empatheticAcknowledgment: string;
  mythologicalParallel: {
    story: string;
    lesson: string;
  };
  practicalGuidance: string[];
  lifeLesson: string;
}

export interface Citation {
  id: string;
  scripture: string;
  verseNumber: string;
  quote: string;
  tradition: Tradition;
}

export interface ConsultationRequest {
  query: string;
  sessionId?: string;
  preferences?: {
    tone?: TonePreference;
    tradition?: Tradition;
  };
}

export interface ConsultationResponse {
  id: string;
  sessionId: string;
  userQuery: string;
  responseFramework: ResponseFramework;
  fullResponse: string;
  citations: Citation[];
  metadata: {
    tokensUsed: number;
    responseTimeMs: number;
    crisisDetected: boolean;
    crisisType?: CrisisType;
    isClarifying: boolean;
  };
  createdAt: string;
}

export interface Scripture {
  id: string;
  title: string;
  tradition: Tradition;
  description: string | null;
  authorOrSource: string | null;
  totalVerses: number;
}

export interface Verse {
  id: string;
  scriptureId: string;
  verseNumber: string;
  text: string;
  translation: string | null;
  themes: string[];
  tags: string[];
  scripture?: Scripture;
}

export interface DailyWisdom {
  id: string;
  verse: Verse;
  aiInsight: string;
  date: string;
}

export interface Journey {
  id: string;
  title: string;
  slug: string;
  description: string;
  durationDays: number;
  theme: string;
  tradition: Tradition;
  isPremium: boolean;
}

export interface JourneyDay {
  id: string;
  journeyId: string;
  dayNumber: number;
  verse: Verse;
  reflectionPrompt: string;
  guidanceNotes: string;
}

export interface UserJourney {
  id: string;
  userId: string;
  journey: Journey;
  currentDay: number;
  startedAt: string;
  completedAt: string | null;
  status: "active" | "completed" | "paused";
}

export interface BillingUsage {
  used: number;
  limit: number;
  resetDate: string;
  planType: PlanType;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}
