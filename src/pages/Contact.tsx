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

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create WhatsApp message
    const message = `
Contact Form Submission:
Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}
Message: ${formData.message}
    `.trim();

    // Open WhatsApp
    window.open(
      `https://wa.me/17622218208?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" });
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
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold mb-2">
                        Call or Text
                      </h3>
                      <p className="text-muted-foreground mb-2">
                        For immediate assistance
                      </p>
                      <p className="font-medium">+1 (762) 221-8208</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <MessageCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold mb-2">
                        WhatsApp
                      </h3>
                      <p className="text-muted-foreground mb-3">
                        Chat with us instantly
                      </p>
                      <PrimaryButton
                        size="sm"
                        onClick={() =>
                          window.open(
                            "https://wa.me/17622218208?text=Hi! I have a question about SkillHands.us",
                            "_blank"
                          )
                        }
                      >
                        Start Chat
                      </PrimaryButton>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold mb-2">Email</h3>
                      <p className="text-muted-foreground mb-2">
                        For detailed inquiries
                      </p>
                      <p className="font-medium">hello@skillhands.us</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold mb-2">
                        Service Areas
                      </h3>
                      <p className="text-muted-foreground">
                        Major metropolitan areas across the United States
                      </p>
                    </div>
                  </div>
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
