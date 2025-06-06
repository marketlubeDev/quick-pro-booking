import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ServiceCard from "@/components/ServiceCard";
import TestimonialCard from "@/components/TestimonialCard";
import StepItem from "@/components/StepItem";
import PrimaryButton from "@/components/PrimaryButton";
import ProjectCard from "@/components/ProjectCard";
import ServiceSlider from "@/components/ServiceSlider";
import { Input } from "@/components/ui/input";
import Pop from "@/pages/components/index/Pop";
import EmergencyServices from "@/pages/components/emergency/EmergencyServices";
import Stat from "@/pages/components/stat/Stat";
import {
  topServices,
  featuredProjects,
  allServices,
  steps,
  testimonials,
  whyChooseUs,
  certifications,
  seasonalServices,
  emergencyServices,
  serviceAreas,
} from "@/data/getData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Search,
  Phone,
  CheckCircle,
  Shield,
  Clock,
  Wrench,
  Zap,
  Droplets,
  Wind,
  Paintbrush,
  Users,
  Award,
  ThumbsUp,
  Headphones,
  AlertTriangle,
  Star,
  MapPin,
  Calendar,
  DollarSign,
  Snowflake,
  Sun,
  Leaf,
  Building,
  Hammer,
  Truck,
} from "lucide-react";

