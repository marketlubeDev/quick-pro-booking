import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
  className?: string;
}

const ServiceCard = ({
  icon: Icon,
  title,
  description,
  onClick,
  className = "",
}: ServiceCardProps) => {
  // Array of vibrant gradient combinations
  const gradients = [
    "bg-gradient-to-br from-purple-500 via-pink-500 to-red-500",
    "bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500",
    "bg-gradient-to-br from-orange-500 via-yellow-500 to-lime-500",
    "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500",
    "bg-gradient-to-br from-emerald-500 via-green-500 to-lime-500",
    "bg-gradient-to-br from-rose-500 via-pink-500 to-purple-500",
    "bg-gradient-to-br from-amber-500 via-orange-500 to-red-500",
    "bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500",
    "bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500",
    "bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500",
  ];

  // Generate consistent gradient based on title hash
  const getGradient = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return gradients[Math.abs(hash) % gradients.length];
  };

  const selectedGradient = getGradient(title);

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="h-full" // Ensure motion.div takes full height
    >
      <Card
        className={`group cursor-pointer hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 border-0 overflow-hidden h-full ${className}`}
        onClick={onClick}
      >
        <CardContent className="p-6 text-center relative h-full flex flex-col justify-between min-h-[200px]">
          {/* Icon section */}
          <div className="flex-shrink-0">
            {/* Colorful icon container with multiple effects */}
            <div className="relative w-16 h-16 mx-auto mb-4">
              {/* Main gradient background */}
              <div
                className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${selectedGradient} shadow-lg`}
              >
                <Icon className="w-8 h-8 text-white transition-all duration-300 group-hover:scale-110 drop-shadow-sm" />
              </div>

              {/* Glowing ring effect */}
              <div
                className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 ${selectedGradient} blur-md scale-125`}
              />

              {/* Pulsing dot */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md">
                <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse" />
              </div>

              {/* Floating sparkles */}
              <div className="absolute -top-2 left-2 w-1 h-1 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-bounce delay-100" />
              <div className="absolute -bottom-1 -right-2 w-1.5 h-1.5 bg-pink-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-bounce delay-300" />
              <div className="absolute top-1/2 -left-2 w-1 h-1 bg-blue-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-bounce delay-500" />
            </div>
          </div>

          {/* Content section - grows to fill available space */}
          <div className="flex-grow flex flex-col justify-center">
            {/* Title with gradient text on hover */}
            <h3 className="font-heading font-semibold mb-2 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent">
              {title}
            </h3>

            <p className="text-muted-foreground text-sm transition-colors duration-300 group-hover:text-foreground/80">
              {description}
            </p>
          </div>

          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/10 to-transparent" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ServiceCard;
