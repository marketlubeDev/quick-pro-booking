
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import PrimaryButton from '@/components/PrimaryButton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Shield, Clock, Star } from 'lucide-react';

const ServiceDetail = () => {
  const { slug } = useParams();
  
  // This would typically come from a database or API
  const serviceData = {
    title: 'Professional Plumbing Services',
    description: 'Expert plumbing solutions for your home, from emergency repairs to new installations.',
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
  };

  const handleRequestService = () => {
    window.location.href = `/request?service=${slug}`;
  };

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
            <div className="flex justify-center gap-6 mb-8">
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
                <Card className="sticky top-24">
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

                {/* Contact Info */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-heading text-lg mb-4">Need Help Deciding?</h3>
                    <p className="text-muted-foreground mb-4">
                      Chat with us on WhatsApp for instant assistance.
                    </p>
                    <PrimaryButton 
                      variant="primary"
                      className="w-full"
                      onClick={() => {
                        const message = `Hi! I need help with ${serviceData.title.toLowerCase()}.`;
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