const Index = () => {
  const [selectedService, setSelectedService] = useState("");
  const [zipCode, setZipCode] = useState("");

  const handleQuickBook = () => {
    if (selectedService && zipCode) {
      window.location.href = `/request?service=${selectedService}&zip=${zipCode}`;
    } else {
      window.location.href = "/request";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground overflow-hidden">
        {/* Discount Banner */}
        <Pop />

        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 fade-in-up">
              <h1 className="font-heading">Need a Trusted Local Pro?</h1>
              <h2 className="text-xl md:text-2xl font-normal opacity-90">
                Book Quality Home Services — No Hassle, No Logins.
              </h2>

              {/* Quick Booking Strip */}
              <Card className="bg-background/95 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Select
                        value={selectedService}
                        onValueChange={setSelectedService}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="plumbing">Plumbing</SelectItem>
                          <SelectItem value="electrical">Electrical</SelectItem>
                          <SelectItem value="cleaning">
                            House Cleaning
                          </SelectItem>
                          <SelectItem value="ac-repair">AC Repair</SelectItem>
                          <SelectItem value="appliance">
                            Appliance Repair
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <Input
                        placeholder="ZIP Code"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                      />

                      <PrimaryButton
                        onClick={handleQuickBook}
                        className="w-full"
                      >
                        Request Service →
                      </PrimaryButton>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Licensed & Insured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Background Checked</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Same-Day Service</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                // src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop"
                src="/home.png"
                alt="Happy homeowner with service professional"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <Stat />
      {/* Top Services */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading mb-4">Most Popular Services</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get help with these common home services. Licensed professionals
              ready to assist you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {topServices.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
                onClick={() =>
                  (window.location.href = `/services/${service.title
                    .toLowerCase()
                    .replace(" ", "-")}`)
                }
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services">
              <PrimaryButton variant="primary">View All Services</PrimaryButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading mb-4">Featured Projects</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              See our recent work and successful home service projects completed
              by our professionals.
            </p>
          </div>

          <ProjectCard projects={featuredProjects} />

          <div className="text-center mt-12">
            <Link to="/projects">
              <PrimaryButton variant="primary">View All Projects</PrimaryButton>
            </Link>
          </div>
        </div>
      </section>

      {/* All Services Slider */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading mb-4">Our Services</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Professional home services with transparent pricing and guaranteed
              quality.
            </p>
          </div>

          <ServiceSlider services={allServices} />

          <div className="text-center mt-12">
            <Link to="/services">
              <PrimaryButton variant="primary">
                Explore All Services
              </PrimaryButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Seasonal Services */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading mb-4">Seasonal Home Services</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Prepare your home for every season with our specialized services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {seasonalServices.map((season, index) => (
              <Card
                key={index}
                className="overflow-hidden hover-lift transition-all duration-200"
              >
                <div
                  className={`bg-gradient-to-r ${season.color} p-6 text-white`}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <season.icon className="w-8 h-8" />
                    <h3 className="font-heading font-semibold text-2xl">
                      {season.season}
                    </h3>
                  </div>
                </div>
                <CardContent className="p-6">
                  <ul className="space-y-2">
                    {season.services.map((service, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>
                  <PrimaryButton className="w-full mt-4" variant="primary">
                    Book {season.season} Service
                  </PrimaryButton>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading mb-4">Why Choose SkillHands.us?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're committed to providing the best home service experience with
              trusted professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <Card
                key={index}
                className="text-center p-6 hover-lift transition-all duration-200"
              >
                <CardContent className="p-0">
                  <div className="flex justify-center mb-4">
                    <div className="bg-primary p-3 rounded-full">
                      <item.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Trust */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading mb-4">Trusted by Thousands</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're proud of our reputation and certifications from leading
              industry organizations.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <Card
                key={index}
                className="text-center p-6 hover-lift transition-all duration-200"
              >
                <CardContent className="p-0">
                  <div className="flex justify-center mb-3">
                    <div className="bg-primary p-3 rounded-full">
                      <Award className="w-6 h-6 text-primary-foreground" />
                    </div>
                  </div>
                  <h3 className="font-heading font-semibold text-sm mb-2">
                    {cert.name}
                  </h3>
                  <Badge variant="secondary">{cert.rating}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Getting help for your home has never been easier. Four simple
              steps to quality service.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <StepItem
                key={index}
                number={index + 1}
                title={step.title}
                description={step.description}
                isLast={index === steps.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Money-Back Guarantee */}
      <section className="py-16 lg:py-24 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <DollarSign className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <h2 className="font-heading mb-4 text-green-800">
              100% Satisfaction Guarantee
            </h2>
            <p className="text-green-700 text-lg mb-8 max-w-2xl mx-auto">
              Not satisfied with our service? We'll make it right or refund your
              money. That's our promise to every homeowner.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Quality Guarantee</h3>
                <p className="text-sm text-green-600">
                  Work must meet our high standards
                </p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Insurance Protected</h3>
                <p className="text-sm text-green-600">
                  Full coverage for peace of mind
                </p>
              </div>
              <div className="text-center">
                <Clock className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Timely Service</h3>
                <p className="text-sm text-green-600">
                  On-time or we compensate you
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading mb-4">What Homeowners Say</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Real reviews from real customers who love our hassle-free service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                name={testimonial.name}
                location={testimonial.location}
                rating={testimonial.rating}
                text={testimonial.text}
                avatar={testimonial.avatar}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading mb-4">Service Areas</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We proudly serve homeowners across major cities and suburban
              areas.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
            {serviceAreas.map((city, index) => (
              <div
                key={index}
                className="bg-muted/50 rounded-lg p-4 hover:bg-muted transition-colors cursor-pointer"
              >
                <div className="font-semibold text-primary flex items-center justify-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{city}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">
              Don't see your city? We're expanding fast!
            </p>
            <PrimaryButton variant="primary">
              Request Service in Your Area
            </PrimaryButton>
          </div>
        </div>
      </section>

      {/* Recent Success Stories */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading mb-4">Recent Success Stories</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Real problems solved by our trusted professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                issue: "Emergency Pipe Burst",
                location: "Austin, TX",
                time: "Fixed in 2 hours",
                story:
                  "Late night pipe burst flooded kitchen. Team arrived within 30 minutes and had it fixed before morning.",
                rating: 5,
              },
              {
                issue: "AC System Replacement",
                location: "Miami, FL",
                time: "Completed in 1 day",
                story:
                  "Old AC unit died during heatwave. New energy-efficient system installed same day with warranty.",
                rating: 5,
              },
              {
                issue: "Electrical Panel Upgrade",
                location: "Seattle, WA",
                time: "Safety certified",
                story:
                  "Outdated electrical panel was a fire hazard. Upgraded to modern standards with permits and inspection.",
                rating: 5,
              },
            ].map((story, index) => (
              <Card
                key={index}
                className="hover-lift transition-all duration-200"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary">{story.time}</Badge>
                    <div className="flex">
                      {[...Array(story.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-500 fill-current"
                        />
                      ))}
                    </div>
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">
                    {story.issue}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    {story.story}
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{story.location}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <EmergencyServices />

      {/* CTA Banner */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of satisfied homeowners who trust SkillHands.us for
            their home service needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <PrimaryButton
              variant="primary"
              size="lg"
              onClick={() => (window.location.href = "/request")}
            >
              Book a Pro Now
            </PrimaryButton>
            <PrimaryButton
              variant="primary"
              size="lg"
              className="bg-transparent border-2 border-accent-foreground text-accent-foreground hover:bg-accent-foreground hover:text-accent"
              onClick={() => {
                const message =
                  "Hi! I'd like to learn more about your home services.";
                window.open(
                  `https://wa.me/919061663675?text=${encodeURIComponent(
                    message
                  )}`,
                  "_blank"
                );
              }}
            >
              Chat on WhatsApp
            </PrimaryButton>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default Index;
