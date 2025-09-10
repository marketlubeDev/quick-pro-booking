import React, { useState } from "react";
import { Wrench, Home, Zap, Paintbrush, Shield, Hammer } from "lucide-react";
import { Link } from "react-router-dom";

// Service mapping to match ServiceDetail.tsx slugs
const serviceSlugMap = {
  "Plumbing": "electrical-plumbing",
  "Cleaning": "cleaning",
  "Electrical": "electrical-plumbing", 
  "Painting": "painting",
  "Security": "home-maintenance",
  "Carpentry": "home-maintenance"
};

const topServices = [
  {
    icon: Wrench,
    title: "Plumbing",
    description: "Expert plumbing repairs and installations for your home",
    color: "#3B82F6", // Blue
    lightColor: "#60A5FA",
  },
  {
    icon: Home,
    title: "Cleaning",
    description: "Professional house cleaning services you can trust",
    color: "#8B5CF6", // Purple
    lightColor: "#A78BFA",
  },
  {
    icon: Zap,
    title: "Electrical",
    description: "Licensed electricians for safe electrical work",
    color: "#f50b70", // Orange
    lightColor: "#000000",
  },
  {
    icon: Paintbrush,
    title: "Painting",
    description: "Transform your space with professional painting",
    color: "#10B981", // Green
    lightColor: "#34D399",
  },
  {
    icon: Shield,
    title: "Security",
    description: "Keep your home safe with security installations",
    color: "#6366F1", // Indigo
    lightColor: "#818CF8",
  },
  {
    icon: Hammer,
    title: "Carpentry",
    description: "Skilled carpentry for custom woodwork and repairs",
    color: "#D97706", // Amber
    lightColor: "#FBBF24",
  },
];

