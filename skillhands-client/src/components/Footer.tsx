import { Link, useLocation } from "react-router-dom";
import { Home, Phone, Mail, MapPin } from "lucide-react";
import { useEffect } from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  // Add scroll to top effect when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-primary-foreground p-2 rounded-lg">
                <img src="/icon.png" alt="SkillHand Icon" className="w-6 h-6 object-contain" />
              </div>
              <span className="font-heading font-bold text-xl">
             SkillHands
              </span>
            </div>
            <p className="text-primary-foreground/80 mb-4 max-w-md">
              Connecting homeowners with trusted local professionals. No
              accounts, no hassles – just quality service when you need it.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <a href="tel:+12403608332" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  +1 240-360-8332
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=kasiedu@expedite-consults.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  kasiedu@expedite-consults.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <a
                  href="https://maps.google.com/?q=3 Oak Run Rd, Laurel MD, 20724"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  3 Oak Run Rd, Laurel MD, 20724
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/services"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  All Services
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/refund"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="font-heading font-semibold mb-2">Quick FAQ</h4>
              <p className="text-sm text-primary-foreground/80">
                <strong>Q:</strong> Do I need to create an account?
                <br />
                <strong>A:</strong> No! Just submit your request and we'll call
                you.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/80">
            © {currentYear} SkillHands.us. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
