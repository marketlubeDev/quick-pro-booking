
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "Do I need to create an account to book a service?",
      answer: "No! That's what makes us different. Simply submit your service request with your contact details, and we'll call you within minutes to connect you with a local professional. No accounts, no passwords, no hassle."
    },
    {
      question: "How quickly can I get help?",
      answer: "We typically call you back within 5 minutes of receiving your request. Depending on the service and your location, we can often schedule same-day or next-day appointments. For emergencies, many of our pros offer immediate response."
    },
    {
      question: "Are your professionals licensed and insured?",
      answer: "Absolutely. Every professional in our network is licensed, insured, and background-checked. We verify credentials and maintain high standards to ensure your safety and peace of mind."
    },
    {
      question: "What areas do you serve?",
      answer: "We currently serve major metropolitan areas across the United States and are rapidly expanding. Enter your ZIP code when requesting service to see if we cover your area. If we don't serve your location yet, we'll let you know when we do."
    },
    {
      question: "How much do services cost?",
      answer: "Pricing varies by service type, complexity, and location. Our professionals provide transparent, upfront pricing before starting any work. As a first-time customer, you'll also receive a 10% discount on your first service."
    },
    {
      question: "What if I'm not satisfied with the service?",
      answer: "Your satisfaction is our priority. If you're not completely happy with the service provided, contact us immediately. We work with our professionals to make things right and stand behind all work performed through our platform."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading mb-4">Frequently Asked Questions</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Got questions? We've got answers. Find everything you need to know about our home service platform.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border rounded-lg px-6"
                >
                  <AccordionTrigger className="text-left font-heading font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Contact CTA */}
            <div className="mt-12 text-center bg-muted/30 p-8 rounded-lg">
              <h3 className="font-heading text-xl mb-4">Still Have Questions?</h3>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? Our team is here to help.
              </p>
              <div className="space-y-4">
                <div>
                  <strong>Chat with us on WhatsApp:</strong><br/>
                  <span className="text-muted-foreground">+91 90616 63675</span>
                </div>
                <div>
                  <strong>Email us:</strong><br/>
                  <span className="text-muted-foreground">hello@skillhands.us</span>
                </div>
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

export default FAQ;
