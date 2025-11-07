import ServiceRequest from "../models/ServiceRequest.js";
import Profile from "../models/Profile.js";
import User from "../models/User.js";
import * as XLSX from "xlsx";

// Helper function to get date range based on period
const getDateRange = (period) => {
  const now = new Date();
  let startDate = new Date();

  switch (period) {
    case "last-week":
      startDate.setDate(now.getDate() - 7);
      break;
    case "last-month":
      startDate.setMonth(now.getMonth() - 1);
      break;
    case "last-3-months":
      startDate.setMonth(now.getMonth() - 3);
      break;
    default:
      startDate.setMonth(now.getMonth() - 1); // Default to last month
  }

  return { startDate, endDate: now };
};

// Get reports data
export const getReportsData = async (req, res) => {
  try {
    const { period = "last-month" } = req.query;
    const { startDate, endDate } = getDateRange(period);

    // Get service requests for the period
    const serviceRequests = await ServiceRequest.find({
      createdAt: { $gte: startDate, $lte: endDate },
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .select(
        "_id name email phone service description status priority createdAt scheduledDate"
      );

    // Calculate stats
    const totalRequests = serviceRequests.length;
    const completedRequests = serviceRequests.filter(
      (req) => req.status === "completed"
    ).length;
    const inProgressRequests = serviceRequests.filter(
      (req) => req.status === "in-progress" || req.status === "in-process"
    ).length;
    const pendingRequests = serviceRequests.filter(
      (req) => req.status === "pending"
    ).length;

    // Get employee performance data
    const employeePerformance = await getEmployeePerformanceData(
      startDate,
      endDate
    );

    const reportsData = {
      serviceRequests,
      employeePerformance,
      stats: {
        totalRequests,
        completedRequests,
        inProgressRequests,
        pendingRequests,
      },
    };

    return res.json({
      success: true,
      data: reportsData,
    });
  } catch (error) {
    console.error("getReportsData error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to get reports data" });
  }
};

// Get service requests for reports
export const getServiceRequests = async (req, res) => {
  try {
    const { period = "last-month" } = req.query;
    const { startDate, endDate } = getDateRange(period);

    const serviceRequests = await ServiceRequest.find({
      createdAt: { $gte: startDate, $lte: endDate },
    })
      .sort({ createdAt: -1 })
      .select(
        "_id name email phone service description status priority createdAt scheduledDate"
      );

    return res.json({
      success: true,
      data: serviceRequests,
    });
  } catch (error) {
    console.error("getServiceRequests error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to get service requests" });
  }
};

// Get employee performance data
export const getEmployeePerformance = async (req, res) => {
  try {
    const { period = "last-month" } = req.query;
    const { startDate, endDate } = getDateRange(period);

    const employeePerformance = await getEmployeePerformanceData(
      startDate,
      endDate
    );

    return res.json({
      success: true,
      data: employeePerformance,
    });
  } catch (error) {
    console.error("getEmployeePerformance error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to get employee performance" });
  }
};

// Helper function to get employee performance data
const getEmployeePerformanceData = async (startDate, endDate) => {
  try {
    // Get all approved employees with more details
    const employees = await Profile.find({
      $or: [{ status: "approved" }, { verificationStatus: "approved" }],
    })
      .populate("user", "name email")
      .select(
        "_id fullName email phone city state postalCode country designation level skills rating totalJobs user appliedDate createdAt"
      );

    const employeePerformance = [];

    for (const employee of employees) {
      // IMPORTANT: ServiceRequest.assignedEmployee references Profile, not User
      const profileId = employee._id;

      // Get completed jobs for the period
      const completedJobs = await ServiceRequest.countDocuments({
        assignedEmployee: profileId,
        status: "completed",
        updatedAt: { $gte: startDate, $lte: endDate },
      });

      // Get total jobs for the period
      const totalJobs = await ServiceRequest.countDocuments({
        assignedEmployee: profileId,
        createdAt: { $gte: startDate, $lte: endDate },
      });

      // Calculate success rate
      const successRate =
        totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;

      // Get overall completed jobs count
      const overallCompletedJobs = await ServiceRequest.countDocuments({
        assignedEmployee: profileId,
        status: "completed",
      });

      // Calculate efficiency (based on completion rate and rating)
      const rating = employee.rating || 0;
      const efficiency = Math.round((successRate + rating * 20) / 2);

      employeePerformance.push({
        _id: employee._id,
        name: employee.fullName || employee.user?.name || "",
        email: employee.email || employee.user?.email || "",
        phone: employee.phone || "",
        city: employee.city || "",
        state: employee.state || "",
        postalCode: employee.postalCode || "",
        country: employee.country || "",
        designation: Array.isArray(employee.designation)
          ? employee.designation.join(", ")
          : employee.designation || "",
        level: employee.level || "",
        skills: Array.isArray(employee.skills)
          ? employee.skills.join(", ")
          : employee.skills || "",
        completedJobs: overallCompletedJobs,
        rating: rating,
        efficiency: Math.min(efficiency, 100),
        totalJobs: totalJobs,
        successRate: successRate,
        appliedDate: employee.appliedDate || employee.createdAt || null,
      });
    }

    // Sort by efficiency descending
    return employeePerformance.sort((a, b) => b.efficiency - a.efficiency);
  } catch (error) {
    console.error("getEmployeePerformanceData error:", error);
    return [];
  }
};

