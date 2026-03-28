import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-display text-saffron">Privacy Policy</h1>
          <p className="text-muted-foreground mt-2">
            Last updated: March 2024
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <section>
          <h2 className="text-2xl font-display text-foreground mb-4">
            1. Introduction
          </h2>
          <p className="text-foreground leading-relaxed">
            Divya Gyan ("we," "us," "our," or "Company") is committed to
            protecting your privacy. This Privacy Policy explains how we
            collect, use, disclose, and otherwise process personal information
            in connection with our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-display text-foreground mb-4">
            2. Information We Collect
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Account Information
              </h3>
              <p className="text-foreground leading-relaxed">
                When you create an account, we collect your email address, name,
                and optional profile information (age, cultural background,
                preferred tradition).
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Usage Data
              </h3>
              <p className="text-foreground leading-relaxed">
                We collect information about your interactions with Divya Gyan,
                including consultations, journeys, preferences, and engagement
                metrics.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Communication Data
              </h3>
              <p className="text-foreground leading-relaxed">
                Your questions, reflections, and feedback submitted through the
                service are stored to provide personalized guidance and improve
                our service.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-display text-foreground mb-4">
            3. How We Use Your Information
          </h2>
          <ul className="space-y-2 text-foreground">
            <li>• To provide and improve the Divya Gyan service</li>
            <li>• To personalize your experience and recommendations</li>
            <li>• To process payments and manage your subscription</li>
            <li>• To send service updates and support communications</li>
            <li>• To detect and prevent fraud or security issues</li>
            <li>• To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-display text-foreground mb-4">
            4. Data Security
          </h2>
          <p className="text-foreground leading-relaxed">
            We implement industry-standard security measures including encryption,
            secure servers, and access controls to protect your personal
            information from unauthorized access, alteration, and disclosure.
            However, no method of transmission over the internet or electronic
            storage is completely secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-display text-foreground mb-4">
            5. Data Sharing
          </h2>
          <p className="text-foreground leading-relaxed">
            We do not sell, rent, or share your personal information with third
            parties for their marketing purposes. We may share information with
            trusted service providers who assist us in operating the service,
            subject to confidentiality agreements.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-display text-foreground mb-4">
            6. Your Rights
          </h2>
          <p className="text-foreground leading-relaxed mb-4">
            Depending on your jurisdiction, you may have rights to:
          </p>
          <ul className="space-y-2 text-foreground">
            <li>• Access your personal information</li>
            <li>• Correct inaccurate data</li>
            <li>• Request deletion of your data</li>
            <li>• Opt out of certain communications</li>
            <li>• Port your data to another service</li>
          </ul>
          <p className="text-foreground leading-relaxed mt-4">
            To exercise these rights, please contact us at{" "}
            <a
              href="mailto:privacy@divyagyan.com"
              className="text-saffron hover:underline"
            >
              privacy@divyagyan.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-display text-foreground mb-4">
            7. Cookies & Tracking
          </h2>
          <p className="text-foreground leading-relaxed">
            We use cookies and similar technologies to enhance your experience,
            remember your preferences, and understand how you use Divya Gyan.
            You can control cookie settings through your browser.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-display text-foreground mb-4">
            8. Children's Privacy
          </h2>
          <p className="text-foreground leading-relaxed">
            Divya Gyan is not intended for users under 13 years of age. We do
            not knowingly collect personal information from children. If we
            discover we have collected information from a child under 13, we
            will delete it promptly.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-display text-foreground mb-4">
            9. Changes to This Policy
          </h2>
          <p className="text-foreground leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify
            you of material changes by updating the date above or sending you a
            notice through the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-display text-foreground mb-4">
            10. Contact Us
          </h2>
          <p className="text-foreground leading-relaxed">
            If you have questions about this Privacy Policy or our privacy
            practices, please contact us at{" "}
            <a
              href="mailto:privacy@divyagyan.com"
              className="text-saffron hover:underline"
            >
              privacy@divyagyan.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
