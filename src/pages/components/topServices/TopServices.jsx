import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  Star,
  Calendar,
  MapPin,
  Users,
  Award,
  Zap,
  Eye,
  Clock,
  DollarSign,
} from "lucide-react";

// Featured projects data
const featuredProjects = [
  {
    id: 1,
    title: "Modern Kitchen Renovation",
    description:
      "Complete kitchen makeover with modern fixtures and appliances",
    image: "/Kitchen.png",
    category: "Kitchen Renovation",
    rating: 4.9,
    completedAt: "2 weeks ago",
    location: "Austin, TX",
    teamSize: 4,
    budget: "$35,000",
    duration: "2 weeks",
  },
  {
    id: 2,
    title: "Bathroom Plumbing Overhaul",
    description: "Full bathroom plumbing replacement and fixture installation",
    image: "/BathProj.jpg",
    category: "Plumbing",
    rating: 5.0,
    completedAt: "1 week ago",
    location: "Seattle, WA",
    teamSize: 3,
    budget: "$12,000",
    duration: "1 week",
  },
  {
    id: 3,
    title: "Electrical System Upgrade",
    description: "Complete home electrical system modernization",
    image: "/upgrade.jpg",
    category: "Electrical",
    rating: 4.8,
    completedAt: "3 days ago",
    location: "Miami, FL",
    teamSize: 2,
    budget: "$8,500",
    duration: "3 days",
  },
];

const ProjectCard = ({ project, index, isHovered, onHover, onLeave }) => {
  const getCategoryColor = (category) => {
    switch (category) {
      case "Kitchen Renovation":
        return "bg-gradient-to-r from-orange-500 to-red-500";
      case "Plumbing":
        return "bg-gradient-to-r from-blue-500 to-cyan-500";
      case "Electrical":
        return "bg-gradient-to-r from-purple-500 to-pink-500";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  return (
    <div
      className={`group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 ease-out transform hover:-translate-y-4 ${
        isHovered ? "scale-105 z-20" : "scale-100"
      } border border-gray-100`}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={onLeave}
      style={{
        animationDelay: `${index * 0.2}s`,
        boxShadow: isHovered
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          : "0 10px 25px -3px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Image Container with Overlay */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

        {/* Top Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-3">
          <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
            <Star className="w-4 h-4 text-amber-500 fill-current" />
            <span className="text-sm font-bold text-gray-800">
              {project.rating}
            </span>
          </div>
          <div
            className={`${getCategoryColor(
              project.category
            )} text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg`}
          >
            {project.category}
          </div>
        </div>

        {/* View Details Button */}
        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
          <button className="bg-white/95 backdrop-blur-sm text-gray-800 px-6 py-3 rounded-full font-bold hover:bg-white transition-colors flex items-center gap-2 shadow-xl hover:shadow-2xl transform hover:scale-105">
            <Eye className="w-5 h-5 text-blue-600" />
            View Details
          </button>
        </div>

        {/* Completion Badge */}
        <div className="absolute top-6 right-6 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          ✓ Completed
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
          {project.title}
        </h3>
        <p className="text-gray-600 mb-6 text-base leading-relaxed">
          {project.description}
        </p>

        {/* Project Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors group/stat">
            <div className="p-2 bg-blue-100 rounded-lg group-hover/stat:bg-blue-200 transition-colors">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">COMPLETED</div>
              <div className="text-sm font-bold text-gray-800">
                {project.completedAt}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors group/stat">
            <div className="p-2 bg-green-100 rounded-lg group-hover/stat:bg-green-200 transition-colors">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">LOCATION</div>
              <div className="text-sm font-bold text-gray-800">
                {project.location}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors group/stat">
            <div className="p-2 bg-purple-100 rounded-lg group-hover/stat:bg-purple-200 transition-colors">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">TEAM SIZE</div>
              <div className="text-sm font-bold text-gray-800">
                {project.teamSize} experts
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors group/stat">
            <div className="p-2 bg-orange-100 rounded-lg group-hover/stat:bg-orange-200 transition-colors">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">DURATION</div>
              <div className="text-sm font-bold text-gray-800">
                {project.duration}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
            <DollarSign className="w-4 h-4" />
            {project.budget}
          </div>
          <button className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-2 transition-all hover:gap-3 px-4 py-2 rounded-full hover:bg-blue-50">
            Learn More
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function TopServices() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden min-h-screen">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-br from-pink-400/30 to-orange-600/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-0 left-1/3 w-64 h-64 bg-gradient-to-br from-green-400/30 to-blue-600/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Floating Elements */}
        <div
          className="absolute top-20 left-20 w-4 h-4 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-40 right-32 w-3 h-3 bg-purple-500 rounded-full animate-bounce"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute bottom-32 left-16 w-5 h-5 bg-pink-500 rounded-full animate-bounce"
          style={{ animationDelay: "2.5s" }}
        ></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div
          className={`text-center mb-20 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-bold mb-8 shadow-xl hover:shadow-2xl transition-shadow">
            <Zap className="w-5 h-5 animate-pulse" />
            Featured Projects
            <Star
              className="w-5 h-5 text-yellow-300 fill-current animate-spin"
              style={{ animationDuration: "3s" }}
            />
          </div>

          <h2 className="text-5xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight">
            Our Recent
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
              Success Stories
            </span>
          </h2>

          <p className="text-gray-600 text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed font-medium">
            Discover how we've transformed homes and exceeded expectations with
            our
            <span className="text-blue-600 font-bold">
              {" "}
              professional services
            </span>{" "}
            and
            <span className="text-purple-600 font-bold">
              {" "}
              innovative solutions
            </span>
            .
          </p>
        </div>

        {/* Projects Grid */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20 transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {featuredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isHovered={hoveredCard === index}
              onHover={setHoveredCard}
              onLeave={() => setHoveredCard(null)}
            />
          ))}
        </div>

        {/* CTA Section */}
        <div
          className={`text-center transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/30 max-w-4xl mx-auto relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-3xl"></div>
            <div className="relative z-10">
              <h3 className="text-4xl font-black text-gray-900 mb-6">
                Ready to Start Your
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}
                  Dream Project
                </span>
                ?
              </h3>
              <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
                Join hundreds of satisfied customers who've transformed their
                homes with our expert services and innovative solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 flex items-center justify-center gap-3 group">
                  <Eye className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  View All Projects
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="bg-white border-3 border-gradient-to-r from-blue-500 to-purple-500 text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-2 shadow-xl hover:shadow-2xl">
                  Get Free Quote
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Bar */}
        <div
          className={`mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-1000 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {[
            {
              label: "Projects Completed",
              value: "500+",
              icon: Award,
              color: "from-green-500 to-emerald-600",
            },
            {
              label: "Happy Customers",
              value: "450+",
              icon: Users,
              color: "from-blue-500 to-cyan-600",
            },
            {
              label: "Expert Team",
              value: "25+",
              icon: Star,
              color: "from-purple-500 to-pink-600",
            },
            {
              label: "Years Experience",
              value: "10+",
              icon: Calendar,
              color: "from-orange-500 to-red-600",
            },
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="text-center p-8 bg-white/80 backdrop-blur-xl rounded-2xl hover:bg-white/95 transition-all duration-300 group shadow-xl hover:shadow-2xl transform hover:-translate-y-2 border border-white/30"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                >
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-black text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