// Helper function to escape CSV fields
const escapeCSV = (value) => {
  if (value === null || value === undefined) return "";
  const stringValue = String(value);
  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

// Helper function to format phone number (prevent scientific notation in Excel)
const formatPhoneNumber = (phone) => {
  if (!phone) return "";
  const phoneStr = String(phone).replace(/\D/g, ""); // Remove non-digits

  // Format 10-digit numbers as (XXX) XXX-XXXX
  if (phoneStr.length === 10) {
    return `(${phoneStr.slice(0, 3)}) ${phoneStr.slice(3, 6)}-${phoneStr.slice(
      6
    )}`;
  }

  // For other lengths, format with dashes if possible, or return as-is
  // Excel will treat formatted numbers as text
  if (phoneStr.length > 0) {
    return phoneStr;
  }

  // Fallback to original string if no digits found
  return String(phone);
};

// Helper function to format date for Excel
const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  // Format as MM/DD/YYYY HH:MM AM/PM
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const hoursStr = String(hours).padStart(2, "0");
  return `${month}/${day}/${year} ${hoursStr}:${minutes} ${ampm}`;
};

// Export reports
export const exportReports = async (req, res) => {
  try {
    const { period = "last-month", format = "xlsx" } = req.query;
    const { startDate, endDate } = getDateRange(period);

    // Get data for export
    const serviceRequests = await ServiceRequest.find({
      createdAt: { $gte: startDate, $lte: endDate },
    })
      .sort({ createdAt: -1 })
      .select(
        "_id name email phone service description status priority createdAt scheduledDate"
      );

    const employeePerformance = await getEmployeePerformanceData(
      startDate,
      endDate
    );

    if (format === "xlsx" || format === "excel") {
      // Create a new workbook
      const workbook = XLSX.utils.book_new();

      // ===== Service Requests Sheet =====
      const serviceRequestsData = [];

      // Add title rows
      serviceRequestsData.push(["Service Requests Report"]);
      serviceRequestsData.push([`Generated: ${formatDate(new Date())}`]);
      serviceRequestsData.push([`Period: ${period}`]);
      serviceRequestsData.push([]); // Empty row for spacing

      // Add headers
      const headers = [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Service",
        "Status",
        "Priority",
        "Created Date",
      ];
      serviceRequestsData.push(headers);

      // Add data rows
      serviceRequests.forEach((request) => {
        // Convert _id to string to ensure it's displayed
        const requestId = request._id
          ? String(request._id)
          : request.id
          ? String(request.id)
          : "";
        serviceRequestsData.push([
          requestId,
          request.name || "",
          request.email || "",
          formatPhoneNumber(request.phone),
          request.service || "",
          request.status || "",
          request.priority || "",
          formatDate(request.createdAt),
        ]);
      });

      // Create worksheet from data
      const ws = XLSX.utils.aoa_to_sheet(serviceRequestsData);

      // Set column widths for better spacing (wider columns)
      ws["!cols"] = [
        { wch: 30 }, // ID - wider for better readability
        { wch: 25 }, // Name
        { wch: 35 }, // Email - wider to prevent truncation
        { wch: 20 }, // Phone
        { wch: 25 }, // Service
        { wch: 18 }, // Status
        { wch: 15 }, // Priority
        { wch: 25 }, // Created Date - wider to show full date/time
      ];

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, ws, "Service Requests");

      // ===== Employee Performance Sheet =====
      // Always include Employee Performance sheet, even if empty
      const empData = [];

      // Add title rows
      empData.push(["Employee Performance Report"]);
      empData.push([`Generated: ${formatDate(new Date())}`]);
      empData.push([`Period: ${period}`]);
      empData.push([]); // Empty row for spacing

      // Add headers with all employee details
      const empHeaders = [
        "Employee ID",
        "Name",
        "Email",
        "Phone",
        "City",
        "State",
        "Postal Code",
        "Country",
        "Designation",
        "Level",
        "Skills",
        "Completed Jobs",
        "Total Jobs (Period)",
        "Rating",
        "Efficiency",
        "Success Rate",
        "Applied Date",
      ];
      empData.push(empHeaders);

      // Add data rows
      if (employeePerformance.length > 0) {
        employeePerformance.forEach((employee) => {
          const empId = employee._id ? String(employee._id) : "";
          empData.push([
            empId,
            employee.name || "",
            employee.email || "",
            formatPhoneNumber(employee.phone),
            employee.city || "",
            employee.state || "",
            employee.postalCode || "",
            employee.country || "",
            employee.designation || "",
            employee.level || "",
            employee.skills || "",
            employee.completedJobs || 0,
            employee.totalJobs || 0,
            employee.rating || 0,
            employee.efficiency || 0,
            `${employee.successRate || 0}%`,
            formatDate(employee.appliedDate),
          ]);
        });
      } else {
        // Add a message row if no data
        empData.push([
          "No employee performance data available for this period",
        ]);
      }

      // Create worksheet
      const empWs = XLSX.utils.aoa_to_sheet(empData);

      // Set column widths (wider for better spacing)
      empWs["!cols"] = [
        { wch: 30 }, // Employee ID
        { wch: 25 }, // Name
        { wch: 30 }, // Email
        { wch: 18 }, // Phone
        { wch: 20 }, // City
        { wch: 15 }, // State
        { wch: 15 }, // Postal Code
        { wch: 15 }, // Country
        { wch: 25 }, // Designation
        { wch: 15 }, // Level
        { wch: 40 }, // Skills
        { wch: 18 }, // Completed Jobs
        { wch: 20 }, // Total Jobs
        { wch: 12 }, // Rating
        { wch: 15 }, // Efficiency
        { wch: 15 }, // Success Rate
        { wch: 20 }, // Applied Date
      ];

      XLSX.utils.book_append_sheet(workbook, empWs, "Employee Performance");

      // Generate Excel file buffer
      const excelBuffer = XLSX.write(workbook, {
        type: "buffer",
        bookType: "xlsx",
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="Service-Requests-Report-${period}-${
          new Date().toISOString().split("T")[0]
        }.xlsx"`
      );
      res.send(excelBuffer);
    } else if (format === "csv") {
      // Generate CSV content with Excel-compatible formatting
      // Add UTF-8 BOM for proper Excel encoding
      let csvContent = "\uFEFF";

      // Title row (merged style)
      csvContent += "Service Requests Report\n";
      csvContent += `Generated: ${formatDate(new Date())}\n`;
      csvContent += `Period: ${period}\n\n`;

      // Headers with proper formatting
      const headers = [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Service",
        "Status",
        "Priority",
        "Created Date",
      ];
      csvContent += headers.map(escapeCSV).join(",") + "\n";

      // Data rows with proper formatting
      serviceRequests.forEach((request) => {
        // Convert _id to string to ensure it's displayed
        const requestId = request._id
          ? String(request._id)
          : request.id
          ? String(request.id)
          : "";
        const row = [
          requestId,
          request.name || "",
          request.email || "",
          formatPhoneNumber(request.phone),
          request.service || "",
          request.status || "",
          request.priority || "",
          formatDate(request.createdAt),
        ];
        csvContent += row.map(escapeCSV).join(",") + "\n";
      });

      // Employee Performance section
      csvContent += "\n\nEmployee Performance Report\n\n";
      const empHeaders = [
        "Employee ID",
        "Name",
        "Email",
        "Phone",
        "City",
        "State",
        "Postal Code",
        "Country",
        "Designation",
        "Level",
        "Skills",
        "Completed Jobs",
        "Total Jobs (Period)",
        "Rating",
        "Efficiency",
        "Success Rate",
        "Applied Date",
      ];
      csvContent += empHeaders.map(escapeCSV).join(",") + "\n";

      if (employeePerformance.length > 0) {
        employeePerformance.forEach((employee) => {
          const empId = employee._id ? String(employee._id) : "";
          const row = [
            empId,
            employee.name || "",
            employee.email || "",
            formatPhoneNumber(employee.phone),
            employee.city || "",
            employee.state || "",
            employee.postalCode || "",
            employee.country || "",
            employee.designation || "",
            employee.level || "",
            employee.skills || "",
            employee.completedJobs || 0,
            employee.totalJobs || 0,
            employee.rating || 0,
            employee.efficiency || 0,
            `${employee.successRate || 0}%`,
            formatDate(employee.appliedDate),
          ];
          csvContent += row.map(escapeCSV).join(",") + "\n";
        });
      } else {
        csvContent +=
          "No employee performance data available for this period\n";
      }

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="Service-Requests-Report-${period}-${
          new Date().toISOString().split("T")[0]
        }.csv"`
      );
      res.send(csvContent);
    } else {
      // Return JSON format
      res.json({
        success: true,
        data: {
          serviceRequests,
          employeePerformance,
          period,
          generatedAt: new Date().toISOString(),
        },
      });
    }
  } catch (error) {
    console.error("exportReports error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to export reports" });
  }
};
