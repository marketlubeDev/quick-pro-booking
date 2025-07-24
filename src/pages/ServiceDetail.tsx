
import React, { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import PrimaryButton from '@/components/PrimaryButton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Shield, Clock, Star } from 'lucide-react';

const serviceMap: { [key: string]: any } = {
  "home-maintenance": {
    title: "Home Maintenance",
    description: "General repairs, handyman services, and home upkeep.",
    commonTasks: [
      'Leak detection and repair',
      'Drain cleaning and unclogging',
      'Faucet and fixture installation',
      'Water heater repair and replacement',
      'Pipe repair and replacement',
      'Toilet repair and installation',
      'Emergency plumbing services',
      'Sewer line maintenance'
    ],
    trustBadges: [
      { icon: Shield, text: 'Licensed' },
      { icon: CheckCircle, text: 'Insured' },
      { icon: Star, text: 'Background-Checked' }
    ],
    averageRating: 4.9,
    completedJobs: 2547
  },
  "cleaning": {
    title: "Cleaning Services",
    description: "Deep cleaning, regular maintenance, and specialized cleaning.",
    commonTasks: [
      'Deep cleaning of all rooms',
      'Window washing',
      'Carpet cleaning',
      'Furniture dusting',
      'Appliance cleaning',
      'Kitchen deep cleaning',
      'Bathroom sanitization',
      'Move-in/out cleaning'
    ],
    trustBadges: [
      { icon: Shield, text: 'Licensed' },
      { icon: CheckCircle, text: 'Insured' },
      { icon: Star, text: 'Background-Checked' }
    ],
    averageRating: 4.8,
    completedJobs: 1800
  },
  "appliance-repairs": {
    title: "Appliance Repairs",
    description: "Fix washers, dryers, refrigerators, and kitchen appliances.",
    commonTasks: [
      'Washer and dryer repair',
      'Refrigerator and freezer repair',
      'Oven and stove repair',
      'Microwave repair',
      'Dishwasher repair',
      'Garbage disposal repair',
      'Water dispenser repair',
      'Appliance installation'
    ],
    trustBadges: [
      { icon: Shield, text: 'Licensed' },
      { icon: CheckCircle, text: 'Insured' },
      { icon: Star, text: 'Background-Checked' }
    ],
    averageRating: 4.9,
    completedJobs: 3200
  },
  "electrical-plumbing": {
    title: "Electrical & Plumbing",
    description: "Wiring, outlets, pipes, fixtures, and safety inspections.",
    commonTasks: [
      'Electrical panel upgrades',
      'Lighting installation and repair',
      'Water heater installation',
      'Pipe repair and replacement',
      'Faucet and fixture installation',
      'Sewer line maintenance',
      'Electrical safety inspection',
      'Outlet and switch repair'
    ],
    trustBadges: [
      { icon: Shield, text: 'Licensed' },
      { icon: CheckCircle, text: 'Insured' },
      { icon: Star, text: 'Background-Checked' }
    ],
    averageRating: 4.7,
    completedJobs: 2800
  },
  "ac-hvac": {
    title: "AC & HVAC",
    description: "Air conditioning repair, heating systems, and ventilation.",
    commonTasks: [
      'Air conditioner repair and maintenance',
      'Heating system repair and replacement',
      'Ventilation system repair',
      'Duct cleaning and sealing',
      'Thermostat repair and replacement',
      'Air filter replacement',
      'HVAC system tune-up',
      'Emergency HVAC services'
    ],
    trustBadges: [
      { icon: Shield, text: 'Licensed' },
      { icon: CheckCircle, text: 'Insured' },
      { icon: Star, text: 'Background-Checked' }
    ],
    averageRating: 4.9,
    completedJobs: 4000
  },
  "painting": {
    title: "Painting",
    description: "Interior and exterior painting, touch-ups, and color consultation.",
    commonTasks: [
      'Interior and exterior painting',
      'Wall preparation and repair',
      'Color consultation and selection',
      'Trim and baseboard painting',
      'Door and window painting',
      'Ceiling painting',
      'Specialty finishes (e.g., faux finishes, murals)',
      'Interior wall repair'
    ],
    trustBadges: [
      { icon: Shield, text: 'Licensed' },
      { icon: CheckCircle, text: 'Insured' },
      { icon: Star, text: 'Background-Checked' }
    ],
    averageRating: 4.8,
    completedJobs: 3500
  },
  "roof-gutter": {
    title: "Roof & Gutter",
    description: "Roof repairs, gutter cleaning, and weatherproofing.",
    commonTasks: [
      'Roof inspection and repair',
      'Gutter cleaning and repair',
      'Downspout repair and replacement',
      'Roof flashing repair',
      'Weatherproofing installation',
      'Roof vent repair',
      'Gutter guard installation',
      'Gutter replacement'
    ],
    trustBadges: [
      { icon: Shield, text: 'Licensed' },
      { icon: CheckCircle, text: 'Insured' },
      { icon: Star, text: 'Background-Checked' }
    ],
    averageRating: 4.9,
    completedJobs: 3000
  },
  "lawn-care": {
    title: "Lawn Care",
    description: "Landscaping, lawn maintenance, and outdoor beautification.",
    commonTasks: [
      'Mowing and trimming',
      'Edging and weed control',
      'Fertilization and weed control',
      'Tree and shrub trimming',
      'Hedge trimming',
      'Leaf removal',
      'Pruning',
      'Outdoor lighting installation'
    ],
    trustBadges: [
      { icon: Shield, text: 'Licensed' },
      { icon: CheckCircle, text: 'Insured' },
      { icon: Star, text: 'Background-Checked' }
    ],
    averageRating: 4.7,
    completedJobs: 2500
  },
  "pest-control": {
    title: "Pest Control",
    description: "Extermination, prevention, and ongoing pest management.",
    commonTasks: [
      'Extermination services (e.g., ants, spiders, rodents)',
      'Preventive treatments',
      'Ongoing pest management',
      'Termite inspection and treatment',
      'Rodent exclusion',
      'Bird control',
      'Ant control',
      'Pest-proofing'
    ],
    trustBadges: [
      { icon: Shield, text: 'Licensed' },
      { icon: CheckCircle, text: 'Insured' },
      { icon: Star, text: 'Background-Checked' }
    ],
    averageRating: 4.9,
    completedJobs: 4500
  },
  "moving-storage": {
    title: "Moving & Storage",
    description: "Local moving, packing services, and storage solutions.",
    commonTasks: [
      'Local moving services',
      'Packing and unpacking',
      'Storage solutions',
      'Furniture disassembly and reassembly',
      'Heavy item moving',
      'Storage unit delivery and pickup',
      'Packing materials',
      'Unpacking and organization'
    ],
    trustBadges: [
      { icon: Shield, text: 'Licensed' },
      { icon: CheckCircle, text: 'Insured' },
      { icon: Star, text: 'Background-Checked' }
    ],
    averageRating: 4.8,
    completedJobs: 3800
  },
};

const normalizeSlug = (slug = "") =>
  slug
    .toLowerCase()
    .replace(/\s+/g, "-")      // spaces to hyphens
    .replace(/&/g, "-")         // & to hyphen
    .replace(/and/g, "-")       // and to hyphen
    .replace(/\//g, "-")       // slashes to hyphens
    .replace(/-+/g, "-")        // multiple hyphens to single
    .replace(/[^a-z0-9-]/g, ""); // remove any other non-alphanum/hyphen

const ServiceDetail = () => {
  const { slug } = useParams();
  const normalizedSlug = normalizeSlug(slug);
  const serviceData = serviceMap[normalizedSlug] || {
    title: "Service Not Found",
    description: "We couldn't find the service you're looking for.",
    commonTasks: [],
    trustBadges: [],
    averageRating: 0,
    completedJobs: 0
  };

  const handleRequestService = () => {
    window.location.href = `/request?service=${normalizedSlug}`;
  };

  const [hideFirstCard, setHideFirstCard] = useState(false);
  const secondCardRef = useRef(null);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        // If the top of the second card is at or above the sticky offset, hide the first card
        setHideFirstCard(entry.boundingClientRect.top <= 96); // 96px = top-24
      },
      {
        root: null,
        threshold: 0,
      }
    );
    if (secondCardRef.current) {
      observer.observe(secondCardRef.current);
    }
    return () => {
      if (secondCardRef.current) {
        observer.unobserve(secondCardRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading mb-4">{serviceData.title}</h1>
            <p className="text-xl opacity-90 mb-8">{serviceData.description}</p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-8">
              {serviceData.trustBadges.map((badge, index) => (
                <div key={index} className="flex items-center space-x-2 bg-primary-foreground/10 px-4 py-2 rounded-lg">
                  <badge.icon className="w-5 h-5" />
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 text-sm">
              <div className="text-center">
                <div className="font-heading font-bold text-2xl">{serviceData.averageRating}</div>
                <div className="opacity-90">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="font-heading font-bold text-2xl">{serviceData.completedJobs.toLocaleString()}</div>
                <div className="opacity-90">Jobs Completed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                <Card>
                  <CardContent className="p-8">
                    <h2 className="font-heading text-2xl mb-6">Common Tasks We Handle</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {serviceData.commonTasks.map((task, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                          <span>{task}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-8">
                    <h2 className="font-heading text-2xl mb-6">What to Expect</h2>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold mb-1">Quick Response</h3>
                          <p className="text-muted-foreground">We'll call you within minutes of your request to schedule your service.</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold mb-1">Professional Service</h3>
                          <p className="text-muted-foreground">Licensed, insured professionals with the right tools and expertise.</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold mb-1">Quality Guarantee</h3>
                          <p className="text-muted-foreground">We stand behind our work with satisfaction guarantees.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Sticky CTA */}
                {!hideFirstCard && (
                  <Card className="sticky top-24 z-10">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-heading text-xl mb-4">Ready to Get Started?</h3>
                    <p className="text-muted-foreground mb-6">
                      No account required. Just tell us what you need and we'll connect you with a local pro.
                    </p>
                    <PrimaryButton 
                      onClick={handleRequestService}
                      className="w-full"
                      size="lg"
                    >
                      Request This Service
                    </PrimaryButton>
                    <p className="text-sm text-muted-foreground mt-4">
                      <Badge variant="secondary" className="mb-2">10% OFF</Badge><br/>
                      First-time customer discount
                    </p>
                  </CardContent>
                </Card>
                )}

                {/* Contact Info */}
                <Card ref={secondCardRef} className="sticky top-60 z-50">
                  <CardContent className="p-6">
                    <h3 className="font-heading text-lg mb-4">Need Help Deciding?</h3>
                    <p className="text-muted-foreground mb-4">
                      Chat with us on WhatsApp for instant assistance.
                    </p>
                    <PrimaryButton 
                      variant="primary"
                      className="w-full"
                      onClick={() => {
                        const message = `Hi! I need help with ${serviceData.title.toLowerCase().replace(/\s+/g, '-').replace('&', 'and').replace(/\//g, '-').replace(/-+/g, '-').replace(/[^a-z0-9-]/g, '')}.`;
                        window.open(`https://wa.me/12403608332?text=${encodeURIComponent(message)}`, '_blank');
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

export default ServiceDetail;
