// Validation middleware for customer updates
export const validateCustomerUpdate = (req, res, next) => {
  const { body } = req;
  const errors = [];

  // Validate email format if provided
  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.push("Invalid email format");
  }

  // Validate phone format if provided
  if (body.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(body.phone.replace(/[\s\-\(\)]/g, ''))) {
    errors.push("Invalid phone number format");
  }

  // Validate postal code format if provided
  if (body.postalCode && !/^[0-9]{5}(-[0-9]{4})?$/.test(body.postalCode)) {
    errors.push("Invalid postal code format (use 12345 or 12345-6789)");
  }

  // Validate expected salary if provided
  if (body.expectedSalary !== undefined && (isNaN(body.expectedSalary) || body.expectedSalary < 0)) {
    errors.push("Expected salary must be a positive number");
  }

  // Validate rating if provided
  if (body.rating !== undefined && (isNaN(body.rating) || body.rating < 0 || body.rating > 5)) {
    errors.push("Rating must be a number between 0 and 5");
  }

  // Validate total jobs if provided
  if (body.totalJobs !== undefined && (isNaN(body.totalJobs) || body.totalJobs < 0)) {
    errors.push("Total jobs must be a non-negative number");
  }

  // Validate level if provided
  if (body.level && !['Beginner', 'Intermediate', 'Expert'].includes(body.level)) {
    errors.push("Level must be one of: Beginner, Intermediate, Expert");
  }

  // Validate verification status if provided
  if (body.verificationStatus && !['pending', 'approved', 'rejected'].includes(body.verificationStatus)) {
    errors.push("Verification status must be one of: pending, approved, rejected");
  }

  // Validate status if provided
  if (body.status && !['pending', 'approved', 'rejected'].includes(body.status)) {
    errors.push("Status must be one of: pending, approved, rejected");
  }

  // Validate work experience array if provided
  if (body.workExperience && Array.isArray(body.workExperience)) {
    body.workExperience.forEach((exp, index) => {
      if (!exp.company || !exp.position || !exp.startDate) {
        errors.push(`Work experience ${index + 1}: company, position, and start date are required`);
      }
      if (exp.startDate && exp.endDate && new Date(exp.startDate) > new Date(exp.endDate)) {
        errors.push(`Work experience ${index + 1}: start date cannot be after end date`);
      }
    });
  }

  // Validate certifications array if provided
  if (body.certifications && Array.isArray(body.certifications)) {
    body.certifications.forEach((cert, index) => {
      if (!cert.name) {
        errors.push(`Certification ${index + 1}: name is required`);
      }
    });
  }

  // Validate skills array if provided
  if (body.skills && !Array.isArray(body.skills)) {
    errors.push("Skills must be an array");
  }

  // Validate working zip codes array if provided
  if (body.workingZipCodes && !Array.isArray(body.workingZipCodes)) {
    errors.push("Working zip codes must be an array");
  }

  // Validate working cities array if provided
  if (body.workingCities && !Array.isArray(body.workingCities)) {
    errors.push("Working cities must be an array");
  }

  // Validate designation array if provided
  if (body.designation && !Array.isArray(body.designation)) {
    errors.push("Designation must be an array");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation errors",
      errors: errors
    });
  }

  next();
};

// Validation middleware for query parameters
export const validateCustomerQuery = (req, res, next) => {
  const { page, limit, role, status } = req.query;
  const errors = [];

  // Validate page
  if (page && (isNaN(page) || parseInt(page) < 1)) {
    errors.push("Page must be a positive integer");
  }

  // Validate limit
  if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
    errors.push("Limit must be a positive integer between 1 and 100");
  }

  // Validate role
  if (role && !['admin', 'employee'].includes(role)) {
    errors.push("Role must be either 'admin' or 'employee'");
  }

  // Validate status
  if (status && !['pending', 'approved', 'rejected'].includes(status)) {
    errors.push("Status must be one of: pending, approved, rejected");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Query validation errors",
      errors: errors
    });
  }

  next();
};
