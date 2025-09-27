// Environment validation utility
export const validateEnvironment = () => {
  const requiredVars = [
    "MONGODB_URI",
    "JWT_SECRET",
    "EMAIL_HOST",
    "EMAIL_PORT",
    "EMAIL_USER",
    "EMAIL_PASS",
    "EMAIL_FROM",
    "EMAIL_TO",
  ];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error("❌ Missing required environment variables:", missingVars);
    return false;
  }

  console.log("✅ All required environment variables are set");
  return true;
};

// Validate email configuration
export const validateEmailConfig = () => {
  const emailVars = [
    "EMAIL_HOST",
    "EMAIL_PORT",
    "EMAIL_USER",
    "EMAIL_PASS",
    "EMAIL_FROM",
    "EMAIL_TO",
  ];
  const missingEmailVars = emailVars.filter((varName) => !process.env[varName]);

  if (missingEmailVars.length > 0) {
    console.error("❌ Missing email configuration:", missingEmailVars);
    return false;
  }

  // Validate email port is a number
  const port = parseInt(process.env.EMAIL_PORT);
  if (isNaN(port) || port < 1 || port > 65535) {
    console.error("❌ Invalid EMAIL_PORT:", process.env.EMAIL_PORT);
    return false;
  }

  console.log("✅ Email configuration is valid");
  return true;
};

// Validate database configuration
export const validateDatabaseConfig = () => {
  if (!process.env.MONGODB_URI) {
    console.error("❌ MONGODB_URI is not set");
    return false;
  }

  if (
    !process.env.MONGODB_URI.startsWith("mongodb://") &&
    !process.env.MONGODB_URI.startsWith("mongodb+srv://")
  ) {
    console.error("❌ Invalid MONGODB_URI format");
    return false;
  }

  console.log("✅ Database configuration is valid");
  return true;
};
