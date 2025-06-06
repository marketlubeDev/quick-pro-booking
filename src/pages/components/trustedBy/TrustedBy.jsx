import { Award, Shield, Star, CheckCircle } from "lucide-react";

const certifications = [
  {
    name: "Better Business Bureau",
    rating: "A+",
    icon: Shield,
    iconBg: "#2563eb",
    badgeBg: "linear-gradient(135deg, #3b82f6, #2563eb)",
  },
  {
    name: "HomeAdvisor Approved",
    rating: "Elite",
    icon: Award,
    iconBg: "#059669",
    badgeBg: "linear-gradient(135deg, #10b981, #059669)",
  },
  {
    name: "Angie's List",
    rating: "Super Service",
    icon: Star,
    iconBg: "#7c3aed",
    badgeBg: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
  },
  {
    name: "Google Reviews",
    rating: "4.9★",
    icon: CheckCircle,
    iconBg: "#ea580c",
    badgeBg: "linear-gradient(135deg, #f97316, #ea580c)",
  },
];

export default function TrustedBy() {
  return (
    <section
      className="py-20 lg:py-32 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #e0e7ff 100%)",
      }}
    >
      {/* Background decorative circles */}
      <div
        className="absolute top-10 left-1/4 w-72 h-72 rounded-full opacity-20"
        style={{
          background: "linear-gradient(45deg, #3b82f6, #8b5cf6)",
          filter: "blur(60px)",
        }}
      ></div>
      <div
        className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full opacity-20"
        style={{
          background: "linear-gradient(45deg, #6366f1, #06b6d4)",
          filter: "blur(60px)",
        }}
      ></div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 lg:mb-20">
          <div
            className="inline-flex items-center px-6 py-3 rounded-full text-blue-700 text-sm font-semibold mb-8 shadow-lg"
            style={{
              background: "linear-gradient(135deg, #dbeafe, #c7d2fe)",
              border: "1px solid rgba(59, 130, 246, 0.2)",
            }}
          >
            <Shield className="w-4 h-4 mr-2" />
            Industry Recognition
          </div>

          <h2
            className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 leading-tight"
            style={{
              background: "linear-gradient(135deg, #1e293b, #1e40af, #4338ca)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Trusted by Thousands
          </h2>

          <p className="text-slate-600 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
            We're proud of our reputation and certifications from leading
            industry organizations, ensuring the highest standards of security,
            quality, and reliability.
          </p>
        </div>

        <div
          className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto"
          style={{ margin: "5rem 0" }}
        >
          {certifications.map((cert, index) => {
            const IconComponent = cert.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden transition-all duration-500 ease-out hover:-translate-y-3 cursor-pointer flex-shrink-0"
                style={{
                  background: "rgba(255, 255, 255, 0.85)",
                  backdropFilter: "blur(20px)",
                  borderRadius: "24px",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  padding: "1.5rem",
                  width: "280px",
                  height: "220px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.95)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 40px rgba(59, 130, 246, 0.15)";
                  e.currentTarget.style.border =
                    "1px solid rgba(59, 130, 246, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.85)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(0, 0, 0, 0.1)";
                  e.currentTarget.style.border =
                    "1px solid rgba(255, 255, 255, 0.3)";
                }}
              >
                {/* Gradient border overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))",
                    borderRadius: "24px",
                    padding: "1px",
                  }}
                >
                  <div
                    className="w-full h-full"
                    style={{
                      background: "rgba(255, 255, 255, 0.9)",
                      borderRadius: "23px",
                    }}
                  ></div>
                </div>

                <div className="relative z-10 text-center flex flex-col justify-between h-full">
                  <div className="flex justify-center mb-4">
                    <div
                      className="p-4 group-hover:scale-110 transition-all duration-300 relative"
                      style={{
                        background: `linear-gradient(145deg, ${cert.iconBg}, ${cert.iconBg}dd)`,
                        borderRadius: "20px",
                        boxShadow: `
                          0 8px 16px rgba(0, 0, 0, 0.15),
                          0 4px 8px rgba(0, 0, 0, 0.1),
                          inset 0 1px 0 rgba(255, 255, 255, 0.2),
                          inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                        `,
                        transform: "perspective(100px) rotateX(5deg)",
                      }}
                    >
                      {/* Inner shadow for depth */}
                      <div
                        className="absolute inset-0 rounded-full opacity-30"
                        style={{
                          background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), transparent 50%)`,
                          borderRadius: "20px",
                        }}
                      ></div>

                      {/* Bottom shadow for 3D effect */}
                      <div
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-3 opacity-20 rounded-full"
                        style={{
                          background: cert.iconBg,
                          filter: "blur(4px)",
                        }}
                      ></div>

                      <IconComponent
                        className="w-7 h-7 text-white relative z-10"
                        style={{
                          filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))",
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex-grow flex flex-col justify-center">
                    <h3 className="font-bold text-slate-800 text-base mb-3 group-hover:text-slate-900 transition-colors px-2 leading-tight">
                      {cert.name}
                    </h3>
                  </div>

                  <div className="flex justify-center">
                    <span
                      className="inline-flex items-center px-4 py-2 text-sm font-bold text-white shadow-lg"
                      style={{
                        background: cert.badgeBg,
                        borderRadius: "12px",
                        boxShadow: `
                          0 4px 8px rgba(0, 0, 0, 0.15),
                          inset 0 1px 0 rgba(255, 255, 255, 0.2)
                        `,
                      }}
                    >
                      <Star className="w-3 h-3 mr-2 fill-current" />
                      {cert.rating}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust indicators */}
        <div className="mt-20 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
            {[
              {
                icon: Shield,
                text: "50,000+ Customers",
                color: "text-blue-500",
              },
              {
                icon: CheckCircle,
                text: "99.9% Uptime",
                color: "text-green-500",
              },
              {
                icon: Award,
                text: "15+ Certifications",
                color: "text-purple-500",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 px-6 py-3 shadow-lg transition-all duration-300 hover:shadow-xl"
                style={{
                  background: "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className="font-semibold text-slate-700">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
