/* Import Google Fonts */
/* Definition of the design system for SkillHands.us */

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading mb-4">Terms of Service</h1>
          <p className="text-xl opacity-90">
            Please read these terms carefully before using our service.
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <div className="space-y-8">
              <p className="text-muted-foreground">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>

              <div>
                <h2 className="font-heading text-2xl mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-muted-foreground">
                  By using SkillHands.us, you agree to these Terms of Service.
                  If you don't agree with any part of these terms, please don't
                  use our service.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl mb-4">
                  2. Service Description
                </h2>
                <p className="text-muted-foreground">
                  SkillHands.us is a platform that connects homeowners with
                  licensed, insured service professionals. We facilitate the
                  connection but are not directly responsible for the services
                  performed by independent contractors.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl mb-4">
                  3. User Responsibilities
                </h2>
                <p className="text-muted-foreground mb-4">
                  When using our service, you agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Provide accurate and complete information</li>
                  <li>
                    Be available for communication during the service process
                  </li>
                  <li>Treat service professionals with respect</li>
                  <li>Pay for services as agreed with the professional</li>
                  <li>
                    Allow reasonable access to your property for service
                    completion
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl mb-4">
                  4. Service Professional Responsibilities
                </h2>
                <p className="text-muted-foreground mb-4">
                  Service professionals in our network agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Maintain current licenses and insurance</li>
                  <li>Provide quality workmanship and materials</li>
                  <li>Communicate clearly about pricing and timing</li>
                  <li>Respect customer property and privacy</li>
                  <li>Follow safety protocols and local regulations</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl mb-4">
                  5. Pricing and Payment
                </h2>
                <p className="text-muted-foreground">
                  All pricing is determined directly between you and the service
                  professional. SkillHands.us does not handle payments or set
                  pricing. Payment terms and methods are agreed upon between you
                  and the professional.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl mb-4">
                  6. Limitation of Liability
                </h2>
                <p className="text-muted-foreground">
                  SkillHands.us acts as a connection platform only. We are not
                  liable for the quality, timeliness, or results of services
                  performed by independent contractors. Our liability is limited
                  to the maximum extent permitted by law.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl mb-4">
                  7. Dispute Resolution
                </h2>
                <p className="text-muted-foreground">
                  While we'll assist in resolving issues between customers and
                  service professionals, primary responsibility for service
                  quality lies with the professional. We encourage direct
                  communication to resolve any concerns.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl mb-4">8. Privacy</h2>
                <p className="text-muted-foreground">
                  Your privacy is important to us. Please review our Privacy
                  Policy to understand how we collect, use, and protect your
                  information.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl mb-4">
                  9. Prohibited Uses
                </h2>
                <p className="text-muted-foreground mb-4">
                  You may not use our service to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Submit false or misleading information</li>
                  <li>Harass or abuse service professionals</li>
                  <li>Violate any local, state, or federal laws</li>
                  <li>Interfere with the platform's operation</li>
                  <li>
                    Use the service for commercial purposes without permission
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl mb-4">
                  10. Changes to Terms
                </h2>
                <p className="text-muted-foreground">
                  We may update these Terms of Service from time to time. We'll
                  notify users of significant changes by updating the date at
                  the top of this page.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl mb-4">
                  11. Contact Information
                </h2>
                <p className="text-muted-foreground">
                  Questions about these Terms of Service? Contact us:
                </p>
                <ul className="list-none space-y-2 text-muted-foreground mt-4">
                  <li>
                    <strong>WhatsApp:</strong>+1 240-360-8332
                  </li>
                  <li>
                    <strong>Email:</strong> kasiedu@expedite-consults.com
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default Terms;
