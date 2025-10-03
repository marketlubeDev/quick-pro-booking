import ServiceRequest from "../models/ServiceRequest.js";
import Profile from "../models/Profile.js";
import User from "../models/User.js";

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
    // Get all approved employees
    const employees = await Profile.find({
      $or: [{ status: "approved" }, { verificationStatus: "approved" }],
    })
      .populate("user", "name email")
      .select("_id fullName email rating totalJobs user");

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
        name: employee.fullName || employee.user.name,
        email: employee.email || employee.user.email,
        completedJobs: overallCompletedJobs,
        rating: rating,
        efficiency: Math.min(efficiency, 100),
        totalJobs: totalJobs,
        successRate: successRate,
      });
    }

    // Sort by efficiency descending
    return employeePerformance.sort((a, b) => b.efficiency - a.efficiency);
  } catch (error) {
    console.error("getEmployeePerformanceData error:", error);
    return [];
  }
};

// Export reports
export const exportReports = async (req, res) => {
  try {
    const { period = "last-month", format = "csv" } = req.query;
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

    if (format === "csv") {
      // Generate CSV content
      let csvContent = "Service Requests Report\n\n";
      csvContent +=
        "ID,Name,Email,Phone,Service,Status,Priority,Created Date\n";

      serviceRequests.forEach((request) => {
        csvContent += `${request._id},${request.name || ""},${
          request.email || ""
        },${request.phone || ""},${request.service || ""},${
          request.status || ""
        },${request.priority || ""},${request.createdAt}\n`;
      });

      csvContent += "\n\nEmployee Performance Report\n\n";
      csvContent +=
        "Name,Email,Completed Jobs,Rating,Efficiency,Success Rate\n";

      employeePerformance.forEach((employee) => {
        csvContent += `${employee.name},${employee.email},${employee.completedJobs},${employee.rating},${employee.efficiency},${employee.successRate}\n`;
      });

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=reports-${period}-${
          new Date().toISOString().split("T")[0]
        }.csv`
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
