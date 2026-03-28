"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CRISIS_RESOURCES } from "@/lib/safety";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is Divya Gyan?",
    answer:
      "Divya Gyan is an AI-powered wisdom companion that draws from spiritual and philosophical traditions including Hindu, Buddhist, Greek, and universal wisdom. It provides thoughtful guidance on life's challenges through a lens of spiritual wisdom combined with practical advice.",
  },
  {
    question: "How do I ask a question?",
    answer:
      "Navigate to the main Chat page and type your question or concern in the input box at the bottom. You can ask about relationships, career, purpose, grief, ethics, stress, finances, leadership, or any life challenge. Be as detailed as you'd like—the more context you provide, the more personalized the guidance can be.",
  },
  {
    question: "Is Divya Gyan a substitute for therapy or professional help?",
    answer:
      "No. Divya Gyan is a wisdom companion that supplements professional support—it cannot and should not replace therapy, counseling, or medical advice. If you're experiencing significant emotional distress, mental health concerns, or medical issues, please reach out to a qualified professional. Divya Gyan works best alongside, not instead of, professional care.",
  },
  {
    question: "What traditions does Divya Gyan draw from?",
    answer:
      "Divya Gyan incorporates wisdom from Hindu scriptures (Bhagavad Gita, Upanishads), Buddhist teachings, Greek philosophy (Stoicism, Socratic wisdom), Taoist principles, and universal wisdom that transcends traditions. You can request guidance from a specific tradition if you prefer.",
  },
  {
    question: "What are Guided Journeys?",
    answer:
      "Guided Journeys are structured reflection programs that take you through a series of days (typically 7, 14, or 21 days) focused on specific themes like purpose, healing, resilience, or relationships. Each day includes a sacred verse and a reflection prompt, with AI guidance based on your personal reflections.",
  },
  {
    question: "How many consultations can I do on the free plan?",
    answer:
      "The free plan includes 5 consultations per month. Once you reach your limit, you can either wait for the next month or upgrade to Premium for unlimited access.",
  },
  {
    question: "What's included in Premium?",
    answer:
      "Premium includes unlimited consultations, access to all traditions, advanced guidance features, exclusive guided journeys, priority support, and an ad-free experience. Choose between monthly ($9.99/mo) or annual ($79/yr) billing.",
  },
  {
    question: "If I feel like I'm in crisis, what should I do?",
    answer:
      "If you're experiencing thoughts of suicide, abuse, or a medical emergency, please contact emergency services or a crisis helpline immediately. Divya Gyan can provide resources, but it's not a substitute for immediate professional help.",
  },
  {
    question: "Is my information private and secure?",
    answer:
      "Yes. Your conversations and personal data are encrypted and protected according to industry standards. We do not share your information with third parties. See our Privacy Policy for more details.",
  },
  {
    question: "Can I use Divya Gyan on mobile?",
    answer:
      "Yes, Divya Gyan is fully responsive and works on mobile phones and tablets. You can access it through any web browser.",
  },
  {
    question: "What if I have feedback or want to report an issue?",
    answer:
      "We'd love to hear from you. You can send feedback or report issues by clicking the feedback button in the app or emailing us directly. Your input helps us improve Divya Gyan.",
  },
  {
    question: "How does Divya Gyan create personalized responses?",
    answer:
      "When you ask a question, Divya Gyan analyzes your query, considers the wisdom traditions that best address your situation, and generates a response using a 4-layer framework: empathetic acknowledgment, mythological or spiritual parallels, practical guidance, and life lessons you can apply.",
  },
];

export default function HelpPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-display text-saffron mb-2">
            Help & FAQ
          </h1>
          <p className="text-muted-foreground">
            Answers to common questions about Divya Gyan
          </p>
        </div>

        {/* FAQs */}
        <div className="space-y-3 mb-12">
          {faqs.map((faq, idx) => (
            <button
              key={idx}
              onClick={() => toggleExpanded(idx)}
              className="w-full text-left"
            >
              <Card
                className={`p-4 transition-all border-2 ${
                  expandedIndex === idx
                    ? "border-saffron bg-parchment"
                    : "border-border hover:border-saffron/50"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-base font-semibold text-foreground flex-1">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0 text-saffron mt-1">
                    {expandedIndex === idx ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>
                {expandedIndex === idx && (
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </Card>
            </button>
          ))}
        </div>

        {/* Crisis Resources */}
        <div className="mb-12">
          <h2 className="text-2xl font-display text-foreground mb-4">
            Crisis Resources
          </h2>
          <Card className="p-6 bg-red-50 border-red-200">
            <p className="text-red-900 mb-4 font-semibold">
              If you are in crisis or having thoughts of self-harm, please reach
              out for immediate help:
            </p>

            <div className="space-y-4">
              <div>
                <p className="font-semibold text-red-900 mb-1">
                  United States
                </p>
                <p className="text-red-800">
                  {CRISIS_RESOURCES.suicidal_ideation.us}
                </p>
              </div>
              <div>
                <p className="font-semibold text-red-900 mb-1">
                  United Kingdom
                </p>
                <p className="text-red-800">
                  {CRISIS_RESOURCES.suicidal_ideation.uk}
                </p>
              </div>
              <div>
                <p className="font-semibold text-red-900 mb-1">India</p>
                <p className="text-red-800">
                  {CRISIS_RESOURCES.suicidal_ideation.india}
                </p>
              </div>
              <div>
                <p className="font-semibold text-red-900 mb-1">International</p>
                <p className="text-red-800">
                  {CRISIS_RESOURCES.suicidal_ideation.international}
                </p>
              </div>
            </div>

            <Button
              onClick={() => window.open("https://findahelpline.com", "_blank")}
              className="mt-4 bg-red-600 text-white hover:bg-red-700 w-full"
            >
              Find a Helpline Near You
            </Button>
          </Card>
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="text-2xl font-display text-foreground mb-4">
            Contact & Feedback
          </h2>
          <Card className="p-6 bg-parchment border-saffron/20">
            <p className="text-foreground mb-4">
              Have questions we haven't answered? Want to share feedback or
              report an issue?
            </p>
            <p className="text-foreground mb-4">
              Email us at{" "}
              <a
                href="mailto:support@divyagyan.com"
                className="text-saffron hover:underline"
              >
                support@divyagyan.com
              </a>
            </p>
            <p className="text-sm text-muted-foreground">
              We read every message and appreciate your input as we continue to
              develop Divya Gyan.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
