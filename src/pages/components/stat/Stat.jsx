import React, { useState, useEffect } from "react";
import { TrendingUp, Users, Award, Zap } from "lucide-react";

// Sample stats data - replace with your actual data
const stats = [
  { icon: TrendingUp, number: "150K+", label: "Active Users" },
  { icon: Users, number: "50K+", label: "Community Members" },
  { icon: Award, number: "200+", label: "Awards Won" },
  { icon: Zap, number: "99.9%", label: "Uptime" },
];

export default function Stat() {
  const [counters, setCounters] = useState(stats.map(() => 0));
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const animateCounters = () => {
      stats.forEach((stat, index) => {
        const target = parseInt(stat.number.replace(/[^0-9.]/g, ""));
        if (isNaN(target)) return;

        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          setCounters((prev) => {
            const newCounters = [...prev];
            newCounters[index] = Math.floor(current);
            return newCounters;
          });
        }, 30);
      });
    };

    const delay = setTimeout(animateCounters, 500);
    return () => clearTimeout(delay);
  }, [isVisible]);

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-25%);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-pulse-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-bounce-custom {
          animation: bounce 1s infinite;
        }

        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, transparent 70%);
        }

        .text-gradient {
          background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .border-gradient {
          background: linear-gradient(white, white) padding-box,
                      linear-gradient(135deg, rgba(59, 130, 246, 0.5), rgba(147, 51, 234, 0.5)) border-box;
          border: 2px solid transparent;
        }

        .card-glow:hover {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25),
                      0 0 40px rgba(59, 130, 246, 0.15),
                      0 0 80px rgba(147, 51, 234, 0.1);
        }

        .icon-gradient {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
        }
      `}</style>

      <section
        className="py-20 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #e0e7ff 100%)",
        }}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.1) 50%, transparent 100%)",
              transform: "skewY(-1deg)",
            }}
          ></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl bg-gradient-radial"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Stats Container - Force Single Row */}
          <div className="flex flex-wrap justify-center lg:flex-nowrap lg:justify-between gap-4 lg:gap-6 max-w-7xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`group relative flex-1 min-w-0 lg:min-w-[200px] ${
                  isVisible ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{
                  animationDelay: `${index * 150}ms`,
                }}
              >
                {/* Main Card */}
                <div
                  className="relative border-gradient rounded-2xl p-4 lg:p-6 transition-all duration-700 hover:-translate-y-2 cursor-pointer card-glow"
                  style={{
                    background: "transparent",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  {/* Hover Glow Effect */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 50%, rgba(236, 72, 153, 0.05) 100%)",
                    }}
                  ></div>

                  {/* Content Container */}
                  <div className="relative z-10">
                    {/* Icon Container */}
                    <div className="flex justify-center mb-4 lg:mb-6">
                      <div className="relative animate-float">
                        {/* Main Icon */}
                        <div className="icon-gradient p-3 lg:p-4 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 relative z-20 shadow-lg">
                          <stat.icon className="w-6 h-6 lg:w-8 lg:h-8 text-white transition-all duration-300 group-hover:scale-110" />
                        </div>

                        {/* Animated Rings */}
                        <div
                          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-glow"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3))",
                          }}
                        ></div>
                        <div
                          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-glow scale-125"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))",
                            animationDelay: "0.5s",
                          }}
                        ></div>

                        {/* Floating Particles */}
                        <div
                          className="absolute -top-2 -right-2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-bounce-custom"
                          style={{
                            background:
                              "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                            animationDelay: "0ms",
                          }}
                        ></div>
                        <div
                          className="absolute -bottom-2 -left-2 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-bounce-custom"
                          style={{
                            background:
                              "linear-gradient(135deg, #8b5cf6, #ec4899)",
                            animationDelay: "200ms",
                          }}
                        ></div>
                        <div
                          className="absolute top-1/2 -right-3 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-bounce-custom"
                          style={{
                            background:
                              "linear-gradient(135deg, #3b82f6, #06b6d4)",
                            animationDelay: "400ms",
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Number Display */}
                    <div className="text-center mb-2 lg:mb-3">
                      <div className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gradient transition-all duration-300 group-hover:scale-105">
                        {stat.number.includes("%") ||
                        stat.number.includes("K") ||
                        stat.number.includes("+")
                          ? stat.number
                          : `${counters[
                              index
                            ].toLocaleString()}${stat.number.replace(
                              /[0-9]/g,
                              ""
                            )}`}
                      </div>
                      {/* Animated underline */}
                      <div
                        className="h-0.5 mx-auto mt-2 rounded-full transition-all duration-500 group-hover:w-full"
                        style={{
                          width: "0",
                          background:
                            "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                        }}
                      ></div>
                    </div>

                    {/* Label */}
                    <div className="text-center">
                      <div className="text-sm lg:text-base text-gray-600 font-medium transition-all duration-300 group-hover:text-gray-800 group-hover:scale-105">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Decoration */}
          <div className="flex justify-center mt-8 lg:mt-12 space-x-2">
            {stats.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full opacity-30 animate-pulse-glow"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  animationDelay: `${index * 200}ms`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
