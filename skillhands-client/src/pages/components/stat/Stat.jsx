import React, { useState, useEffect, useMemo, useCallback } from "react";
import { TrendingUp, Users, Award, Zap } from "lucide-react";

// Optimized data structure - separated config from runtime state
const STATS_CONFIG = [
  {
    id: "users",
    icon: TrendingUp,
    number: "150K+",
    label: "Active Users",
    color: { from: "#3b82f6", to: "#1e40af" },
    delay: 0,
  },
  {
    id: "community",
    icon: Users,
    number: "50K+",
    label: "Community Members",
    color: { from: "#8b5cf6", to: "#7c3aed" },
    delay: 150,
  },
  {
    id: "awards",
    icon: Award,
    number: "200+",
    label: "Awards Won",
    color: { from: "#ec4899", to: "#db2777" },
    delay: 300,
  },
  {
    id: "uptime",
    icon: Zap,
    number: "99.9%",
    label: "Uptime",
    color: { from: "#06b6d4", to: "#0891b2" },
    delay: 450,
  },
];

// Animation configuration
const ANIMATION_CONFIG = {
  fadeInDuration: 800,
  counterDuration: 1500,
  hoverTransition: 300,
  counterSteps: 50,
  counterInterval: 30,
};

export default function ResponsiveStats() {
  // Optimized state structure using Map for O(1) lookups
  const [animationState, setAnimationState] = useState({
    isVisible: false,
    counters: new Map(STATS_CONFIG.map((stat) => [stat.id, 0])),
    hoveredCard: null,
  });

  // Memoized target values extraction
  const targetValues = useMemo(
    () =>
      new Map(
        STATS_CONFIG.map((stat) => [
          stat.id,
          parseInt(stat.number.replace(/[^0-9.]/g, "")) || 0,
        ])
      ),
    []
  );

  // Optimized visibility trigger
  useEffect(() => {
    const timer = setTimeout(
      () => setAnimationState((prev) => ({ ...prev, isVisible: true })),
      100
    );
    return () => clearTimeout(timer);
  }, []);

  // Optimized counter animation with cleanup
  useEffect(() => {
    if (!animationState.isVisible) return;

    const timers = new Set();

    const animateCounters = () => {
      STATS_CONFIG.forEach((stat) => {
        const target = targetValues.get(stat.id);
        if (!target) return;

        let current = 0;
        const increment = target / ANIMATION_CONFIG.counterSteps;

        const timer = setInterval(() => {
          current = Math.min(current + increment, target);

          setAnimationState((prev) => ({
            ...prev,
            counters: new Map(prev.counters.set(stat.id, Math.floor(current))),
          }));

          if (current >= target) {
            clearInterval(timer);
            timers.delete(timer);
          }
        }, ANIMATION_CONFIG.counterInterval);

        timers.add(timer);
      });
    };

    const delay = setTimeout(animateCounters, 500);

    return () => {
      clearTimeout(delay);
      timers.forEach((timer) => clearInterval(timer));
    };
  }, [animationState.isVisible, targetValues]);

  // Memoized hover handlers
  const handleMouseEnter = useCallback((statId) => {
    setAnimationState((prev) => ({ ...prev, hoveredCard: statId }));
  }, []);

  const handleMouseLeave = useCallback(() => {
    setAnimationState((prev) => ({ ...prev, hoveredCard: null }));
  }, []);

  // Memoized format number function
  const formatNumber = useCallback(
    (stat) => {
      const counterValue = animationState.counters.get(stat.id);

      if (
        stat.number.includes("%") ||
        stat.number.includes("K") ||
        stat.number.includes("+")
      ) {
        return stat.number;
      }

      return `${counterValue.toLocaleString()}${stat.number.replace(
        /[0-9]/g,
        ""
      )}`;
    },
    [animationState.counters]
  );

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.03); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20%); }
        }
        
        .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .animate-gentle-float { animation: gentleFloat 4s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulseGlow 3s ease-in-out infinite; }
        .animate-bounce-custom { animation: bounce 1.5s infinite; }
        
        .card-3d { transform-style: preserve-3d; perspective: 1000px; }
        .card-inner { 
          transform-style: preserve-3d; 
          transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1); 
        }
        .card-3d:hover .card-inner { 
          transform: rotateX(5deg) rotateY(5deg) translateZ(10px); 
        }
        
        /* Mobile-specific optimizations */
        @media (max-width: 640px) {
          .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            gap: 1rem;
          }
          .card-3d:hover .card-inner { 
            transform: scale(1.02) translateZ(5px);
          }
        }
        
        /* Tablet optimization */
        @media (min-width: 641px) and (max-width: 1023px) {
          .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
          }
        }
        
        /* Desktop */
        @media (min-width: 1024px) {
          .stats-grid {
            display: flex;
            gap: 2rem;
            width: 100%;
          }
          .stats-grid > div {
            flex: 1;
            min-width: 0;
          }
        }
      `}</style>

      <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden bg-gradient-to-br from-blue-50/60 via-purple-50/60 to-pink-50/60">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-100/20 to-transparent transform -skew-y-1"></div>
          <div className="absolute bottom-0 right-0 w-48 sm:w-96 h-48 sm:h-96 rounded-full blur-3xl bg-gradient-radial from-purple-200/30 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Stats Container - Responsive Grid */}
          <div className="stats-grid max-w-7xl mx-auto">
            {STATS_CONFIG.map((stat) => {
              const isHovered = animationState.hoveredCard === stat.id;

              return (
                <div
                  key={stat.id}
                  className={`group relative card-3d ${
                    animationState.isVisible
                      ? "animate-fade-in-up"
                      : "opacity-0"
                  }`}
                  style={{ animationDelay: `${stat.delay}ms` }}
                  onMouseEnter={() => handleMouseEnter(stat.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Main Card */}
                  <div className="card-inner">
                    <div
                      className="relative p-4 sm:p-6 rounded-xl sm:rounded-2xl backdrop-blur-sm bg-white/90 border-2 border-transparent bg-gradient-to-br from-white/95 to-white/85 shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-1 cursor-pointer"
                      style={{
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), linear-gradient(135deg, ${stat.color.from}40, ${stat.color.to}40)`,
                        ...(isHovered && {
                          boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 40px ${stat.color.from}40`,
                        }),
                      }}
                    >
                      {/* Enhanced Hover Glow */}
                      <div
                        className={`absolute inset-0 rounded-xl sm:rounded-2xl transition-opacity duration-700 ${
                          isHovered ? "opacity-100" : "opacity-0"
                        }`}
                        style={{
                          background: `linear-gradient(135deg, ${stat.color.from}08, ${stat.color.to}08)`,
                        }}
                      ></div>

                      {/* Content */}
                      <div className="relative z-10">
                        {/* Icon Container */}
                        <div className="flex justify-center mb-4 sm:mb-6">
                          <div className="relative animate-gentle-float">
                            {/* Main Icon */}
                            <div
                              className="relative z-20 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300"
                              style={{
                                background: `linear-gradient(135deg, ${stat.color.from}, ${stat.color.to})`,
                                boxShadow: `0 8px 25px ${stat.color.from}30`,
                              }}
                            >
                              <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>

                            {/* Animated Rings */}
                            <div
                              className={`absolute inset-0 rounded-lg sm:rounded-xl transition-opacity duration-500 animate-pulse-glow ${
                                isHovered ? "opacity-100" : "opacity-0"
                              }`}
                              style={{
                                background: `linear-gradient(135deg, ${stat.color.from}40, ${stat.color.to}40)`,
                              }}
                            ></div>

                            {/* Floating Particles */}
                            <div
                              className={`absolute -top-2 -right-2 w-2 h-2 sm:w-3 sm:h-3 rounded-full animate-bounce-custom transition-opacity duration-500 ${
                                isHovered ? "opacity-100" : "opacity-0"
                              }`}
                              style={{
                                background: `linear-gradient(135deg, ${stat.color.from}, ${stat.color.to})`,
                                boxShadow: `0 4px 8px ${stat.color.from}30`,
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* Number Display */}
                        <div className="text-center mb-2 sm:mb-3">
                          <div
                            className="text-2xl sm:text-3xl lg:text-4xl font-bold transition-all duration-300"
                            style={{
                              background: `linear-gradient(135deg, ${stat.color.from}, ${stat.color.to})`,
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              backgroundClip: "text",
                            }}
                          >
                            {formatNumber(stat)}
                          </div>

                          {/* Animated underline */}
                          <div
                            className={`mx-auto mt-2 h-0.5 rounded transition-all duration-700 ${
                              isHovered ? "w-full" : "w-0"
                            }`}
                            style={{
                              background: `linear-gradient(90deg, ${stat.color.from}, ${stat.color.to})`,
                              boxShadow: `0 2px 8px ${stat.color.from}30`,
                            }}
                          ></div>
                        </div>

                        {/* Label */}
                        <div className="text-center">
                          <div className="text-xs sm:text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                            {stat.label}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Decoration */}
          <div className="flex justify-center space-x-2 mt-8 sm:mt-12">
            {STATS_CONFIG.map((stat, index) => (
              <div
                key={stat.id}
                className="w-2 h-2 rounded-full animate-pulse-glow opacity-40"
                style={{
                  background: `linear-gradient(135deg, ${stat.color.from}, ${stat.color.to})`,
                  animationDelay: `${index * 300}ms`,
                  boxShadow: `0 2px 8px ${stat.color.from}30`,
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
