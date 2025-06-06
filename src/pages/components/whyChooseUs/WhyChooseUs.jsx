import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { whyChooseUs } from "@/data/getData";
import { Sparkles, Star } from "lucide-react";

export default function WhyChooseUs() {
  // Icon color gradients for each card
  const getIconGradient = (index) => {
    const gradients = [
      "bg-gradient-to-br from-sky-500 to-blue-600",
      "bg-gradient-to-br from-lime-400 to-green-600",
      "bg-gradient-to-br from-pink-500 to-fuchsia-600",
      "bg-gradient-to-br from-orange-400 to-amber-500",
      "bg-gradient-to-br from-violet-500 to-purple-700",
      "bg-gradient-to-br from-teal-400 to-cyan-600",
    ];
    return gradients[index % gradients.length];
  };

  // Get accent colors for hover effects
  const getAccentColor = (index) => {
    const colors = [
      "group-hover:shadow-sky-500/25",
      "group-hover:shadow-lime-500/25",
      "group-hover:shadow-pink-500/25",
      "group-hover:shadow-orange-400/25",
      "group-hover:shadow-violet-500/25",
      "group-hover:shadow-teal-400/25",
    ];
    return colors[index % colors.length];
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  // Card animation variants
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  // Icon animation variants
  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.1,
      rotate: [0, -10, 10, 0],
      transition: {
        rotate: {
          duration: 0.6,
          ease: "easeInOut",
        },
        scale: {
          duration: 0.3,
          ease: "easeOut",
        },
      },
    },
    tap: { scale: 0.95 },
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
      className="py-20 lg:py-32 bg-gradient-to-br from-muted/20 via-background to-muted/30 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-pattern opacity-40" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-orange-500/5 to-pink-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            Excellence & Trust
          </div>

          <h2 className="font-heading text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            Why Choose SkillHands.us?
          </h2>

          <p className="text-muted-foreground text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
            We're committed to providing the best home service experience with
            trusted professionals and unmatched quality.
          </p>

          {/* Decorative line */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "120px" }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
            className="h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 mx-auto mt-8 rounded-full"
          />
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 m-10"
          style={{ margin: "2rem 0" }}
        >
          {whyChooseUs.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{
                y: -12,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              className="group h-full"
            >
              <Card
                className={`
                text-center p-8 h-full border-0 shadow-xl hover:shadow-2xl
                transition-all duration-500 bg-card/80 backdrop-blur-sm
                ${getAccentColor(index)} group-hover:border-primary/20
                relative overflow-hidden
              `}
              >
                {/* Card background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Floating particles */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-primary/20 rounded-full animate-ping" />
                <div className="absolute bottom-6 left-6 w-1 h-1 bg-primary/30 rounded-full animate-bounce delay-300" />

                <CardContent className="p-0 relative z-10">
                  {/* Icon Container */}
                  <motion.div
                    variants={iconVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    className="flex justify-center mb-6"
                  >
                    <div
                      style={{
                        borderRadius: "2rem",
                      }}
                      className={`
                      ${getIconGradient(index)} p-4 rounded-2xl shadow-lg
                      relative overflow-hidden group-hover:shadow-xl
                      transition-all duration-300
                    `}
                    >
                      {/* Icon glow effect */}
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                      {/* Animated sparkle */}
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute -top-1 -right-1"
                      >
                        <Sparkles className="w-3 h-3 text-white/80" />
                      </motion.div>

                      <item.icon className="w-8 h-8 text-white drop-shadow-sm relative z-10 rounded-lg" />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="font-heading font-bold text-xl lg:text-2xl mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                      {item.description}
                    </p>
                  </motion.div>

                  {/* Bottom accent line */}
                  <motion.div
                    initial={{ width: "0%" }}
                    whileInView={{ width: "100%" }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                    viewport={{ once: true }}
                    className={`h-1 ${getIconGradient(
                      index
                    )} mx-auto mt-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-center mt-16"
        >
          <div className="flex items-center gap-2 text-primary/60">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              >
                <Star className="w-4 h-4 fill-current" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
