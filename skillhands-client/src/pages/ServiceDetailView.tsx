import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import PrimaryButton from "@/components/PrimaryButton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Shield, Star, Clock, MapPin } from "lucide-react";

const ServiceDetailView = () => {
  const { id } = useParams();

  // This would typically come from a database or API
  const serviceData = {
    id: 1,
    title: "Professional Plumbing Services",
    description:
      "Expert plumbing solutions for your home, from emergency repairs to new installations. Our licensed professionals provide reliable, efficient service.",
    image:
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&h=600&fit=crop",
    price: "From $89",
    rating: 4.9,
    completedJobs: 1247,
    responseTime: "< 30 minutes",
    availability: "24/7 Emergency",
    commonServices: [
      "Leak detection and repair",
      "Drain cleaning and unclogging",
      "Faucet and fixture installation",
      "Water heater repair and replacement",
      "Pipe repair and replacement",
      "Toilet repair and installation",
      "Emergency plumbing services",
      "Sewer line maintenance",
    ],
    features: [
      "Licensed and insured professionals",
      "Same-day service available",
      "Upfront pricing with no hidden fees",
      "Quality parts and materials",
      "1-year warranty on all work",
      "Emergency 24/7 availability",
    ],
    serviceAreas: [
      "Austin, TX",
      "Dallas, TX",
      "Houston, TX",
      "San Antonio, TX",
    ],
  };

  const handleRequestService = () => {
    window.location.href = `/request?service=plumbing`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 mb-6">
              <Badge className="bg-accent text-accent-foreground text-lg px-4 py-2">
                {serviceData.price}
              </Badge>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span>{serviceData.rating}</span>
                <span className="opacity-75">
                  ({serviceData.completedJobs} jobs)
                </span>
              </div>
            </div>
            <h1 className="font-heading mb-4">{serviceData.title}</h1>
            <p className="text-xl opacity-90 mb-6">{serviceData.description}</p>

            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Response: {serviceData.responseTime}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>{serviceData.availability}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Main Image */}
                <div className="relative">
                  <img
                    src={serviceData.image}
                    alt={serviceData.title}
                    className="w-full h-96 object-cover rounded-lg shadow-lg"
                  />
                </div>

                {/* Common Services */}
                <Card>
                  <CardContent className="p-8">
                    <h2 className="font-heading text-2xl mb-6">
                      Services We Provide
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {serviceData.commonServices.map((service, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3"
                        >
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                          <span>{service}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Service Features */}
                <Card>
                  <CardContent className="p-8">
                    <h2 className="font-heading text-2xl mb-6">
                      Why Choose Our Service
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {serviceData.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Shield className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Service Areas */}
                <Card>
                  <CardContent className="p-8">
                    <h2 className="font-heading text-2xl mb-6">
                      Service Areas
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {serviceData.serviceAreas.map((area, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>{area}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* CTA Card */}
                <Card className="sticky top-24">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-heading text-xl mb-4">
                      Ready to Get Started?
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Book this service now and get a licensed professional at
                      your door.
                    </p>
                    <PrimaryButton
                      onClick={handleRequestService}
                      className="w-full"
                      size="lg"
                    >
                      Request This Service
                    </PrimaryButton>
                    <p className="text-sm text-muted-foreground mt-4">
                      <Badge variant="secondary" className="mb-2">
                        10% OFF
                      </Badge>
                      <br />
                      First-time customer discount
                    </p>
                  </CardContent>
                </Card>

                {/* Service Stats */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-heading text-lg mb-4">
                      Service Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Starting Price
                        </span>
                        <span className="font-semibold">
                          {serviceData.price}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Average Rating
                        </span>
                        <span className="font-semibold">
                          {serviceData.rating}/5 ⭐
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Jobs Completed
                        </span>
                        <span className="font-semibold">
                          {serviceData.completedJobs.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Response Time
                        </span>
                        <span className="font-semibold">
                          {serviceData.responseTime}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-heading text-lg mb-4">Need Help?</h3>
                    <p className="text-muted-foreground mb-4">
                      Chat with us on WhatsApp for instant assistance.
                    </p>
                    <PrimaryButton
                      variant="primary"
                      className="w-full"
                      onClick={() => {
                        const message = `Hi! I need help with ${serviceData.title.toLowerCase()}.`;
                        window.open(
                          `https://wa.me/12403608332?text=${encodeURIComponent(
                            message
                          )}`,
                          "_blank"
                        );
                      }}
                    >
                      Chat on WhatsApp
                    </PrimaryButton>
                  </CardContent>
                </Card>
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

export default ServiceDetailView;
