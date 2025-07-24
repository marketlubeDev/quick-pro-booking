import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// SVG Icons as components
const ChevronRight = ({ className, style }) => (
  <svg
    className={className}
    style={style}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m9 18 6-6-6-6"
    />
  </svg>
);

const Star = ({ className, style, fill }) => (
  <svg
    className={className}
    style={style}
    fill={fill || "none"}
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
);

const Calendar = ({ className, style }) => (
  <svg
    className={className}
    style={style}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const MapPin = ({ className, style }) => (
  <svg
    className={className}
    style={style}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const Users = ({ className, style }) => (
  <svg
    className={className}
    style={style}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const Award = ({ className, style }) => (
  <svg
    className={className}
    style={style}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
    />
  </svg>
);

const Zap = ({ className, style }) => (
  <svg
    className={className}
    style={style}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);

const Eye = ({ className, style }) => (
  <svg
    className={className}
    style={style}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const Clock = ({ className, style }) => (
  <svg
    className={className}
    style={style}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const DollarSign = ({ className, style }) => (
  <svg
    className={className}
    style={style}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
    />
  </svg>
);

const ArrowRight = ({ className, style }) => (
  <svg
    className={className}
    style={style}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14 5l7 7m0 0l-7 7m7-7H3"
    />
  </svg>
);

const Sparkles = ({ className, style }) => (
  <svg
    className={className}
    style={style}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
);

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
    budget: "$ 35,000",
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
    budget: "$ 12,000",
    duration: "1 week",
  },
  {
    id: 3,
    title: "Electrical System Upgrade",
    description: "Complete home electrical system modernization and upgrade",
    image: "https://images.pexels.com/photos/3623785/pexels-photo-3623785.jpeg",
    category: "Electrical",
    rating: 4.8,
    completedAt: "3 days ago",
    location: "Miami, FL",
    teamSize: 2,
    budget: "$ 8,500",
    duration: "3 days",
  },
];

const ProjectCard = ({ project, index, isHovered, onHover, onLeave }) => {
  const [isClicked, setIsClicked] = useState(false);

  const getCategoryStyles = (category) => {
    switch (category) {
      case "Kitchen Renovation":
        return {
          background: "linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%)",
          color: "#FFFFFF",
        };
      case "Plumbing":
        return {
          background: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
          color: "#FFFFFF",
        };
      case "Electrical":
        return {
          background: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
          color: "#FFFFFF",
        };
      default:
        return {
          background: "linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)",
          color: "#FFFFFF",
        };
    }
  };

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
  };

  return (
    <div
      className={`group relative rounded-2xl md:rounded-3xl overflow-hidden shadow-xl transition-all duration-700 ease-out transform cursor-pointer  ${
        isHovered ? "scale-105 z-20 shadow-2xl" : "scale-100"
      } ${isClicked ? "scale-95" : ""}`}
      style={{
        borderRadius: "1rem",
        background: "linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 100%)",
        border: "1px solid rgba(226, 232, 240, 0.8)",
        boxShadow: isHovered
          ? "0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.1)"
          : "0 10px 25px rgba(0, 0, 0, 0.08)",
      }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={onLeave}
      onClick={handleClick}
    >
      {/* Image */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          style={{
            filter: "brightness(0.9) contrast(1.1)",
          }}
        />
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            background: isHovered
              ? "linear-gradient(135deg, rgba(59, 130, 246, 0.4) 0%, rgba(147, 51, 234, 0.4) 100%)"
              : "linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 100%)",
          }}
        />

        {/* Top badges */}
        <div
          className="absolute top-4 md:top-6 left-4 md:left-6 flex flex-col gap-2 md:gap-3"
          style={{ gap: "0.75rem" }}
        >
          <div
            className="flex items-center justify-center gap-1 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105"
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              width: "60px",
              height: "28px",
            }}
          >
            <Star
              className="w-3 h-3 md:w-4 md:h-4"
              style={{ color: "#F59E0B" }}
              fill="currentColor"
            />
            <span className="text-xs md:text-sm font-bold" style={{ color: "#1F2937" }}>
              {project.rating}
            </span>
          </div>
          <div
            className="px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105"
            style={{
              ...getCategoryStyles(project.category),
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            {project.category}
          </div>
        </div>

        {/* View Details Button */}
        <div
          className={`absolute bottom-4 md:bottom-6 right-4 md:right-6 transition-all duration-500 transform ${
            isHovered
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-4 scale-90"
          }`}
        >
          <button
            className="px-3 md:px-5 py-2 md:py-3 rounded-full font-bold transition-all duration-300 flex items-center gap-1 md:gap-2 shadow-xl hover:scale-105 active:scale-95 text-xs md:text-sm"
            style={{
              background: "linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 100%)",
              color: "#3B82F6",
              border: "1px solid rgba(59, 130, 246, 0.2)",
            }}
          >
            <Eye className="w-3 h-3 md:w-4 md:h-4" />
            View Details
            <ArrowRight className="w-3 h-3 md:w-4 md:h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Completed Badge */}
        <div
          className="absolute top-4 md:top-6 right-4 md:right-6 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm"
          style={{
            background: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
            color: "#FFFFFF",
          }}
        >
          ✓ Completed
        </div>
      </div>

      {/* Content */}
                        <div className="p-6 md:p-8">
                  <h3
            className="text-xl md:text-2xl font-bold mb-3 md:mb-4 transition-colors duration-300 group-hover:scale-105 transform origin-left line-clamp-2"
            style={{
              color: isHovered ? "#3B82F6" : "#111827",
            }}
          >
            {project.title}
          </h3>
          <p className="mb-4 md:mb-6 leading-relaxed text-base md:text-lg line-clamp-2" style={{ color: "#6B7280" }}>
            {project.description}
          </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-6" style={{ gap: "0.75rem" }}>
          <div
            className="flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-lg md:rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer"
            style={{
              background:
                "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 197, 253, 0.1) 100%)",
              border: "1px solid rgba(59, 130, 246, 0.1)",
            }}
          >
            <div
              className="p-2.5 md:p-3 rounded-lg md:rounded-xl"
              style={{
                background: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
              }}
            >
              <Calendar className="w-4 h-4 md:w-5 md:h-5" style={{ color: "#FFFFFF" }} />
            </div>
            <div>
              <div className="text-xs font-medium" style={{ color: "#6B7280" }}>
                COMPLETED
              </div>
              <div className="text-xs md:text-sm font-bold" style={{ color: "#111827" }}>
                {project.completedAt}
              </div>
            </div>
          </div>

          <div
            className="flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-lg md:rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer"
            style={{
              background:
                "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(52, 211, 153, 0.1) 100%)",
              border: "1px solid rgba(16, 185, 129, 0.1)",
            }}
          >
            <div
              className="p-2.5 md:p-3 rounded-lg md:rounded-xl"
              style={{
                background: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
              }}
            >
              <MapPin className="w-4 h-4 md:w-5 md:h-5" style={{ color: "#FFFFFF" }} />
            </div>
            <div>
              <div className="text-xs font-medium" style={{ color: "#6B7280" }}>
                LOCATION
              </div>
              <div className="text-xs md:text-sm font-bold" style={{ color: "#111827" }}>
                {project.location}
              </div>
            </div>
          </div>

          <div
            className="flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-lg md:rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer"
            style={{
              background:
                "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)",
              border: "1px solid rgba(139, 92, 246, 0.1)",
            }}
          >
            <div
              className="p-2.5 md:p-3 rounded-lg md:rounded-xl"
              style={{
                background: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
              }}
            >
              <Users className="w-4 h-4 md:w-5 md:h-5" style={{ color: "#FFFFFF" }} />
            </div>
            <div>
              <div className="text-xs font-medium" style={{ color: "#6B7280" }}>
                TEAM SIZE
              </div>
              <div className="text-xs md:text-sm font-bold" style={{ color: "#111827" }}>
                {project.teamSize} experts
              </div>
            </div>
          </div>

          <div
            className="flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-lg md:rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer"
            style={{
              background:
                "linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(251, 146, 60, 0.1) 100%)",
              border: "1px solid rgba(249, 115, 22, 0.1)",
            }}
          >
            <div
              className="p-2.5 md:p-3 rounded-lg md:rounded-xl"
              style={{
                background: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
              }}
            >
              <Clock className="w-4 h-4 md:w-5 md:h-5" style={{ color: "#FFFFFF" }} />
            </div>
            <div>
              <div className="text-xs font-medium" style={{ color: "#6B7280" }}>
                DURATION
              </div>
              <div className="text-xs md:text-sm font-bold" style={{ color: "#111827" }}>
                {project.duration}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-3 md:pt-4"
          style={{ borderTop: "1px solid rgba(229, 231, 235, 0.8)" }}
        >
          <div
            className="flex items-center justify-center sm:justify-start gap-1 md:gap-2 px-4 md:px-5 py-2 md:py-3 rounded-full font-bold shadow-lg transition-all duration-300 hover:scale-105 text-sm md:text-base"
            style={{
              background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
              color: "#FFFFFF",
            }}
          >
            {project.budget}
          </div>
          <button
            className="font-bold flex items-center justify-center sm:justify-end gap-1 md:gap-2 transition-all duration-300 px-4 md:px-5 py-2 md:py-3 rounded-full hover:scale-105 active:scale-95 text-sm md:text-base w-full sm:w-auto sm:ml-auto"
            style={{
              color: "#3B82F6",
              background: isHovered ? "rgba(59, 130, 246, 0.1)" : "transparent",
            }}
            onClick={() => window.location.href = `/projects/${project.id}`}
          >
            Learn More
            <ChevronRight className="w-3 h-3 md:w-4 md:h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function TopServices() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeButton, setActiveButton] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
    setTimeout(() => setActiveButton(null), 200);
  };

  return (
    <section
      className="py-12 md:py-20 lg:py-32 relative overflow-hidden min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, rgba(239, 246, 255, 0.6) 0%, rgba(237, 233, 254, 0.6) 50%, rgba(252, 231, 243, 0.6) 100%)",
        padding: "3rem 0 5rem 0",
      }}
    >
      {/* Animated Background Elements */}
      <div
        className="absolute top-10 md:top-20 left-4 md:left-20 w-20 h-20 md:w-32 md:h-32 rounded-full blur-3xl animate-pulse"
        style={{
          background:
            "linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(147, 51, 234, 0.3) 100%)",
          animation: "float 6s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-1/2 right-4 md:right-20 w-16 h-16 md:w-24 md:h-24 rounded-full blur-3xl animate-pulse"
        style={{
          background:
            "linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(236, 72, 153, 0.3) 100%)",
          animation: "float 6s ease-in-out infinite 2s",
        }}
      />
      <div
        className="absolute bottom-20 md:bottom-32 left-1/3 w-12 h-12 md:w-20 md:h-20 rounded-full blur-3xl animate-pulse"
        style={{
          background:
            "linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(249, 115, 22, 0.3) 100%)",
          animation: "float 6s ease-in-out infinite 4s",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 md:px-6 lg:px-8 xl:px-6 relative z-10">
        {/* Header */}
        <div
          className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div
            className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-bold mb-4 md:mb-6 shadow-xl transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
              color: "#FFFFFF",
            }}
          >
            <Zap className="w-4 h-4 md:w-5 md:h-5 animate-pulse" />
            Featured Projects
            <Star
              className="w-4 h-4 md:w-5 md:h-5 animate-spin"
              style={{ color: "#FCD34D" }}
              fill="currentColor"
            />
          </div>

          <h2
            className="mb-4 md:mb-6 leading-tight px-4"
            style={{ 
              color: "#111827", 
              lineHeight: "1.2",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: "700"
            }}
          >
            Our Recent <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Success Stories
            </span>
          </h2>

          <p
            className="max-w-3xl mx-auto px-4"
            style={{ 
              color: "#6B7280",
              fontSize: "20px",
              fontWeight: "400"
            }}
          >
            Discover how we've transformed homes with professional services and innovative solutions.
          </p>
        </div>

        {/* Project Cards - iPad Pro Optimized */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-6 lg:gap-7 xl:gap-8 mb-12 md:mb-16 transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ 
            margin: "2rem 0 3rem 0",
            // iPad Pro specific optimizations
            '@media (min-width: 1024px) and (max-width: 1366px)': {
              gap: '1.75rem', // 28px gap for iPad Pro
              maxWidth: '1200px',
              margin: '0 auto',
            }
          }}
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
          className="text-center px-4"
          style={{ borderRadius: "2rem", margin: "3rem 0 5rem 0" }}
        >
          <div
            className="p-6 md:p-12 rounded-2xl md:rounded-3xl shadow-2xl max-w-4xl mx-auto backdrop-blur-xl"
            style={{
              borderRadius: "1.5rem",
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <h3
              className="text-xl md:text-3xl lg:text-4xl font-black mb-4 md:mb-6"
              style={{ color: "#111827" }}
            >
              Ready to Start Your{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #4F46E5 0%, #EC4899 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Dream Project?
              </span>
            </h3>

            <p
              className="text-sm md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto"
              style={{ color: "#6B7280" }}
            >
              Join hundreds of satisfied customers who've transformed their
              homes with our expert services.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Link to="/projects">
                <button
                  className={`w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm md:text-lg shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl ${
                    activeButton === "view" ? "scale-95" : "hover:scale-105"
                  }`}
                  style={{
                    background:
                      "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                    color: "#FFFFFF",
                  }}
                  onClick={() => handleButtonClick("view")}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4 md:w-5 md:h-5" />
                    View All Projects
                  </div>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 md:mt-16 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 px-4">
          {[
            {
              label: "Projects Completed",
              value: "500+",
              icon: Award,
              gradient: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
            },
            {
              label: "Happy Customers",
              value: "450+",
              icon: Users,
              gradient: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
            },
            {
              label: "Expert Team",
              value: "25+",
              icon: Star,
              gradient: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
            },
            {
              label: "Years Experience",
              value: "10+",
              icon: Calendar,
              gradient: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:shadow-xl group"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <div
                className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: stat.gradient,
                }}
              >
                <stat.icon className="w-6 h-6 md:w-8 md:h-8" style={{ color: "#FFFFFF" }} />
              </div>
              <div
                className="text-lg md:text-2xl font-black mb-1 md:mb-2 transition-all duration-300 group-hover:scale-105"
                style={{ color: "#111827" }}
              >
                {stat.value}
              </div>
              <div className="font-medium text-xs md:text-sm" style={{ color: "#6B7280" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* iPad Pro Specific Styles */}
      <style jsx>{`
        @media (min-width: 1024px) and (max-width: 1366px) {
          /* iPad Pro 12.9" and similar large tablets */
          .container {
            max-width: 1200px !important;
            padding-left: 2rem !important;
            padding-right: 2rem !important;
          }
          
          /* Optimize project cards grid for iPad Pro */
          .grid {
            gap: 1.75rem !important;
            justify-items: center;
          }
          
          /* Ensure cards have perfect proportions on iPad Pro */
          .group {
            max-width: 380px !important;
            width: 100% !important;
          }
          
                     /* Optimize card images for iPad Pro */
           .group .relative.h-48 {
             height: 240px !important;
           }
           
           /* Fix Info Grid for iPad Pro */
           .group .grid.grid-cols-2 {
             gap: 0.75rem !important;
             grid-template-columns: 1fr 1fr !important;
           }
           
           .group .grid.grid-cols-2 > div {
             min-height: 80px !important;
             display: flex !important;
             align-items: center !important;
             padding: 12px !important;
           }
           
           .group .grid.grid-cols-2 .text-xs {
             font-size: 11px !important;
           }
           
           .group .grid.grid-cols-2 .font-bold {
             font-size: 13px !important;
           }
           
           /* Make budget button bigger on iPad Pro */
           .group .flex.items-center.justify-center.sm\\:justify-start {
             padding: 14px 16px !important;
             font-size: 16px !important;
             min-width: 100px !important;
             height: 44px !important;
           }
           
           /* Ensure footer buttons align on same line for iPad Pro */
           .group .flex.flex-col.sm\\:flex-row {
             flex-direction: row !important;
             align-items: center !important;
             justify-content: space-between !important;
           }
           
           /* Learn More button sizing for iPad Pro */
           .group .w-full.sm\\:w-auto {
             width: auto !important;
             margin-left: auto !important;
           }
         }
         
         /* iPad Pro Portrait Mode */
         @media (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {
           .grid {
             gap: 1.5rem !important;
           }
           
           .group {
             max-width: 350px !important;
             width: 100% !important;
           }
           
           /* Info Grid Portrait Mode */
           .group .grid.grid-cols-2 {
             gap: 0.5rem !important;
           }
           
           .group .grid.grid-cols-2 > div {
             min-height: 75px !important;
             padding: 10px !important;
           }
         }
        
        /* Desktop specific styling for amount button */
        @media (min-width: 1367px) {
          .group .flex.items-center.justify-center.sm\\:justify-start {
            padding: 16px 24px !important;
            font-size: 18px !important;
            min-width: 140px !important;
            height: 52px !important;
            font-weight: 700 !important;
          }
          
          /* Desktop specific styling for Learn More button */
          .group .w-full.sm\\:w-auto.sm\\:ml-auto {
            padding: 16px 24px !important;
            font-size: 16px !important;
            min-width: 140px !important;
            height: 52px !important;
            font-weight: 600 !important;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
      `}</style>
    </section>
  );
}
