import React, { useState } from "react";
import { Wrench, Home, Zap, Paintbrush, Shield } from "lucide-react";

// Mock data - replace with your actual imports
const topServices = [
  {
    icon: Wrench,
    title: "Plumbing",
    description: "Expert plumbing repairs and installations for your home",
  },
  {
    icon: Home,
    title: "Cleaning",
    description: "Professional house cleaning services you can trust",
  },
  {
    icon: Zap,
    title: "Electrical",
    description: "Licensed electricians for safe electrical work",
  },
  {
    icon: Paintbrush,
    title: "Painting",
    description: "Transform your space with professional painting",
  },
  {
    icon: Shield,
    title: "Security",
    description: "Keep your home safe with security installations",
  },
];

// Enhanced Service Card Component
const ServiceCard = ({ icon: Icon, title, description, onClick, index }) => {
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
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

      {/* Main Card */}
      <div
        className={`relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-xl ${
          shadowColors[index % shadowColors.length]
        } transition-all duration-500 hover:shadow-2xl overflow-hidden`}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-current to-transparent"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-white/30 to-transparent rounded-full transform translate-x-8 -translate-y-8"></div>
        </div>

        {/* Icon Container - Simplified for smooth animation */}
        <div className="relative mb-6 flex justify-center">
          <div className="relative">
            {/* Main Icon Background - Single smooth transform */}
            <div
              className={`bg-gradient-to-br ${
                gradients[index % gradients.length]
              } p-4 rounded-2xl shadow-lg transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-3 relative z-10`}
            >
              <Icon className="w-8 h-8 text-white transition-transform duration-500 ease-out group-hover:scale-105" />
            </div>

            {/* Single Subtle Glow Effect */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${
                gradients[index % gradients.length]
              } rounded-2xl opacity-0 group-hover:opacity-20 transition-all duration-700 ease-out scale-110 blur-sm`}
            ></div>

            {/* Floating Particles - Reduced and smoother */}
            <div
              className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-80 transition-all duration-500 ease-out animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-80 transition-all duration-500 ease-out animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-3 transition-all duration-300 group-hover:text-gray-900 group-hover:scale-105">
            {title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed transition-all duration-300 group-hover:text-gray-700">
            {description}
          </p>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Interactive Border Animation */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)`,
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
      className="relative px-8 py-4 font-semibold text-white rounded-xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Shimmer Effect */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transition-transform duration-1000 ease-out"
        style={{
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
          background:
            "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #e0e7ff 100%)",
        }}
      >
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated Gradient Orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/15 to-blue-600/15 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "4s" }}
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
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-700 mb-6 border border-white/30">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                Most Popular Services
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-gradient mb-6 leading-tight">
                Professional Services
                <br />
                <span className="text-gray-800">You Can Trust</span>
              </h2>

              <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
                Get help with these common home services. Licensed professionals
                ready to assist you with quality work and reliable service.
              </p>

              {/* Decorative Elements */}
              <div className="flex justify-center mt-8 space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                <div
                  className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="w-3 h-3 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full animate-pulse"
                  style={{ animationDelay: "1s", marginBottom: "3rem" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Enhanced Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-16">
            {topServices.map((service, index) => (
              <div
                key={index}
                className="animate-slide-in-scale opacity-0"
                // style={{ margin: "2rem 0" }}
              >
                <ServiceCard
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  index={index}
                  onClick={() =>
                    (window.location.href = `/services/${service.title
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`)
                  }
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
                <PrimaryButton variant="primary">
                  View All Services
                </PrimaryButton>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Licensed Professionals</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>Quality Guaranteed</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse"></div>
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
