import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-parchment border-b border-saffron/20">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              &larr; Home
            </Button>
          </Link>
          <h1 className="text-4xl font-display text-saffron">Terms of Service</h1>
          <p className="text-muted-foreground mt-2">
            Last updated: March 2024
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <section>
          <h2 className="text-2xl font-display text-foreground mb-4">
            1. Agreement to Terms
          </h2>
          <p className="text-foreground leading-relaxed">
            By accessing and using Divya Gyan, you agree to be bound by these
            Terms of Service. If you do not agree to these terms, you may not
            use the service. We reserve the right to modify these terms at any
            time. Your continued use of the service after such modifications
            constitutes your acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-display text-foreground mb-4">
            2. Use License
          </h2>
          <p className="text-foreground leading-relaxed mb-4">
            We grant you a limited, non-exclusive, non-transferable license to
            use Divya Gyan for personal, non-commercial purposes. You agree not
            to:
          </p>
          <ul className="space-y-2 text-foreground">
            <li>• Reproduce, duplicate, or copy content without permission</li>
            <li>• Sell, resell, or exploit the service for commercial gain</li>
            <li>• Use automated tools to scrape or download content</li>
            <li>• Attempt to gain unauthorized access to the service</li>
            <li>
              • Harass, abuse, or threaten other users or our team
            </li>
            <li>• Submit illegal, harmful, or offensive content</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-display text-foreground mb-4">
            3. User Accounts
          </h2>
          <p className="text-foreground leading-relaxed">
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activities that occur under your
            account. You agree to provide accurate information when registering
            and to notify us immediately of any unauthorized access.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-display text-foreground mb-4">
            4. Important Disclaimer
          </h2>
          <p className="text-foreground leading-relaxed font-semibold mb-4">
            Divya Gyan is not a substitute for professional mental health care,
            medical advice, or crisis intervention.
          </p>
          <p className="text-foreground leading-relaxed">
            The guidance provided by Divya Gyan is for informational and
            inspirational purposes only. If you are experiencing a mental health
            crisis, thoughts of self-harm, abuse, or a medical emergency, please
            contact emergency services or a crisis helpline immediately. Our AI
            may detect crisis indicators and provide resources, but this does
            not replace immediate professional intervention.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-display text-foreground mb-4">
            5. Intellectual Property
          </h2>
          <p className="text-foreground leading-relaxed">
            All content on Divya Gyan, including text, images, and code, is
            owned by Divya Gyan or licensed from third parties. You may not
            reproduce, distribute, or transmit any content without our express
            written permission.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-display text-foreground mb-4">
            6. User-Generated Content
          </h2>
          <p className="text-foreground leading-relaxed">
            By submitting questions, reflections, or feedback through Divya
            Gyan, you grant us the right to use this content to improve the
            service, train our AI, and provide guidance to you. We will not
            share your personal information with third parties without your
            consent.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-display text-foreground mb-4">
            7. Payment & Subscription
          </h2>
          <div className="space-y-4 text-foreground">
            <p>
              If you upgrade to a paid subscription, you agree to pay the
              indicated fees. Subscriptions automatically renew unless you cancel
              them. You can cancel your subscription at any time through your
              account settings.
            </p>
            <p>
              Refunds are provided according to our refund policy. Some
              jurisdictions may require specific refund periods, which will be
              honored.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-display text-foreground mb-4">
            8. Limitation of Liability
          </h2>
          <p className="text-foreground leading-relaxed">
            To the fullest extent permitted by law, Divya Gyan shall not be
            liable for any indirect, incidental, consequential, or punitive
            damages arising from your use of the service, including but not
            limited to emotional distress, lost profits, or damage to
            relationships.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-display text-foreground mb-4">
            9. Indemnification
          </h2>
          <p className="text-foreground leading-relaxed">
            You agree to indemnify and hold harmless Divya Gyan, its founders,
            and employees from any claims, damages, or costs arising from your
            violation of these terms or any applicable laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-display text-foreground mb-4">
            10. Termination
          </h2>
          <p className="text-foreground leading-relaxed">
            We may terminate or suspend your account and access to Divya Gyan
            at any time, with or without cause, and without notice. Upon
            termination, your right to use the service ceases immediately.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-display text-foreground mb-4">
            11. Severability
          </h2>
          <p className="text-foreground leading-relaxed">
            If any provision of these terms is found to be unenforceable, the
            remaining provisions shall continue in full force and effect.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-display text-foreground mb-4">
            12. Entire Agreement
          </h2>
          <p className="text-foreground leading-relaxed">
            These Terms of Service, together with our Privacy Policy, constitute
            the entire agreement between you and Divya Gyan regarding the
            service and supersede any prior agreements.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-display text-foreground mb-4">
            13. Contact
          </h2>
          <p className="text-foreground leading-relaxed">
            If you have questions about these Terms of Service, please contact
            us at{" "}
            <a
              href="mailto:legal@divyagyan.com"
              className="text-saffron hover:underline"
            >
              legal@divyagyan.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
