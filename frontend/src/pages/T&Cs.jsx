import { FileText } from "lucide-react";
import useSEO from "@/hooks/useSeo";
import { Button } from "@/components/ui/button";

const colors = {
  primary: "bg-blue-800",
  primaryText: "text-blue-800",
  secondary: "bg-blue-600",
  secondaryText: "text-blue-600",
  accent: "bg-blue-400",
  accentText: "text-blue-400",
  light: "bg-blue-50",
  lightText: "text-blue-700",
  dark: "bg-blue-900",
  darkText: "text-blue-900",
};

export default function TermsAndConditionsPage() {
  useSEO({
    title: "Terms and Conditions | Visit Masvingo",
    description:
      "Review the terms and conditions for using the Visit Masvingo platform for real estate listings, bookings, and agency services.",
    url:
      typeof window !== "undefined"
        ? window.location.href
        : "https://visitmasvingo.com/terms-and-conditions",
    image: "https://visitmasvingo.com/images/masvingo-about-og.jpg",
    type: "website",
    keywords:
      "terms, conditions, agreement, visit masvingo, rules, user agreement",
  });

  return (
    <div className={`${colors.light} min-h-screen`}>
      {/* Hero */}
      <header className={`relative ${colors.dark} text-white py-20`}>
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="container px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <FileText className="h-12 w-12 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-6">Terms & Conditions</h1>
            <p className="text-xl text-blue-200">
              Please read our terms before using Visit Masvingo
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container px-4 sm:px-6 lg:px-8 py-16">
        <article className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-6 prose prose-blue">
          <p>
            These Terms and Conditions govern your use of the Visit Masvingo
            website and services. By accessing or using our platform, you agree
            to these terms in full.
          </p>

          <h2>1. Use of the Platform</h2>
          <ul>
            <li>
              You must be at least 18 years old to register or engage in property
              transactions.
            </li>
            <li>
              You agree to provide accurate and truthful information during
              registration and property listing.
            </li>
            <li>
              You are responsible for maintaining the confidentiality of your
              account credentials.
            </li>
          </ul>

          <h2>2. Listing Properties</h2>
          <ul>
            <li>
              Only verified agents and landlords may list properties for rent or
              sale.
            </li>
            <li>
              All listings must be legal, truthful, and not infringe on any third
              party rights.
            </li>
            <li>
              We reserve the right to remove listings that violate platform
              policies.
            </li>
          </ul>

          <h2>3. Payments</h2>
          <ul>
            <li>
              All payments are handled securely via third-party processors like
              Paynow.
            </li>
            <li>
              Viewing fees, booking deposits, or advertising charges are non-refundable
              unless stated otherwise.
            </li>
            <li>
              We do not store or process credit card information directly.
            </li>
          </ul>

          <h2>4. Agent Verification</h2>
          <ul>
            <li>
              Agents must upload valid license documentation for verification.
            </li>
            <li>
              Verified agents will receive a badge and enhanced listing visibility.
            </li>
            <li>
              Misuse or submission of fraudulent documents will lead to account
              suspension.
            </li>
          </ul>

          <h2>5. Intellectual Property</h2>
          <ul>
            <li>
              All platform content including logos, designs, and software are the
              property of Visit Masvingo unless otherwise stated.
            </li>
            <li>
              You may not copy, reproduce, or distribute content without written
              permission.
            </li>
          </ul>

          <h2>6. Prohibited Activities</h2>
          <ul>
            <li>Posting fake or misleading property information</li>
            <li>Impersonating agents, landlords, or users</li>
            <li>Uploading malware or attempting to hack the platform</li>
            <li>Using Visit Masvingo for any illegal or fraudulent activity</li>
          </ul>

          <h2>7. Account Termination</h2>
          <p>
            We reserve the right to suspend or delete accounts that violate these
            terms or engage in suspicious behavior, without prior notice.
          </p>

          <h2>8. Liability Disclaimer</h2>
          <p>
            While we strive to provide accurate data and secure services, Visit
            Masvingo shall not be held liable for:
          </p>
          <ul>
            <li>Losses due to incorrect listings or booking disputes</li>
            <li>Technical errors, service interruptions, or data breaches</li>
            <li>Third-party actions beyond our control</li>
          </ul>

          <h2>9. Modifications</h2>
          <p>
            We may update these Terms at any time. Continued use of the platform
            after changes implies your acceptance of the revised terms.
          </p>

          <h2>10. Governing Law</h2>
          <p>
            These Terms and Conditions are governed by the laws of Zimbabwe.
            Disputes shall be resolved under the jurisdiction of Zimbabwean
            courts.
          </p>

          <h2>11. Contact Information</h2>
          <p>
            For any questions, please contact us at{" "}
            <a href="mailto:info@visitmasvingo.com">info@visitmasvingo.com</a>
          </p>
        </article>

        {/* CTA */}
        <section
          className={`${colors.dark} text-white rounded-xl shadow-lg p-12 text-center mt-16`}
        >
          <h2 className="text-3xl font-bold mb-4">
            Committed to Transparency & Trust
          </h2>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            These Terms help keep Visit Masvingo fair and safe for everyone. Make
            sure to read and understand your rights and responsibilities.
          </p>
          <Button
            className={`bg-white ${colors.primaryText} hover:bg-blue-100 px-8 py-4 text-lg`}
          >
            Back to Home
          </Button>
        </section>
      </main>
    </div>
  );
}
