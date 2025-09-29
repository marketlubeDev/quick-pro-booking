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
        "http://localhost:8080",
        "http://localhost:8081",
        "http://localhost:3000",
        "https://www.skillhands.us",
        "https://skillhands.us",
        // Add the specific Vercel deployment URL from the image
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

  // Remove wildcard from origins array if credentials is true (CORS security requirement)
  if (isWildcard && process.env.NODE_ENV === "production") {
    if (process.env.CORS_DEBUG === "true") {
      console.log(
        "CORS Debug - Removing wildcard from origins due to credentials=true in production"
      );
    }
    const index = allowedOrigins.indexOf("*");
    if (index > -1) {
      allowedOrigins.splice(index, 1);
    }
  }

  const corsOptions = {
    origin: (origin, callback) => {
      // Only log CORS debug info in development and when there are issues
      const isDevelopment = process.env.NODE_ENV === "development";
      const shouldLog = isDevelopment && process.env.CORS_DEBUG === "true";

      if (shouldLog) {
        console.log("CORS Debug - Origin:", origin);
        console.log("CORS Debug - Allowed Origins:", allowedOrigins);
      }

      // Allow non-browser requests or same-origin with no Origin header
      if (!origin) {
        if (shouldLog) console.log("CORS Debug - No origin header, allowing");
        return callback(null, true);
      }

      // Check exact match first
      let isAllowed = allowedOrigins.some((o) => o === origin);

      // If not allowed, check for Vercel URL patterns
      if (!isAllowed && origin) {
        const isVercelUrl =
          origin.includes(".vercel.app") || origin.includes(".vercel.com");
        if (isVercelUrl) {
          if (shouldLog)
            console.log("CORS Debug - Vercel URL detected, allowing:", origin);
          isAllowed = true;
        }
      }

      // Additional check for skillhands.us subdomains
      if (!isAllowed && origin && origin.includes("skillhands.us")) {
        if (shouldLog)
          console.log(
            "CORS Debug - SkillHands domain detected, allowing:",
            origin
          );
        isAllowed = true;
      }

      // Only log denied requests or when explicitly debugging
      if (!isAllowed || shouldLog) {
        console.log(
          "CORS Debug - Final decision:",
          isAllowed ? "ALLOW" : "DENY",
          "for origin:",
          origin
        );
      }

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

  // Additional CORS handling for preflight requests
  app.use((req, res, next) => {
    if (req.method === "OPTIONS" && process.env.CORS_DEBUG === "true") {
      console.log("CORS Debug - OPTIONS preflight request detected");
      console.log("CORS Debug - Origin:", req.headers.origin);
    }
    next();
  });
};
