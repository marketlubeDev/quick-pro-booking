import React, { useState } from "react";
import { seasonalServices } from "@/data/getData";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Sparkles } from "lucide-react";
import PrimaryButton from "@/components/PrimaryButton";
import { motion } from "framer-motion";
import ContactFormModal from "@/components/ContactFormModal";

export default function SeasonalService() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Explicit gradient definitions to ensure Tailwind includes them
  const getSeasonalGradient = (season) => {
    switch (season) {
      case "Winter":
        return "bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700";
      case "Spring":
        return "bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700";
      case "Summer":
        return "bg-gradient-to-br from-yellow-500 via-orange-600 to-red-700";
      case "Fall":
      case "Autumn":
        return "bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-700";
      default:
        console.log("Using default gradient for season:", season);
        return "bg-gradient-to-br from-red-500 via-pink-600 to-purple-700"; // Bright colors for debugging
    }
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  // Card animation variants
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
      }}
      viewport={{ once: true, amount: 0.2 }}
      className="py-20 lg:py-32 bg-gradient-to-br from-muted/30 via-background to-muted/20 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-pattern opacity-50" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Year-Round Excellence
          </div>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Seasonal Home Services
          </h2>
          <p className="text-muted-foreground text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
            Prepare your home for every season with our specialized services.
            From winter prep to summer maintenance, we've got you covered
            year-round.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
          style={{ margin: "5rem 0" }}
        >
          {seasonalServices.map((season, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{
                y: -10,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              className="group"
            >
              <Card className="overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 h-full bg-card/80 backdrop-blur-sm">
                {/* Header with gradient */}
                <div
                  className={`${season.color} p-8 text-white relative overflow-hidden`}
                >
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />

                  <div className="flex items-center space-x-4 mb-4 relative z-10">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <season.icon className="w-8 h-8 drop-shadow-sm" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-2xl lg:text-3xl drop-shadow-sm">
                        {season.season}
                      </h3>
                      <div className="w-12 h-1 bg-white/50 rounded-full mt-2 group-hover:w-20 transition-all duration-300" />
                    </div>
                  </div>

                  {/* Floating elements */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-white/40 rounded-full animate-pulse" />
                  <div className="absolute bottom-6 right-8 w-1 h-1 bg-white/60 rounded-full animate-bounce delay-300" />
                </div>

                {/* Content */}
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="flex-grow">
                    <ul className="space-y-4 mb-8">
                      {season.services.map((service, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1, duration: 0.4 }}
                          viewport={{ once: true }}
                          className="flex items-center space-x-3 group/item"
                        >
                          <div className="p-1 rounded-full bg-primary/10 group-hover/item:bg-primary/20 transition-colors duration-200">
                            <CheckCircle className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-foreground/80 group-hover/item:text-foreground transition-colors duration-200">
                            {service}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <PrimaryButton
                    className="w-full mt-auto group-hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl"
                    variant="primary"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Book {season.season} Service
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        →
                      </motion.div>
                    </span>
                  </PrimaryButton>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-6">
            Need a custom seasonal package?
          </p>
          <PrimaryButton
            variant="outline"
            className="px-8 py-3"
            onClick={() => setIsModalOpen(true)}
          >
            Contact Our Specialists
          </PrimaryButton>
        </motion.div>
      </div>

      <ContactFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </motion.section>
  );
}
