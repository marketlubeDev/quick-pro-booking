import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const Refund = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading mb-4">Refund Policy</h1>
          <p className="text-xl opacity-90">
            Our policy regarding refunds and cancellations.
          </p>
        </div>
      </section>

      {/* Refund Policy Content */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <div className="space-y-8">
              <p className="text-muted-foreground">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>

              <div>
                <h2 className="font-heading text-2xl mb-4">
                  1. Payment Processing
                </h2>
                <p className="text-muted-foreground">
                  SkillHands.us acts as a connection platform between customers
                  and service professionals. All payments are processed directly
                  between you and the service professional. SkillHands.us does
                  not collect, hold, or process payments on behalf of service
                  providers.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl mb-4">
                  2. Refund Eligibility
                </h2>
                <p className="text-muted-foreground mb-4">
                  Refund eligibility is determined by the service professional
                  and the specific circumstances of your service request.
                  Generally, refunds may be considered in the following
                  situations:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    Service was not performed as agreed upon in writing
                  </li>
                  <li>
                    Service professional failed to show up for scheduled
                    appointment without notice
                  </li>
                  <li>
                    Work performed was significantly below agreed-upon standards
                    and cannot be remedied
                  </li>
                  <li>
                    Service was cancelled by the professional before completion
                    through no fault of the customer
                  </li>
                  <li>
                    Customer cancellation within the agreed-upon cancellation
                    period (if applicable)
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl mb-4">
                  3. Refund Process
                </h2>
                <p className="text-muted-foreground mb-4">
                  If you believe you are entitled to a refund:
                </p>
                <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                  <li>
                    Contact the service professional directly to discuss the
                    issue and attempt to resolve it
                  </li>
                  <li>
                    If unable to resolve directly, contact SkillHands.us customer
                    support
                  </li>
                  <li>
                    Provide documentation of the issue (photos, written
                    agreements, communication records)
                  </li>
                  <li>
                    Allow up to 5-7 business days for review and response
                  </li>
                  <li>
                    Refunds, if approved, will be processed by the service
                    professional using the same payment method used for the
                    original transaction
                  </li>
                </ol>
              </div>

              <div>
                <h2 className="font-heading text-2xl mb-4">
                  4. Non-Refundable Situations
                </h2>
                <p className="text-muted-foreground mb-4">
                  Refunds typically will not be provided for:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    Change of mind after service has been completed
                  </li>
                  <li>
                    Customer cancellation outside of agreed-upon cancellation
                    terms
                  </li>
                  <li>
                    Issues that could have been prevented by the customer
                    (e.g., not providing access, incorrect information)
                  </li>
                  <li>
                    Services that were performed as agreed but did not meet
                    customer expectations beyond the agreed scope
                  </li>
                  <li>
                    Damage caused by customer or third parties after service
                    completion
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl mb-4">
                  5. Partial Refunds
                </h2>
                <p className="text-muted-foreground">
                  In some cases, partial refunds may be appropriate when:
                  service was partially completed, some aspects of the work
                  require correction but the overall service was acceptable, or
                  materials were provided but work was not completed. The amount
                  of any partial refund will be determined based on the specific
                  circumstances and agreement between you and the service
                  professional.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl mb-4">
                  6. Dispute Resolution
                </h2>
                <p className="text-muted-foreground">
                  SkillHands.us will assist in facilitating communication and
                  resolution between customers and service professionals.
                  However, final refund decisions rest with the service
                  professional based on the terms of your agreement. We
                  encourage both parties to maintain clear written communication
                  and documentation throughout the service process.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl mb-4">
                  7. Processing Time
                </h2>
                <p className="text-muted-foreground">
                  If a refund is approved, processing time depends on the
                  payment method used:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    Credit/Debit cards: 5-10 business days
                  </li>
                  <li>
                    Bank transfers: 3-5 business days
                  </li>
                  <li>
                    Cash payments: Must be arranged directly with the service
                    professional
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl mb-4">
                  8. Platform Fees
                </h2>
                <p className="text-muted-foreground">
                  If SkillHands.us charges any platform or service fees, these
                  fees are generally non-refundable unless the service was
                  cancelled before any connection or coordination work was
                  performed. Any refund of platform fees will be evaluated on a
                  case-by-case basis.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl mb-4">
                  9. Contact for Refund Requests
                </h2>
                <p className="text-muted-foreground">
                  To initiate a refund request or discuss a refund-related issue,
                  please contact us:
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
                <p className="text-muted-foreground mt-4">
                  Please include your service request details, date of service,
                  service professional name, and reason for refund request when
                  contacting us.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl mb-4">
                  10. Changes to This Policy
                </h2>
                <p className="text-muted-foreground">
                  We may update this Refund Policy from time to time. We will
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

export default Refund;
