import {
  Droplets,
  Zap,
  Home,
  Wind,
  Wrench,
  Shield,
  Clock,
  CheckCircle,
  Phone,
  Snowflake,
  Leaf,
  Sun,
  Users,
  Award,
  ThumbsUp,
  Headphones,
} from "lucide-react";

export const topServices = [
  {
    icon: Droplets,
    title: "Plumbing",
    description: "Leaks, clogs, installations & repairs",
  },
  {
    icon: Zap,
    title: "Electrical",
    description: "Wiring, outlets, lighting & safety",
  },
  {
    icon: Home,
    title: "House Cleaning",
    description: "Deep cleaning & regular maintenance",
  },
  {
    icon: Wind,
    title: "AC Repair",
    description: "HVAC service & air conditioning",
  },
  {
    icon: Wrench,
    title: "Appliance Repair",
    description: "Fix washers, dryers & more",
  },
];

export const featuredProjects = [
  {
    id: 1,
    title: "Modern Kitchen Renovation",
    image: "/Kitchen.png",
    description:
      "Complete kitchen makeover with modern fixtures and appliances",
    category: "Kitchen Renovation",
    duration: "2 weeks",
    location: "Austin, TX",
  },
  {
    id: 2,
    title: "Bathroom Plumbing Overhaul",
    image: "/BathProj.jpg",
    description: "Full bathroom plumbing replacement and fixture installation",
    category: "Plumbing",
    duration: "1 week",
    location: "Seattle, WA",
  },
  {
    id: 3,
    title: "Electrical System Upgrade",
    image: "/upgrade.jpg",
    description: "Complete home electrical system modernization",
    category: "Electrical",
    duration: "3 days",
    location: "Miami, FL",
  },
];

export const allServices = [
  {
    id: 1,
    title: "Professional Plumbing",
    image: "/Bath.png",
    description: "Expert plumbing solutions for your home",
    price: "From $89",
    rating: 4.9,
  },
  {
    id: 2,
    title: "Electrical Services",
    image: "/Electrical.jpg",
    description: "Safe and reliable electrical work",
    price: "From $120",
    rating: 4.8,
  },
  {
    id: 3,
    title: "House Cleaning",
    image: "/cleaning.jpg",
    description: "Professional deep cleaning services",
    price: "From $75",
    rating: 4.9,
  },
];
export const steps = [
  {
    title: "Select Service",
    description: "Choose from our wide range of home services",
  },
  {
    title: "Submit Request",
    description: "Fill out a quick form with your details",
  },
  {
    title: "We Call You",
    description: "Our team contacts you within minutes",
  },
  {
    title: "Pro Visits",
    description: "Licensed professional arrives at your door",
  },
];
export const testimonials = [
  {
    name: "Sarah Johnson",
    location: "Austin, TX",
    rating: 5,
    text: "Amazing service! The plumber fixed our leak in under an hour. No fuss, no accounts to create.",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
  },
  {
    name: "Mike Chen",
    location: "Seattle, WA",
    rating: 5,
    text: "Super convenient booking process. The electrician was professional and got the job done right.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Lisa Rodriguez",
    location: "Miami, FL",
    rating: 5,
    text: "Best home service experience ever. Fast, reliable, and the first-time discount was a nice bonus!",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
];
export const whyChooseUs = [
  {
    icon: Shield,
    title: "Licensed & Insured",
    description:
      "All our professionals are fully licensed and insured for your peace of mind",
  },
  {
    icon: Clock,
    title: "Same-Day Service",
    description:
      "Quick response times with most services available the same day",
  },
  {
    icon: CheckCircle,
    title: "Quality Guaranteed",
    description:
      "100% satisfaction guarantee on all our work with warranty coverage",
  },
  {
    icon: Phone,
    title: "24/7 Support",
    description:
      "Round-the-clock customer support for any questions or emergencies",
  },
];
export const emergencyServices = [
  {
    icon: Droplets,
    title: "Emergency Plumbing",
    description: "24/7 burst pipes, major leaks",
    response: "30 min response",
  },
  {
    icon: Zap,
    title: "Electrical Emergency",
    description: "Power outages, electrical fires",
    response: "45 min response",
  },
  {
    icon: Wind,
    title: "HVAC Emergency",
    description: "AC/heating system failures",
    response: "1 hour response",
  },
];
export const serviceAreas = [
  "Baltimore Inner Harbor",
  "Annapolis",
  "National Aquarium",
  "Maryland Science Center",
  "MGM National Harbor",
  "Assateague Island National Seashore",
  "Deep Creek Lake",
  "Catoctin Mountain Park",
  "Chesapeake Bay",
  "Patapsco Valley State Park",
  "Fort McHenry",
  "Antietam National Battlefield",
  "Harriet Tubman Underground Railroad Park",
  "Historic St. Mary's City",
  "Sotterley Plantation",
  "University of Maryland, College Park",
  "The Walters Art Museum",
  "B&O Railroad Museum",
  "Six Flags America",
  "Ocean City Boardwalk",
];
export const certifications = [
  { name: "Better Business Bureau", rating: "A+" },
  { name: "HomeAdvisor Approved", rating: "Elite" },
  { name: "Angie's List", rating: "Super Service" },
  { name: "Google Reviews", rating: "4.9★" },
];
export const seasonalServices = [
  {
    season: "Winter",
    icon: Snowflake,
    services: [
      "Heating Repair",
      "Pipe Insulation",
      "Gutter De-icing",
      "Snow Removal",
    ],
    color: "bg-gradient-to-br from-blue-500 to-indigo-600",
  },
  {
    season: "Spring",
    icon: Leaf,
    services: [
      "Deep Cleaning",
      "AC Tune-up",
      "Lawn Care Setup",
      "Gutter Cleaning",
    ],
    color: "bg-gradient-to-br from-emerald-500 to-teal-600",
  },
  {
    season: "Summer",
    icon: Sun,
    services: [
      "AC Repair",
      "Pool Maintenance",
      "Deck Staining",
      "Irrigation Setup",
    ],
    color: "bg-gradient-to-br from-yellow-400 to-orange-500",
  },
];

export const stats = [
  { icon: Users, number: "50,000+", label: "Happy Customers" },
  { icon: Award, number: "15,000+", label: "Projects Completed" },
  { icon: ThumbsUp, number: "4.9/5", label: "Average Rating" },
  { icon: Headphones, number: "24/7", label: "Customer Support" },
];
