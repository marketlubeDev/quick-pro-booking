
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Heart, Clock, Users } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'No Hassle Service',
      description: 'We believe getting help for your home should be simple. No accounts, no complicated processes - just quality service when you need it.'
    },
    {
      icon: Shield,
      title: 'Trust & Safety',
      description: 'Every professional in our network is licensed, insured, and background-checked. Your safety and satisfaction are our top priorities.'
    },
    {
      icon: Clock,
      title: 'Quick Response',
      description: 'Time matters when you have a home issue. We connect you with local pros fast, often within minutes of your request.'
    },
    {
      icon: Users,
      title: 'Local Community',
      description: 'We support local businesses and skilled professionals, creating stronger communities one service at a time.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading mb-4">About SkillHands.us</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            We're on a mission to make home services simple, trustworthy, and accessible to every homeowner across America.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-heading text-3xl mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Home repairs and maintenance shouldn't be stressful. That's why we created SkillHands.us - 
                  a platform that connects homeowners with trusted local professionals without the usual hassles.
                </p>
                <p className="text-lg text-muted-foreground mb-6">
                  No accounts to create, no complicated booking systems, no upfront payments. 
                  Just tell us what you need, and we'll connect you with a qualified pro who can help.
                </p>
                <p className="text-lg text-muted-foreground">
                  Whether it's an emergency repair or routine maintenance, we're here to make sure 
                  you get quality service from people you can trust.
                </p>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=600&h=400&fit=crop" 
                  alt="Happy home with professional service"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading mb-4">What We Stand For</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our values guide everything we do, from how we vet professionals to how we serve our customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How We're Different */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading mb-8">How We're Different</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto flex items-center justify-center">
                  <span className="text-2xl">🚫</span>
                </div>
                <h3 className="font-heading font-semibold">No Accounts Required</h3>
                <p className="text-muted-foreground">Skip the registration. Just submit your request and we handle the rest.</p>
              </div>
              
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-heading font-semibold">Lightning Fast</h3>
                <p className="text-muted-foreground">Get connected with a local pro in minutes, not hours or days.</p>
              </div>
              
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto flex items-center justify-center">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="font-heading font-semibold">Personal Touch</h3>
                <p className="text-muted-foreground">Real people helping real people. We're here when you need us.</p>
              </div>
            </div>

            <div className="bg-accent/10 p-8 rounded-lg">
              <h3 className="font-heading text-2xl mb-4">Ready to Experience the Difference?</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Join thousands of satisfied homeowners who trust SkillHands.us for their home service needs.
              </p>
              <p className="text-sm text-muted-foreground">
                No accounts. Just service. 
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default About;
