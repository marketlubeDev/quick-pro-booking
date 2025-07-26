import React, { useState, useEffect } from "react";
import ContactFormModal from "../../../components/ContactFormModal";
import { toast } from "sonner";
import { MdKeyboardArrowDown } from "react-icons/md";

const EnhancedHeroSection = () => {
  const [selectedService, setSelectedService] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const services = [
    { value: "plumbing", label: "Plumbing", icon: "🔧" },
    { value: "electrical", label: "Electrical", icon: "⚡" },
    { value: "cleaning", label: "House Cleaning", icon: "🧽" },
    { value: "ac-repair", label: "AC Repair", icon: "❄️" },
    { value: "appliance", label: "Appliance Repair", icon: "🔨" },
    { value: "painting", label: "Painting", icon: "🎨" },
    { value: "handyman", label: "Handyman", icon: "🛠️" },
    { value: "pest-control", label: "Pest Control", icon: "🐜" },
    { value: "lawn-care", label: "Lawn Care", icon: "🌿" },
    { value: "moving", label: "Moving", icon: "📦" },
    { value: "roofing", label: "Roofing", icon: "🏠" },
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
    if (selectedService) {
      setIsModalOpen(true);
    } else {
      toast.error("Please select a service");
    }
  };

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/12403608332", "_blank");
  };

  const handleEmailClick = () => {
    window.open(
      "https://mail.google.com/mail/?view=cm&fs=1&to=kasiedu@expedite-consults.com",
      "_blank"
    );
  };

  const handleModalClose = (resetService = false) => {
    setIsModalOpen(false);
    if (resetService) setSelectedService("");
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
      {/* Contact Form Modal */}
      <ContactFormModal
        isOpen={isModalOpen}
        onClose={() => handleModalClose(true)}
        selectedService={services.find((s) => s.value === selectedService)?.label}
      />

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
        className="hero-main-container"
        style={{
          position: "relative",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: window.innerWidth <= 768 ? "3rem 1rem" : "5rem 1rem",
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
                  className="service-actions responsive-service-container"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {/* Service Selection and Request Button */}
                  <div className="select-container" style={{ position: "relative", width: "58%" }}>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      style={{
                        width: "100%",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        borderRadius: "0.5rem",
                        padding: "0.75rem 2.5rem 0.75rem 1rem", // extra right padding for arrow
                        color: "white",
                        fontSize: "1rem",
                        outline: "none",
                        cursor: "pointer",
                        appearance: "none",
                        transition: "all 0.2s ease",
                        minHeight: "44px",
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
                          style={{
                            backgroundColor: "#374151",
                            color: "white",
                          }}
                        >
                          {service.icon} {service.label}
                        </option>
                      ))}
                    </select>
                    <span
                      className="select-arrow"
                      style={{
                        position: "absolute",
                        right: "1.25rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#9ca3af",
                        pointerEvents: "none",
                        fontSize: "1.25rem",
                        lineHeight: 1,
                      }}
                    >
                      <MdKeyboardArrowDown />
                    </span>
                  </div>

                  {/* Request Service Button */}
                  <button
                    className="request-service-btn"
                    onClick={handleQuickBook}
                    style={{
                      width: "40%",
                      background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
                      color: "white",
                      fontWeight: "600",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "0.5rem",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)",
                      outline: "none",
                      fontSize: "1rem",
                      minHeight: "44px",
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

                {/* Contact Options */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    gap: "1rem",
                    marginTop: "0.5rem",
                    padding: "0.5rem",
                  }}
                >
                  {/* WhatsApp Button */}
                  <button
                    onClick={handleWhatsAppClick}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(37, 211, 102, 0.2)",
                      color: "#25D366",
                      border: "1px solid rgba(37, 211, 102, 0.5)",
                      borderRadius: "0.5rem",
                      padding: "0.75rem",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      width: "45px",
                      height: "45px",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(37, 211, 102, 0.3)";
                      e.target.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(37, 211, 102, 0.2)";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </button>

                  {/* Email Button */}
                  <button
                    onClick={handleEmailClick}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(234, 179, 8, 0.2)",
                      color: "#EAB308",
                      border: "1px solid rgba(234, 179, 8, 0.5)",
                      borderRadius: "0.5rem",
                      padding: "0.75rem",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      width: "45px",
                      height: "45px",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(234, 179, 8, 0.3)";
                      e.target.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(234, 179, 8, 0.2)";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="currentColor"
                    >
                      <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                      <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                    </svg>
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
                className="hero-image-container"
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
                    height: window.innerWidth <= 768 ? "20rem" : "24rem",
                    // objectFit: "contain",
                    objectPosition: "center",
                    transition: "transform 0.7s ease",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
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
      <style>
        {`
          /* iPad Pro specific styling (1024x1366) */
          @media screen and (min-width: 1024px) and (max-width: 1366px) and (orientation: portrait),
                 screen and (min-width: 1024px) and (max-width: 1366px) and (orientation: landscape) {
            .hero-image-container {
              padding: 0.5rem !important;
            }
            .hero-image-container img {
              height: 28rem !important;
              // object-fit: contain !important;
              object-position: center !important;
              border-radius: 0.75rem !important;
            }
          }
          
          /* iPad specific styling (768x1024) */
          @media screen and (min-width: 768px) and (max-width: 1023px) {
            .hero-image-container {
              padding: 0.5rem !important;
            }
            .hero-image-container img {
              height: 24rem !important;
              // object-fit: contain !important;
              object-position: center !important;
              border-radius: 0.75rem !important;
            }
          }
          
          @media (max-width: 767px) {
            .hero-image-container img {
              height: 18rem !important;
              // object-fit: contain !important;
              object-position: center !important;
            }
            .hero-main-container {
              padding: 2rem 1rem !important;
            }
          }
          
          @media (max-width: 600px) {
            .service-actions {
              display: flex !important;
              flex-direction: column !important;
              gap: 0.75rem !important;
            }
            .service-actions select,
            .service-actions button {
              width: 100% !important;
              font-size: 0.95rem !important;
              min-height: 44px !important;
            }
            .service-actions select {
              padding-right: 2.5rem !important;
            }
            .service-actions .select-arrow {
              right: 1rem !important;
              font-size: 1.1rem !important;
            }
            .hero-image-container img {
              height: 16rem !important;
            }
          }
          
          @media (max-width: 480px) {
            .hero-image-container img {
              height: 14rem !important;
            }
          }
          
          /* Mobile responsive styles for service actions */
          @media (max-width: 768px) {
            .responsive-service-container {
              flex-direction: column !important;
              gap: 1rem !important;
              align-items: stretch !important;
            }
            
            .select-container {
              width: 100% !important;
            }
            
            .request-service-btn {
              width: 100% !important;
            }
          }
        `}
      </style>
    </section>
  );
};

export default EnhancedHeroSection;
