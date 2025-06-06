import React from "react";
import ServiceSlider from "@/components/ServiceSlider";
import { allServices } from "@/data/getData";
import PrimaryButton from "@/components/PrimaryButton";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function OurService() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 1.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      viewport={{ once: false, amount: 0.2 }}
      className="py-16 lg:py-24"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading mb-4">Our Services</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Professional home services with transparent pricing and guaranteed
            quality.
          </p>
        </div>

        <ServiceSlider services={allServices} />

        <div className="text-center mt-12">
          <Link to="/services">
            <PrimaryButton variant="primary">
              Explore All Services
            </PrimaryButton>
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
