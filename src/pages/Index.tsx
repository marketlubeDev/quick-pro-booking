
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import ServiceCard from '@/components/ServiceCard';
import TestimonialCard from '@/components/TestimonialCard';
import StepItem from '@/components/StepItem';
import PrimaryButton from '@/components/PrimaryButton';
import ProjectCard from '@/components/ProjectCard';
import ServiceSlider from '@/components/ServiceSlider';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
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
  Paintbrush
} from 'lucide-react';

const Index = () => {
  const [selectedService, setSelectedService] = useState('');
  const [zipCode, setZipCode] = useState('');

  const topServices = [
    {
      icon: Droplets,
      title: 'Plumbing',
      description: 'Leaks, clogs, installations & repairs'
    },
    {
      icon: Zap,
      title: 'Electrical',
      description: 'Wiring, outlets, lighting & safety'
    },
    {
      icon: Home,
      title: 'House Cleaning',
      description: 'Deep cleaning & regular maintenance'
    },
    {
      icon: Wind,
      title: 'AC Repair',
      description: 'HVAC service & air conditioning'
    },
    {
      icon: Wrench,
      title: 'Appliance Repair',
      description: 'Fix washers, dryers & more'
    }
  ];

  const featuredProjects = [
    {
      id: 1,
      title: 'Modern Kitchen Renovation',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
      description: 'Complete kitchen makeover with modern fixtures and appliances',
      category: 'Kitchen Renovation',
      duration: '2 weeks',
      location: 'Austin, TX'
    },
    {
      id: 2,
      title: 'Bathroom Plumbing Overhaul',
      image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600&h=400&fit=crop',
      description: 'Full bathroom plumbing replacement and fixture installation',
      category: 'Plumbing',
      duration: '1 week',
      location: 'Seattle, WA'
    },
    {
      id: 3,
      title: 'Electrical System Upgrade',
      image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&h=400&fit=crop',
      description: 'Complete home electrical system modernization',
      category: 'Electrical',
      duration: '3 days',
      location: 'Miami, FL'
    }
  ];

  const allServices = [
    {
      id: 1,
      title: 'Professional Plumbing',
      image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=400&fit=crop',
      description: 'Expert plumbing solutions for your home',
      price: 'From $89',
      rating: 4.9
    },
    {
      id: 2,
      title: 'Electrical Services',
      image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=400&fit=crop',
      description: 'Safe and reliable electrical work',
      price: 'From $120',
      rating: 4.8
    },
    {
      id: 3,
      title: 'House Cleaning',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop',
      description: 'Professional deep cleaning services',
      price: 'From $75',
      rating: 4.9
    }
  ];

  const steps = [
    {
      title: 'Select Service',
      description: 'Choose from our wide range of home services'
    },
    {
      title: 'Submit Request',
      description: 'Fill out a quick form with your details'
    },
    {
      title: 'We Call You',
      description: 'Our team contacts you within minutes'
    },
    {
      title: 'Pro Visits',
      description: 'Licensed professional arrives at your door'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'Austin, TX',
      rating: 5,
      text: 'Amazing service! The plumber fixed our leak in under an hour. No fuss, no accounts to create.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Mike Chen',
      location: 'Seattle, WA',
      rating: 5,
      text: 'Super convenient booking process. The electrician was professional and got the job done right.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Lisa Rodriguez',
      location: 'Miami, FL',
      rating: 5,
      text: 'Best home service experience ever. Fast, reliable, and the first-time discount was a nice bonus!',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    }
  ];

  const handleQuickBook = () => {
    if (selectedService && zipCode) {
      window.location.href = `/request?service=${selectedService}&zip=${zipCode}`;
    } else {
      window.location.href = '/request';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground overflow-hidden">
        {/* Discount Banner */}
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-accent text-accent-foreground px-4 py-2 rounded-lg font-heading font-semibold text-sm shadow-lg">
            🎉 10% OFF for first-time customers
          </div>
        </div>

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
                      <Select value={selectedService} onValueChange={setSelectedService}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="plumbing">Plumbing</SelectItem>
                          <SelectItem value="electrical">Electrical</SelectItem>
                          <SelectItem value="cleaning">House Cleaning</SelectItem>
                          <SelectItem value="ac-repair">AC Repair</SelectItem>
                          <SelectItem value="appliance">Appliance Repair</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Input 
                        placeholder="ZIP Code"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                      />
                      
                      <PrimaryButton onClick={handleQuickBook} className="w-full">
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
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop" 
                alt="Happy homeowner with service professional"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Top Services */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading mb-4">Most Popular Services</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get help with these common home services. Licensed professionals ready to assist you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {topServices.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
                onClick={() => window.location.href = `/services/${service.title.toLowerCase().replace(' ', '-')}`}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services">
              <PrimaryButton variant="primary">
                View All Services
              </PrimaryButton>
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
              See our recent work and successful home service projects completed by our professionals.
            </p>
          </div>

          <ProjectCard projects={featuredProjects} />

          <div className="text-center mt-12">
            <Link to="/projects">
              <PrimaryButton variant="primary">
                View All Projects
              </PrimaryButton>
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
              Professional home services with transparent pricing and guaranteed quality.
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

      {/* How It Works */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Getting help for your home has never been easier. Four simple steps to quality service.
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

      {/* Testimonials */}
      <section className="py-16 lg:py-24">
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

      {/* CTA Banner */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of satisfied homeowners who trust SkillHands.us for their home service needs.
          </p>
          <PrimaryButton 
            variant="primary" 
            size="lg"
            onClick={() => window.location.href = '/request'}
          >
            Book a Pro Now
          </PrimaryButton>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default Index;
