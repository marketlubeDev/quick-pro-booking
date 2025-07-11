import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Home, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import PrimaryButton from "./PrimaryButton";
import ContactFormModal from "./ContactFormModal";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  // Add scroll to top effect when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Services", href: "/services" },
    { name: "Projects", href: "/projects" },
    { name: "About", href: "/about" },
    { name: "FAQ", href: "/faq" },
    // { name: "Contact", href: "/contact", icon: Phone },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location.pathname === "/") return true;
    if (href !== "/" && location.pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <header
      className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-40 transition-all duration-300"
      style={{
        boxShadow:
          "0 0 20px 8px rgba(0, 0, 0, 0.08), 0 0 40px 15px rgba(0, 0, 0, 0.05)",
        borderImage:
          "linear-gradient(90deg, transparent, rgba(var(--primary), 0.2), transparent) 1",
      }}
    >
      {/* Contact Form Modal */}
      <ContactFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedService=""
        zipCode=""
      />

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Enhanced Logo */}
          <Link to="/" className="flex items-center space-x-3 group relative">
            <div className="relative bg-gradient-to-br from-primary to-primary/80 p-2.5 rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg group-hover:shadow-xl group-hover:shadow-primary/30">
              <Home className="w-6 h-6 text-primary-foreground transition-all duration-300 group-hover:scale-110" />
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-primary/80 opacity-0 group-hover:opacity-30 blur-md transition-all duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-xl text-primary transition-all duration-300 group-hover:text-primary/90 relative">
                SkillHands.us
                {/* Animated underline on logo */}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-primary/60 transition-all duration-500 group-hover:w-full" />
              </span>
              <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                Professional Services
              </span>
            </div>
            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-full bg-primary/10 scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-700 -z-10" />
          </Link>

          {/* Enhanced Desktop Navigation - Fixed hover bleeding */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item, index) => (
              <div key={item.name} className="relative">
                <Link
                  to={item.href}
                  className={`relative block px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group overflow-hidden ${
                    isActive(item.href)
                      ? "text-primary font-semibold bg-primary/10 shadow-md"
                      : "text-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    {item.icon && (
                      <item.icon className="w-4 h-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                    )}
                    <span>{item.name}</span>
                  </span>

                  {/* Bottom border - contained within link */}
                  <span
                    className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-300 ${
                      isActive(item.href) ? "w-3/4" : "w-0 group-hover:w-3/4"
                    }`}
                  />

                  {/* Background glow - properly contained and no blur */}
                  <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/8 to-primary/0 rounded-lg scale-95 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100" />

                  {/* Shine effect - contained with proper overflow */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-lg translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />

                  {/* Active indicator */}
                  {isActive(item.href) && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
                  )}
                </Link>
              </div>
            ))}
          </nav>

          {/* Enhanced CTA Button */}
          <div className="hidden md:block">
            <div className="relative group">
              <PrimaryButton
                onClick={() => setIsModalOpen(true)}
                className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/30 border-0 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-semibold"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span>Book a Pro</span>
                  <div className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-black/60 animate-pulse" />
                  </div>
                </span>
                {/* Animated background */}
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                {/* Glow effect - reduced blur and contained */}
                <span className="absolute inset-0 bg-yellow-400/30 rounded-lg blur-sm scale-0 group-hover:scale-105 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              </PrimaryButton>
            </div>
          </div>

          {/* Enhanced Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="relative transition-all duration-300 hover:scale-110 hover:bg-primary/10 group overflow-hidden"
              >
                <Menu
                  className={`w-5 h-5 transition-all duration-300 ${
                    isOpen ? "rotate-90 scale-110" : "group-hover:rotate-90"
                  }`}
                />
                {/* Ripple effect for mobile menu - contained */}
                <span className="absolute inset-0 rounded-full bg-primary/20 scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-80 bg-gradient-to-br from-background to-background/95 backdrop-blur-xl border-l-2 border-primary/20"
            >
              <div className="flex flex-col space-y-2 mt-8">
                {/* Mobile menu header */}
                <div className="mb-6 pb-4 border-b border-primary/20">
                  <h3 className="text-lg font-semibold text-primary mb-1">
                    Navigation
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Explore our services
                  </p>
                </div>

                {navigation.map((item, index) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 text-lg font-medium transition-all duration-300 p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:translate-x-2 hover:shadow-lg group relative overflow-hidden ${
                      isActive(item.href)
                        ? "text-primary font-semibold bg-gradient-to-r from-primary/15 to-primary/5 shadow-md"
                        : "hover:text-primary"
                    }`}
                    onClick={() => setIsOpen(false)}
                    style={{
                      animation: `slideInRight 0.4s ease-out ${
                        index * 100
                      }ms both`,
                    }}
                  >
                    {item.icon && (
                      <div className="relative">
                        <item.icon className="w-5 h-5 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                        {isActive(item.href) && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
                        )}
                      </div>
                    )}
                    <span className="relative flex-1">
                      {item.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/60 transition-all duration-300 group-hover:w-full" />
                    </span>

                    {/* Shine effect - contained */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />

                    {/* Arrow indicator */}
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <div className="w-2 h-2 border-r-2 border-b-2 border-primary transform rotate-[-45deg]" />
                    </div>
                  </Link>
                ))}

                <div className="pt-6 mt-4 border-t border-primary/20">
                  <PrimaryButton
                    className="w-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/30 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-semibold relative overflow-hidden group"
                    onClick={() => {
                      setIsOpen(false);
                      setIsModalOpen(true);
                    }}
                  >
                    <span className="relative z-10">Book a Pro</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                  </PrimaryButton>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Add keyframes for mobile menu animation */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
