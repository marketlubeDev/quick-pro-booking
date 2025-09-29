import ServiceRequest from "../models/ServiceRequest.js";

/**
 * Migration script to update urgency field based on preferredTime for existing service requests
 */
export const migrateUrgencyFromPreferredTime = async () => {
  try {
    console.log("Starting urgency migration...");

    // Find all service requests that need urgency updates
    const requests = await ServiceRequest.find({
      $or: [
        { urgency: "routine" }, // Only update routine ones to avoid overwriting manual settings
        { urgency: { $exists: false } }
      ]
    });

    console.log(`Found ${requests.length} service requests to check`);

    let updatedCount = 0;

    for (const request of requests) {
      if (!request.preferredTime) continue;

      let newUrgency = "routine";
      
      if (request.preferredTime.toLowerCase().includes("emergency")) {
        newUrgency = "emergency";
      } else if (request.preferredTime.toLowerCase().includes("asap") || 
                 request.preferredTime.toLowerCase().includes("urgent")) {
        newUrgency = "urgent";
      }

      // Only update if urgency would change
      if (newUrgency !== request.urgency) {
        await ServiceRequest.findByIdAndUpdate(request._id, { urgency: newUrgency });
        updatedCount++;
        console.log(`Updated request ${request._id}: "${request.preferredTime}" -> ${newUrgency}`);
      }
    }

    console.log(`Migration completed. Updated ${updatedCount} service requests.`);
    return { success: true, updatedCount };
  } catch (error) {
    console.error("Migration error:", error);
    return { success: false, error: error.message };
  }
};

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateUrgencyFromPreferredTime()
    .then(result => {
      console.log("Migration result:", result);
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error("Migration failed:", error);
      process.exit(1);
    });
}
