import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import PrimaryButton from "@/components/PrimaryButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";
import { contactApi } from "@/lib/api";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (field: string, value: string) => {
    if (field === "name") {
      // Allow only letters, spaces, and full stops
      if (!/^[a-zA-Z .]*$/.test(value)) {
        return; // Ignore invalid input
      }
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      const result = await contactApi.submitForm({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });
      if (result.success) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error(result.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      toast.error("Network error. Please check your connection and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading mb-4">Get In Touch</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Have a question, feedback, or need help? We're here for you. Reach
            out anytime.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <a
                    href="tel:+12403608332"
                    className="block hover:bg-gray-50 transition-colors"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Phone className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold mb-2 text-[22px]">
                          Call or Text
                        </h3>
                        <p className="text-muted-foreground mb-2">
                          For immediate assistance
                        </p>
                        <p className="font-medium">+1 240-360-8332</p>
                      </div>
                    </div>
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <a
                    href="https://wa.me/12403608332?text=Hi! I have a question about SkillHands.us"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:bg-gray-50 transition-colors"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <MessageCircle className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold mb-2 text-[22px]">
                          WhatsApp
                        </h3>
                        <p className="text-muted-foreground mb-3">
                          Chat with us instantly
                        </p>
                        <PrimaryButton
                          size="sm"
                          className="bg-[#fbc94b] text-[#0d3359] hover:bg-[#fbc94b]/90"
                        >
                          Start Chat
                        </PrimaryButton>
                      </div>
                    </div>
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=kasiedu@expedite-consults.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:bg-gray-50 transition-colors"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Mail className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold mb-2 text-[22px]">Email</h3>
                        <p className="text-muted-foreground mb-2">
                          For detailed inquiries
                        </p>
                        {/* <p className="font-medium">kasiedu@expedite-consults.com</p> */}
                      </div>
                    </div>
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <a
                    href="https://maps.google.com/?q=3 Oak Run Rd, Laurel MD, 20724"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:bg-gray-50 transition-colors"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold mb-2 ">
                          Service Areas
                        </h3>
                        <p className="text-muted-foreground mb-2">
                          Visit us or send mail to our main address
                        </p>
                        {/* <p className="font-medium">3 Oak Run Rd, Laurel MD, 20724</p> */}
                      </div>
                    </div>
                  </a>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">
                    Send Us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        required
                        value={formData.subject}
                        onChange={(e) =>
                          handleInputChange("subject", e.target.value)
                        }
                        placeholder="What is this about?"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        required
                        value={formData.message}
                        onChange={(e) =>
                          handleInputChange("message", e.target.value)
                        }
                        placeholder="Tell us how we can help..."
                        rows={6}
                      />
                    </div>

                    <PrimaryButton type="submit" size="lg">
                      Send Message
                    </PrimaryButton>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl mb-8">
            Need a Service Right Now?
          </h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Skip the contact form and get help immediately
            </p>
            <PrimaryButton
              size="lg"
              onClick={() => (window.location.href = "/request")}
            >
              Request Service Now
            </PrimaryButton>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default Contact;
