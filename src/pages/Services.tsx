import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ServiceCard from "@/components/ServiceCard";
import {
  Wrench,
  Zap,
  Droplets,
  Wind,
  Paintbrush,
  Home,
  Shield,
  Car,
  Bug,
  Package,
} from "lucide-react";

const Services = () => {
  const serviceCategories = [
    {
      icon: Home,
      title: "Home Maintenance",
      description: "General repairs, handyman services, and home upkeep",
    },
    {
      icon: Home,
      title: "Cleaning",
      description:
        "Deep cleaning, regular maintenance, and specialized cleaning",
    },
    {
      icon: Wrench,
      title: "Appliance Repairs",
      description: "Fix washers, dryers, refrigerators, and kitchen appliances",
    },
    {
      icon: Zap,
      title: "Electrical & Plumbing",
      description: "Wiring, outlets, pipes, fixtures, and safety inspections",
    },
    {
      icon: Wind,
      title: "AC & HVAC",
      description: "Air conditioning repair, heating systems, and ventilation",
    },
    {
      icon: Paintbrush,
      title: "Painting",
      description:
        "Interior and exterior painting, touch-ups, and color consultation",
    },
    {
      icon: Shield,
      title: "Roof & Gutter",
      description: "Roof repairs, gutter cleaning, and weatherproofing",
    },
    {
      icon: Home,
      title: "Lawn Care",
      description: "Landscaping, lawn maintenance, and outdoor beautification",
    },
    {
      icon: Bug,
      title: "Pest Control",
      description: "Extermination, prevention, and ongoing pest management",
    },
    {
      icon: Package,
      title: "Moving & Storage",
      description: "Local moving, packing services, and storage solutions",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading mb-4">All Home Services</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            From emergency repairs to regular maintenance, our network of
            licensed professionals is ready to help with any home service need.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceCategories.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
                onClick={() =>
                  (window.location.href = `/services/${service.title
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace("&", "and")}`)
                }
                className="h-full"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading mb-8">Why Choose SkillHands.us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <Shield className="w-12 h-12 text-primary mx-auto" />
              <h3 className="font-heading font-semibold">Licensed & Insured</h3>
              <p className="text-muted-foreground">
                All professionals are thoroughly vetted, licensed, and insured
                for your peace of mind.
              </p>
            </div>
            <div className="space-y-4">
              <Home className="w-12 h-12 text-primary mx-auto" />
              <h3 className="font-heading font-semibold">
                No Account Required
              </h3>
              <p className="text-muted-foreground">
                Skip the hassle of creating accounts. Just submit your request
                and we'll handle the rest.
              </p>
            </div>
            <div className="space-y-4">
              <Wrench className="w-12 h-12 text-primary mx-auto" />
              <h3 className="font-heading font-semibold">Quality Guaranteed</h3>
              <p className="text-muted-foreground">
                We stand behind our work with quality guarantees and customer
                satisfaction promises.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FloatingWhatsApp />
    </div>
  );
};

export default Services;
