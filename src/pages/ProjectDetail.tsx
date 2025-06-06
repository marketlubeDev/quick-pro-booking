
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import PrimaryButton from '@/components/PrimaryButton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, CheckCircle, Star, Users } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams();
  
  // This would typically come from a database or API
  const projectData = {
    id: 1,
    title: 'Modern Kitchen Renovation',
    description: 'Complete kitchen makeover with modern fixtures, appliances, and custom cabinetry. This project transformed an outdated kitchen into a modern, functional space perfect for cooking and entertaining.',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1556909210-20ab1c2b7a96?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1556908641-3dcf0ffdbcf8?w=400&h=300&fit=crop'
    ],
    category: 'Kitchen Renovation',
    duration: '2 weeks',
    location: 'Austin, TX',
    completed: true,
    rating: 5,
    clientName: 'Sarah Johnson',
    projectDetails: {
      scope: 'Full kitchen renovation including plumbing, electrical, and custom cabinetry',
      materials: 'Quartz countertops, stainless steel appliances, custom maple cabinets',
      challenges: 'Working around existing plumbing and electrical while maintaining daily functionality',
      outcome: 'Increased home value by 15% and improved functionality dramatically'
    },
    features: [
      'Custom cabinet installation',
      'Quartz countertop installation',
      'Modern appliance setup',
      'Electrical outlet upgrades',
      'Plumbing fixture installation',
      'LED lighting system'
    ]
  };

  const handleBookSimilar = () => {
    window.location.href = `/request?service=kitchen-renovation`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 mb-6">
              <Badge className="bg-primary-foreground/20 text-primary-foreground">
                {projectData.category}
              </Badge>
              {projectData.completed && (
                <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-lg">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Completed</span>
                </div>
              )}
            </div>
            <h1 className="font-heading mb-4">{projectData.title}</h1>
            <p className="text-xl opacity-90 mb-6">{projectData.description}</p>
            
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>{projectData.duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>{projectData.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>{projectData.rating}/5 Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Client: {projectData.clientName}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Main Image */}
                <div className="relative">
                  <img 
                    src={projectData.image} 
                    alt={projectData.title}
                    className="w-full h-96 object-cover rounded-lg shadow-lg"
                  />
                </div>

                {/* Gallery */}
                <div>
                  <h2 className="font-heading text-2xl mb-6">Project Gallery</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {projectData.gallery.map((image, index) => (
                      <img 
                        key={index}
                        src={image} 
                        alt={`Project view ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-200 cursor-pointer"
                      />
                    ))}
                  </div>
                </div>

                {/* Project Features */}
                <Card>
                  <CardContent className="p-8">
                    <h2 className="font-heading text-2xl mb-6">Project Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {projectData.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Project Details */}
                <Card>
                  <CardContent className="p-8">
                    <h2 className="font-heading text-2xl mb-6">Project Details</h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-2">Project Scope</h3>
                        <p className="text-muted-foreground">{projectData.projectDetails.scope}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Materials Used</h3>
                        <p className="text-muted-foreground">{projectData.projectDetails.materials}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Challenges Overcome</h3>
                        <p className="text-muted-foreground">{projectData.projectDetails.challenges}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Project Outcome</h3>
                        <p className="text-muted-foreground">{projectData.projectDetails.outcome}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* CTA Card */}
                <Card className="sticky top-24">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-heading text-xl mb-4">Need Similar Work?</h3>
                    <p className="text-muted-foreground mb-6">
                      Get a similar project done for your home with our trusted professionals.
                    </p>
                    <PrimaryButton 
                      onClick={handleBookSimilar}
                      className="w-full"
                      size="lg"
                    >
                      Book Similar Service
                    </PrimaryButton>
                    <p className="text-sm text-muted-foreground mt-4">
                      <Badge variant="secondary" className="mb-2">10% OFF</Badge><br/>
                      First-time customer discount
                    </p>
                  </CardContent>
                </Card>

                {/* Project Stats */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-heading text-lg mb-4">Project Statistics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-semibold">{projectData.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-semibold">{projectData.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rating</span>
                        <span className="font-semibold">{projectData.rating}/5 ⭐</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant="secondary">Completed</Badge>
                      </div>
                    </div>
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

export default ProjectDetail;
