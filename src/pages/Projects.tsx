import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, CheckCircle } from "lucide-react";

const Projects = () => {
  const allProjects = [
    {
      id: 1,
      title: "Modern Kitchen Renovation",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
      description:
        "Complete kitchen makeover with modern fixtures and appliances",
      category: "Kitchen Renovation",
      duration: "2 weeks",
      location: "Austin, TX",
      completed: true,
    },
    {
      id: 2,
      title: "Bathroom Plumbing Overhaul",
      image:
        "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600&h=400&fit=crop",
      description:
        "Full bathroom plumbing replacement and fixture installation",
      category: "Plumbing",
      duration: "1 week",
      location: "Seattle, WA",
      completed: true,
    },
    {
      id: 3,
      title: "Electrical System Upgrade",
      image:
        "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&h=400&fit=crop",
      description: "Complete home electrical system modernization",
      category: "Electrical",
      duration: "3 days",
      location: "Miami, FL",
      completed: true,
    },
    {
      id: 4,
      title: "HVAC Installation",
      image:
        "https://images.unsplash.com/photo-1615870216519-2f9fa76b15f7?w=600&h=400&fit=crop",
      description: "New HVAC system installation for improved efficiency",
      category: "HVAC",
      duration: "2 days",
      location: "Denver, CO",
      completed: true,
    },
    {
      id: 5,
      title: "Home Painting Project",
      image:
        "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop",
      description: "Interior and exterior painting with premium materials",
      category: "Painting",
      duration: "1 week",
      location: "Phoenix, AZ",
      completed: true,
    },
    {
      id: 6,
      title: "Roof Repair & Maintenance",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
      description: "Comprehensive roof repair and weatherproofing",
      category: "Roofing",
      duration: "3 days",
      location: "Portland, OR",
      completed: true,
    },
  ];

  const handleProjectClick = (projectId: number) => {
    window.location.href = `/projects/${projectId}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading mb-4">Our Projects</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Explore our portfolio of successful home service projects. Each
            project showcases our commitment to quality workmanship and customer
            satisfaction.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProjects.map((project) => (
              <Card
                key={project.id}
                className="cursor-pointer hover-lift hover:shadow-lg transition-all duration-200"
                onClick={() => handleProjectClick(project.id)}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                      {project.category}
                    </Badge>
                    {project.completed && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-1">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading font-semibold text-lg mb-2">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {project.description}
                    </p>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{project.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{project.location}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default Projects;
