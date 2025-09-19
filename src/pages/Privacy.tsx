import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading mb-4">Privacy Policy</h1>
          <p className="text-xl opacity-90">
            Your privacy is important to us. Here's how we protect your
            information.
          </p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <div className="space-y-8">
              <p className="text-muted-foreground">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>

              <div>
                <h2 className="font-heading text-2xl mb-4">
                  Information We Collect
                </h2>
                <p className="text-muted-foreground mb-4">
                  We collect information you provide when requesting services,
                  including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Name and contact information (phone, email)</li>
                  <li>Service address and location details</li>
                  <li>Service requests and descriptions</li>
                  <li>Photos you choose to upload</li>
                  <li>Communication history with our team</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl mb-4">
                  How We Use Your Information
                </h2>
                <p className="text-muted-foreground mb-4">
                  We use your information to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Connect you with qualified service professionals</li>
                  <li>Coordinate service appointments and communication</li>
                  <li>Improve our platform and customer experience</li>
                  <li>Send service-related updates and notifications</li>
                  <li>Provide customer support</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl mb-4">
                  Information Sharing
                </h2>
                <p className="text-muted-foreground mb-4">
                  We share your information only when necessary to provide
                  services:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    With service professionals to complete your requested work
                  </li>
                  <li>
                    With our WhatsApp communication system for coordination
                  </li>
                  <li>When required by law or to protect our rights</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  We do not sell, rent, or trade your personal information to
                  third parties for marketing purposes.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl mb-4">Data Security</h2>
                <p className="text-muted-foreground">
                  We implement appropriate security measures to protect your
                  personal information against unauthorized access, alteration,
                  disclosure, or destruction. However, no internet transmission
                  is completely secure, and we cannot guarantee absolute
                  security.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl mb-4">Your Rights</h2>
                <p className="text-muted-foreground mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Access and review your personal information</li>
                  <li>Request corrections to inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Opt out of non-essential communications</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl mb-4">
                  Cookies and Tracking
                </h2>
                <p className="text-muted-foreground">
                  We use minimal cookies and tracking technologies to improve
                  website functionality and user experience. These do not
                  collect personally identifiable information unless you provide
                  it through our forms.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl mb-4">Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have questions about this Privacy Policy or how we
                  handle your information, please contact us:
                </p>
                <ul className="list-none space-y-2 text-muted-foreground mt-4">
                  <li>
                    <strong>WhatsApp:</strong>{" "}
                    <a
                      href="https://wa.me/12403608332"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      +1 240-360-8332
                    </a>
                  </li>
                  <li>
                    <strong>Email:</strong>{" "}
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=kasiedu@expedite-consults.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      kasiedu@expedite-consults.com
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl mb-4">
                  Changes to This Policy
                </h2>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will
                  notify users of significant changes by updating the date at
                  the top of this page and, when appropriate, providing
                  additional notice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FloatingWhatsApp />
    </div>
  );
};

export default Privacy;
