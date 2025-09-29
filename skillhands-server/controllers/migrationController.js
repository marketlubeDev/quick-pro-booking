import { migrateUrgencyFromPreferredTime } from "../utils/migrateUrgency.js";

/**
 * Controller to run urgency migration
 */
export const runUrgencyMigration = async (req, res) => {
  try {
    console.log("Starting urgency migration via API...");
    
    const result = await migrateUrgencyFromPreferredTime();
    
    if (result.success) {
      return res.json({
        success: true,
        message: `Migration completed successfully. Updated ${result.updatedCount} service requests.`,
        updatedCount: result.updatedCount
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Migration failed",
        error: result.error
      });
    }
  } catch (error) {
    console.error("Migration controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Migration failed",
      error: error.message
    });
  }
};
