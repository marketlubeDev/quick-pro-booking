import cors from "cors";

// Configurable CORS with sensible defaults
export const applyCors = (app) => {
  const rawOrigins = process.env.CORS_ORIGINS;
  const allowedOrigins = rawOrigins
    ? rawOrigins
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean)
    : [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8080",
        "http://localhost:8081",
        "https://www.skillhands.us",
        "https://skillhands.us",
        "http://www.skillhands.us",
        "http://skillhands.us",
        "https://quick-pro-booking-we8z.vercel.app",
      ];

  // Include Vercel deployment URL if available
  if (process.env.VERCEL_URL) {
    const vercelOrigin = `https://${process.env.VERCEL_URL}`;
    if (!allowedOrigins.includes(vercelOrigin)) {
      allowedOrigins.push(vercelOrigin);
    }
  }

  // Add any additional Vercel preview URLs
  if (process.env.VERCEL_BRANCH_URL) {
    const branchOrigin = `https://${process.env.VERCEL_BRANCH_URL}`;
    if (!allowedOrigins.includes(branchOrigin)) {
      allowedOrigins.push(branchOrigin);
    }
  }

  const isWildcard = allowedOrigins.includes("*");

  const corsOptions = {
    origin: (origin, callback) => {
      // Debug logging
      console.log("CORS Debug - Origin:", origin);
      console.log("CORS Debug - Allowed Origins:", allowedOrigins);

      // Allow non-browser requests or same-origin with no Origin header
      if (!origin) return callback(null, true);
      if (isWildcard) return callback(null, true);

      // Check exact match first
      let isAllowed = allowedOrigins.some((o) => o === origin);

      // If not allowed, check for Vercel URL patterns
      if (!isAllowed && origin) {
        const isVercelUrl =
          origin.includes(".vercel.app") || origin.includes(".vercel.com");
        if (isVercelUrl) {
          console.log("CORS Debug - Vercel URL detected, allowing:", origin);
          isAllowed = true;
        }
      }

      console.log("CORS Debug - Is Allowed:", isAllowed);

      // Do not throw on disallowed origins; disable CORS instead of 500 error
      return callback(null, isAllowed);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    exposedHeaders: ["Content-Length"],
    optionsSuccessStatus: 204,
  };

  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions));
};
