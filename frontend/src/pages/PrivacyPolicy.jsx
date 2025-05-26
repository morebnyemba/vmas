import { ShieldCheck } from "lucide-react";
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

export default function PrivacyPolicyPage() {
  useSEO({
    title: "Privacy Policy | Visit Masvingo",
    description:
      "Learn how Visit Masvingo collects, uses, stores, and protects your personal information.",
    url:
      typeof window !== "undefined"
        ? window.location.href
        : "https://visitmasvingo.com/privacy-policy",
    image: "https://visitmasvingo.com/images/masvingo-about-og.jpg",
    type: "website",
    keywords: "privacy, Visit Masvingo, personal data, protection, cookies",
  });

  return (
    <div className={`${colors.light} min-h-screen`}>
      {/* Hero */}
      <header className={`relative ${colors.dark} text-white py-20`}>
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="container px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <ShieldCheck className="h-12 w-12 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl text-blue-200">
              How we collect, use, and protect your information at Visit Masvingo
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container px-4 sm:px-6 lg:px-8 py-16">
        <article className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-6 prose prose-blue">
          <p>
            This Privacy Policy describes how Visit Masvingo collects, uses,
            and discloses information when you use our platform and services.
          </p>

          <h2>1. Information We Collect</h2>
          <ul>
            <li>
              <strong>Personal Information:</strong> Full name, email address,
              phone number, and contact preferences.
            </li>
            <li>
              <strong>Account Details:</strong> Login credentials, agent license
              numbers, and property listing information.
            </li>
            <li>
              <strong>Technical Data:</strong> IP address, device type,
              operating system, browser type, and access times.
            </li>
            <li>
              <strong>Usage Data:</strong> Pages visited, clicks, time spent,
              search history, and interactions with listings.
            </li>
            <li>
              <strong>Payment Information:</strong> If you make payments, we may
              collect transaction details, though sensitive card data is handled
              securely via Paynow or other third-party providers.
            </li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To create and manage your user or agent account</li>
            <li>To match you with relevant listings and agents</li>
            <li>To improve the platform’s usability and performance</li>
            <li>To verify agent identity and validate license information</li>
            <li>To send updates, alerts, marketing messages, and service notifications</li>
            <li>To ensure safety, prevent fraud, and comply with legal requirements</li>
          </ul>

          <h2>3. Data Sharing and Disclosure</h2>
          <p>
            We do not sell your personal information. We may share your data
            with:
          </p>
          <ul>
            <li>Trusted third-party service providers (e.g., hosting, email, analytics)</li>
            <li>Payment processors (e.g., Paynow, Stripe, etc.)</li>
            <li>Government or law enforcement agencies when required by law</li>
            <li>Other users when explicitly authorized by you (e.g., contact agent requests)</li>
          </ul>

          <h2>4. Data Retention</h2>
          <p>
            We retain your data for as long as your account is active, and as
            necessary to fulfill legal, accounting, or reporting obligations.
          </p>

          <h2>5. Cookies and Tracking</h2>
          <p>
            We use cookies and similar technologies to enhance your browsing
            experience, understand usage patterns, and deliver relevant content.
            You may opt out through your browser settings.
          </p>

          <h2>6. Your Rights</h2>
          <ul>
            <li>Access your data and request a copy</li>
            <li>Update or correct inaccurate information</li>
            <li>Request deletion of your personal data</li>
            <li>Withdraw consent for data processing at any time</li>
            <li>Lodge a complaint with a data protection authority</li>
          </ul>

          <h2>7. Data Security</h2>
          <p>
            We take security seriously and use encryption, firewalls, secure
            servers, and access control to protect your data.
          </p>

          <h2>8. Third-Party Services</h2>
          <p>
            We are not responsible for the privacy practices of external
            websites or services linked to from our platform. Please review
            their respective policies.
          </p>

          <h2>9. Children’s Privacy</h2>
          <p>
            Our services are not directed at individuals under 18. We do not
            knowingly collect personal data from minors.
          </p>

          <h2>10. Updates to this Policy</h2>
          <p>
            We may revise this Privacy Policy periodically. The latest version
            will be posted on this page with a new effective date.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            If you have questions or concerns about this policy, please contact
            us at:{" "}
            <a href="mailto:info@visitmasvingo.com">
              info@visitmasvingo.com
            </a>
          </p>
        </article>

        {/* CTA */}
        <section
          className={`${colors.dark} text-white rounded-xl shadow-lg p-12 text-center mt-16`}
        >
          <h2 className="text-3xl font-bold mb-4">
            We Respect and Protect Your Data
          </h2>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            Your trust is important to us. This policy ensures that your data
            remains safe while you explore, list, or book properties on Visit
            Masvingo.
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