// Enhanced Service Card Component with 3D Icons
const ServiceCard = ({
  icon: Icon,
  title,
  description,
  onClick,
  index,
  color,
  lightColor,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const gradients = [
    "from-blue-500 to-cyan-400",
    "from-purple-500 to-pink-400",
    "from-orange-500 to-red-400",
    "from-green-500 to-teal-400",
    "from-indigo-500 to-purple-400",
  ];

  const shadowColors = [
    "group-hover:shadow-blue-500/25",
    "group-hover:shadow-purple-500/25",
    "group-hover:shadow-orange-500/25",
    "group-hover:shadow-green-500/25",
    "group-hover:shadow-indigo-500/25",
  ];

  return (
    <div
      className={`group relative cursor-pointer transform transition-all duration-700 hover:-translate-y-3 hover:scale-105`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${index * 150}ms`,
      }}
    >
      {/* Floating Background Effect */}
      <div
        className="absolute -inset-1 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"
        style={{
          background: `linear-gradient(135deg, ${color}20, ${lightColor}20)`,
          borderRadius: "16px",
        }}
      ></div>

      {/* Main Card */}
      <div
        className={`relative backdrop-blur-sm border shadow-xl ${
          shadowColors[index % shadowColors.length]
        } transition-all duration-500 hover:shadow-2xl overflow-hidden`}
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          borderRadius: "16px",
          padding: "24px",
          borderColor: "rgba(255, 255, 255, 0.3)",
          borderWidth: "1px",
        }}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${color}, transparent)`,
            }}
          ></div>
          <div
            className="absolute top-0 right-0 w-32 h-32 rounded-full transform translate-x-8 -translate-y-8"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.3), transparent)",
            }}
          ></div>
        </div>

        {/* 3D Icon Container */}
        <div className="relative mb-6 flex justify-center">
          <div className="relative">
            {/* 3D Icon Background with Enhanced Depth */}
            <div
              className="relative z-10 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-3"
              style={{
                background: `linear-gradient(135deg, ${color}, ${lightColor})`,
                padding: "20px",
                borderRadius: "20px",
                boxShadow: `
                  0 10px 30px ${color}40,
                  0 6px 16px ${color}30,
                  inset 0 1px 0 rgba(255,255,255,0.3),
                  inset 0 -1px 0 rgba(0,0,0,0.1)
                `,
                transform: isHovered
                  ? "perspective(200px) rotateX(-10deg) rotateY(10deg) translateZ(20px)"
                  : "perspective(200px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
                transformStyle: "preserve-3d",
              }}
            >
              {/* 3D Icon with Enhanced Effects */}
              <Icon
                className="transition-transform duration-500 ease-out group-hover:scale-105"
                style={{
                  width: "32px",
                  height: "32px",
                  color: "white",
                  filter: isHovered
                    ? "drop-shadow(2px 4px 8px rgba(0,0,0,0.3)) drop-shadow(0 0 12px rgba(255,255,255,0.5))"
                    : "drop-shadow(1px 2px 4px rgba(0,0,0,0.2))",
                  transform: isHovered ? "translateZ(10px)" : "translateZ(0px)",
                }}
              />

              {/* Inner Glow Effect */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at center, rgba(255,255,255,0.8), transparent 70%)`,
                  borderRadius: "20px",
                }}
              ></div>
            </div>

            {/* Enhanced 3D Shadow */}
            <div
              className="absolute inset-0 transition-all duration-700 ease-out"
              style={{
                background: `linear-gradient(135deg, ${color}, ${lightColor})`,
                borderRadius: "20px",
                opacity: isHovered ? 0.4 : 0.2,
                transform: isHovered
                  ? "translateZ(-10px) scale(1.1) blur(8px)"
                  : "translateZ(-5px) scale(1.05) blur(4px)",
                filter: "blur(6px)",
              }}
            ></div>

            {/* Multiple Glow Layers for 3D Effect */}
            <div
              className="absolute inset-0 transition-all duration-700 ease-out"
              style={{
                background: `linear-gradient(135deg, ${color}, ${lightColor})`,
                borderRadius: "20px",
                opacity: isHovered ? 0.3 : 0.1,
                transform: "scale(1.2) blur(12px)",
                zIndex: -1,
              }}
            ></div>

            {/* Floating Particles - Enhanced */}
            <div
              className="absolute opacity-0 group-hover:opacity-80 transition-all duration-500 ease-out animate-bounce"
              style={{
                top: "-4px",
                right: "-4px",
                width: "8px",
                height: "8px",
                background: "linear-gradient(135deg, #FCD34D, #F59E0B)",
                borderRadius: "50%",
                animationDelay: "0ms",
                boxShadow: "0 0 12px rgba(245, 158, 11, 0.6)",
              }}
            ></div>
            <div
              className="absolute opacity-0 group-hover:opacity-80 transition-all duration-500 ease-out animate-bounce"
              style={{
                bottom: "-4px",
                left: "-4px",
                width: "6px",
                height: "6px",
                background: "linear-gradient(135deg, #F472B6, #A855F7)",
                borderRadius: "50%",
                animationDelay: "300ms",
                boxShadow: "0 0 10px rgba(168, 85, 247, 0.6)",
              }}
            ></div>
            <div
              className="absolute opacity-0 group-hover:opacity-80 transition-all duration-500 ease-out animate-bounce"
              style={{
                top: "50%",
                right: "-8px",
                width: "4px",
                height: "4px",
                background: "linear-gradient(135deg, #34D399, #10B981)",
                borderRadius: "50%",
                animationDelay: "600ms",
                boxShadow: "0 0 8px rgba(16, 185, 129, 0.6)",
              }}
            ></div>
          </div>
        </div>

        {/* Content with Enhanced Typography */}
        <div className="relative z-10 text-center">
          <h3
            className="mb-3 transition-all duration-300 group-hover:scale-105"
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#1F2937",
              letterSpacing: "-0.025em",
              textShadow: isHovered ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
            }}
          >
            {title}
          </h3>
          <p
            className="transition-all duration-300"
            style={{
              fontSize: "14px",
              fontWeight: "400",
              color: "#6B7280",
              lineHeight: "1.6",
              textShadow: isHovered ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
            }}
          >
            {description}
          </p>
        </div>

        {/* Enhanced Hover Glow Effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.1), transparent, rgba(255,255,255,0.1))",
            borderRadius: "16px",
          }}
        ></div>

        {/* Interactive Border Animation */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)",
            borderRadius: "16px",
            transform: isHovered ? "translateX(0%)" : "translateX(-200%)",
            transition: "transform 1s ease-out",
          }}
        ></div>
      </div>
    </div>
  );
};

// Enhanced Primary Button Component
const PrimaryButton = ({ children, variant = "primary" }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className="relative overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: "16px 32px",
        fontWeight: "600",
        color: "white",
        borderRadius: "12px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
      }}
    >
      {/* Animated Background */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "linear-gradient(135deg, #3B82F6, #8B5CF6, #EC4899)",
        }}
      ></div>

      {/* Shimmer Effect */}
      <div
        className="absolute inset-0 skew-x-12 transition-transform duration-1000 ease-out"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
          transform: isHovered ? "translateX(200%)" : "translateX(-200%)",
        }}
      ></div>

      {/* Button Text */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
        <svg
          className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </span>
    </button>
  );
};

export default function StatTopService() {
  const [sectionInView, setSectionInView] = useState(false);

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInScale {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(40px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-slide-in-scale {
          animation: slideInScale 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }

        .text-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <section
        className="py-20 lg:py-28 relative overflow-hidden"
        style={{
          padding: "8rem 0",
          background:
            "linear-gradient(135deg, rgba(239, 246, 255, 0.6) 0%, rgba(237, 233, 254, 0.6) 50%, rgba(252, 231, 243, 0.6) 100%)",
        }}
      >
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated Gradient Orbs */}
          <div
            className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-float"
            style={{
              background:
                "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))",
            }}
          ></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl animate-float"
            style={{
              background:
                "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))",
              animationDelay: "2s",
            }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl animate-float"
            style={{
              background:
                "linear-gradient(135deg, rgba(34, 211, 238, 0.15), rgba(59, 130, 246, 0.15))",
              animationDelay: "4s",
            }}
          ></div>

          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(102, 126, 234, 0.3) 1px, transparent 0)",
              backgroundSize: "30px 30px",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Enhanced Header */}
          <div className="text-center mb-16">
            <div
              className="animate-fade-in-up opacity-0"
              style={{ animationDelay: "0.2s" }}
            >
              <div
                className="inline-flex items-center gap-2 mb-6"
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  padding: "8px 16px",
                  borderRadius: "24px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{
                    background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                  }}
                ></div>
                Most Popular Services
              </div>

              <h2
                className="text-gradient mb-6 leading-tight"
                style={{
                  lineHeight: "1.2",
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  fontWeight: "700",
                }}
              >
                Professional Services
                <br />
                <span
                  style={{
                    background: "none",
                    color: "#1F2937",
                    WebkitTextFillColor: "#1F2937",
                  }}
                >
                  You Can Trust
                </span>
              </h2>

              <p
                className="max-w-3xl mx-auto leading-relaxed"
                style={{
                  color: "#6B7280",
                  fontSize: "20px",
                  fontWeight: "400",
                }}
              >
                Get help with these common home services. Licensed professionals
                ready to assist you with quality work and reliable service.
              </p>

              {/* Decorative Elements */}
              <div className="flex justify-center mt-8 space-x-2">
                <div
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{
                    background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                  }}
                ></div>
                <div
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{
                    background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
                    animationDelay: "0.5s",
                  }}
                ></div>
                <div
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{
                    background: "linear-gradient(135deg, #EC4899, #F97316)",
                    animationDelay: "1s",
                    marginBottom: "3rem",
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Enhanced Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-16">
            {topServices.map((service, index) => (
              <div key={index} className="animate-slide-in-scale opacity-0">
                <ServiceCard
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  color={service.color}
                  lightColor={service.lightColor}
                  index={index}
                  onClick={() => {
                    const slug = serviceSlugMap[service.title] || service.title.toLowerCase().replace(/\s+/g, "-");
                    window.location.href = `/services/${slug}`;
                  }}
                />
              </div>
            ))}
          </div>

          {/* Enhanced CTA Section */}
          <div className="text-center" style={{ marginTop: "3rem" }}>
            <div
              className="animate-fade-in-up opacity-0"
              style={{ animationDelay: "1.5s" }}
            >
              <div className="inline-flex flex-col items-center gap-6">
                <Link to="/services">
                  <PrimaryButton variant="primary">
                    View All Services
                  </PrimaryButton>
                </Link>

                <div
                  className="flex items-center gap-4"
                  style={{
                    fontSize: "14px",
                    color: "#6B7280",
                    fontWeight: "400",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-1 h-1 rounded-full animate-pulse"
                      style={{ background: "#10B981" }}
                    ></div>
                    <span>Licensed Professionals</span>
                  </div>
                  <div
                    className="w-1 h-1 rounded-full"
                    style={{ background: "#D1D5DB" }}
                  ></div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-1 h-1 rounded-full animate-pulse"
                      style={{ background: "#3B82F6" }}
                    ></div>
                    <span>Quality Guaranteed</span>
                  </div>
                  <div
                    className="w-1 h-1 rounded-full"
                    style={{ background: "#D1D5DB" }}
                  ></div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-1 h-1 rounded-full animate-pulse"
                      style={{ background: "#8B5CF6" }}
                    ></div>
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
