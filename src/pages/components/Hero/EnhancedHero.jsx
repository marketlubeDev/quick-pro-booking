import React, { useState, useEffect } from "react";

const EnhancedHeroSection = () => {
  const [selectedService, setSelectedService] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const services = [
    { value: "plumbing", label: "Plumbing", icon: "🔧" },
    { value: "electrical", label: "Electrical", icon: "⚡" },
    { value: "cleaning", label: "House Cleaning", icon: "🧽" },
    { value: "ac-repair", label: "AC Repair", icon: "❄️" },
    { value: "appliance", label: "Appliance Repair", icon: "🔨" },
  ];

  const features = [
    { icon: "🛡️", text: "Licensed & Insured", color: "#10b981" },
    { icon: "✅", text: "Background Checked", color: "#3b82f6" },
    { icon: "⏰", text: "Same-Day Service", color: "#8b5cf6" },
    { icon: "⭐", text: "4.9★ Average Rating", color: "#eab308" },
  ];

  const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "1000+", label: "Verified Pros" },
    { number: "24/7", label: "Support Available" },
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickBook = () => {
    if (selectedService && zipCode) {
      alert(
        `Booking ${
          services.find((s) => s.value === selectedService)?.label
        } service for ${zipCode}`
      );
    } else {
      alert("Please select a service and enter your ZIP code");
    }
  };

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #1e3a8a 0%, #00114b 50%, #581c87 100%)",
        color: "white",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Elements */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.2 }}>
        <div
          className="animate-pulse"
          style={{
            position: "absolute",
            top: "5rem",
            left: "2.5rem",
            width: "18rem",
            height: "18rem",
            backgroundColor: "#3b82f6",
            borderRadius: "50%",
            mixBlendMode: "multiply",
            filter: "blur(4rem)",
          }}
        ></div>
        <div
          className="animate-pulse"
          style={{
            position: "absolute",
            top: "10rem",
            right: "2.5rem",
            width: "18rem",
            height: "18rem",
            backgroundColor: "#6366f1",
            borderRadius: "50%",
            mixBlendMode: "multiply",
            filter: "blur(4rem)",
            animationDelay: "2s",
          }}
        ></div>
        <div
          className="animate-pulse"
          style={{
            position: "absolute",
            bottom: "-8rem",
            left: "5rem",
            width: "18rem",
            height: "18rem",
            backgroundColor: "#8b5cf6",
            borderRadius: "50%",
            mixBlendMode: "multiply",
            filter: "blur(4rem)",
            animationDelay: "4s",
          }}
        ></div>
      </div>

      {/* Floating Particles */}
      <div style={{ position: "absolute", inset: 0 }}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="animate-bounce"
            style={{
              position: "absolute",
              width: "0.5rem",
              height: "0.5rem",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      <div
        style={{
          position: "relative",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "5rem 1rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: window.innerWidth > 1024 ? "1fr 1fr" : "1fr",
            gap: "3rem",
            alignItems: "center",
          }}
        >
          {/* Left Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              transform: isVisible ? "translateX(0)" : "translateX(-2.5rem)",
              opacity: isVisible ? 1 : 0,
              transition: "all 1s ease-out",
            }}
          >
            {/* Main Heading */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(0.5rem)",
                  borderRadius: "9999px",
                  padding: "0.5rem 1rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  width: "fit-content",
                }}
              >
                <span style={{ color: "#fbbf24" }}>⚡</span>
                <span>Instant Service Booking</span>
              </div>

              <h1
                style={{
                  fontSize: "3rem",
                  fontWeight: "bold",
                  lineHeight: "1.2",
                  margin: 0,
                }}
              >
                Need a
                <span
                  style={{
                    display: "block",
                    background:
                      "linear-gradient(90deg, #60a5fa 0%, #a78bfa 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Trusted Local Pro?
                </span>
              </h1>

              <p
                style={{
                  fontSize: "1.5rem",
                  color: "#d1d5db",
                  fontWeight: "300",
                  margin: 0,
                }}
              >
                Book Quality Home Services — No Hassle, No Logins.
              </p>
            </div>

            {/* Quick Booking Card */}
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(1rem)",
                borderRadius: "1rem",
                padding: "1.5rem",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "600",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span style={{ marginRight: "0.5rem", color: "#60a5fa" }}>
                    📍
                  </span>
                  Get Started in 30 Seconds
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {/* Service Selector */}
                  <div style={{ position: "relative" }}>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      style={{
                        width: "100%",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        borderRadius: "0.5rem",
                        padding: "0.75rem 1rem",
                        color: "white",
                        fontSize: "1rem",
                        outline: "none",
                        cursor: "pointer",
                        appearance: "none",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <option
                        value=""
                        style={{ backgroundColor: "#374151", color: "white" }}
                      >
                        Select Service
                      </option>
                      {services.map((service) => (
                        <option
                          key={service.value}
                          value={service.value}
                          style={{ backgroundColor: "#374151", color: "white" }}
                        >
                          {service.icon} {service.label}
                        </option>
                      ))}
                    </select>
                    <span
                      style={{
                        position: "absolute",
                        right: "0.75rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#9ca3af",
                        pointerEvents: "none",
                      }}
                    >
                      →
                    </span>
                  </div>

                  {/* ZIP Code Input */}
                  <input
                    type="text"
                    placeholder="Enter ZIP Code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    style={{
                      width: "100%",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      borderRadius: "0.5rem",
                      padding: "0.75rem 1rem",
                      color: "white",
                      fontSize: "1rem",
                      outline: "none",
                      transition: "all 0.2s ease",
                    }}
                  />

                  {/* CTA Button */}
                  <button
                    onClick={handleQuickBook}
                    style={{
                      width: "100%",
                      background:
                        "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
                      color: "white",
                      fontWeight: "600",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "0.5rem",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)",
                      outline: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background =
                        "linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)";
                      e.target.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background =
                        "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)";
                      e.target.style.transform = "scale(1)";
                    }}
                  >
                    Request Service →
                  </button>
                </div>
              </div>
            </div>

            {/* Trust Features */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "1rem",
              }}
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    backgroundColor:
                      activeFeature === index
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(0.5rem)",
                    border:
                      activeFeature === index
                        ? "2px solid rgba(96, 165, 250, 0.5)"
                        : "1px solid rgba(255, 255, 255, 0.1)",
                    transition: "all 0.5s ease",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.5rem",
                      marginBottom: "0.5rem",
                      color: feature.color,
                    }}
                  >
                    {feature.icon}
                  </span>
                  <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "1.5rem",
                borderTop: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              {stats.map((stat, index) => (
                <div key={index} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      color: "#60a5fa",
                      margin: 0,
                    }}
                  >
                    {stat.number}
                  </div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "#d1d5db",
                      margin: 0,
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Image */}
          <div
            style={{
              position: "relative",
              transform: isVisible ? "translateX(0)" : "translateX(2.5rem)",
              opacity: isVisible ? 1 : 0,
              transition: "all 1s ease-out 0.3s",
            }}
          >
            <div style={{ position: "relative" }}>
              {/* Glowing Border Effect */}
              <div
                style={{
                  position: "absolute",
                  inset: "-4px",
                  background:
                    "linear-gradient(90deg, #00245c 0%, #8b5cf6 100%)",
                  borderRadius: "1rem",
                  filter: "blur(8px)",
                  opacity: 0.75,
                }}
              ></div>

              {/* Main Image Container */}
              <div
                style={{
                  position: "relative",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(0.5rem)",
                  borderRadius: "1rem",
                  overflow: "hidden",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <img
                  src="/home.png"
                  alt="Happy homeowner with service professional"
                  style={{
                    width: "100%",
                    height: "24rem",
                    objectFit: "cover",
                    transition: "transform 0.7s ease",
                  }}
                />

                {/* Overlay with Customer Review */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "1rem",
                    left: "1rem",
                    right: "1rem",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(0.5rem)",
                    borderRadius: "0.5rem",
                    padding: "1rem",
                    transform: "translateY(100%)",
                    opacity: 0,
                    transition: "all 0.3s ease",
                  }}
                  className="review-overlay"
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span style={{ color: "#eab308" }}>⭐⭐⭐⭐⭐</span>
                  </div>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#1f2937",
                      fontWeight: "500",
                      margin: 0,
                    }}
                  >
                    "Amazing service! Fixed my plumbing issue in under an hour."
                  </p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#6b7280",
                      marginTop: "0.25rem",
                      margin: 0,
                    }}
                  >
                    - Sarah M., Verified Customer
                  </p>
                </div>
              </div>

              {/* Floating Achievement Badges */}
              <div
                className="animate-bounce"
                style={{
                  position: "absolute",
                  top: "-1rem",
                  right: "-1rem",
                  background:
                    "linear-gradient(90deg, #10b981 0%, #3b82f6 100%)",
                  color: "white",
                  padding: "0.75rem",
                  borderRadius: "50%",
                  boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>🏆</span>
              </div>

              <div
                className="animate-pulse"
                style={{
                  position: "absolute",
                  bottom: "-1rem",
                  left: "-1rem",
                  background:
                    "linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)",
                  color: "white",
                  padding: "0.75rem",
                  borderRadius: "50%",
                  boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>👥</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHeroSection;
