import { CleanupConfig } from "../config/CleanupConfig.js";
import { InstanceService } from "../services/InstanceService.js";

export const startInstanceCleanup = (
  instanceService: InstanceService,
  cleanupConfig: CleanupConfig
) => {
  // Defaults: 30 secs for EXPIRATION_AGE, 10 secs for CLEANUP_INTERVAL
  const { EXPIRATION_AGE = 30000, CLEANUP_INTERVAL = 10000 } = cleanupConfig;

  setInterval(async () => {
    const currentTime = Date.now();

    try {
      // Suppress errors with 'true' passed in:
      const allInstances = await instanceService.getAllInstances(true);

      if (allInstances) {
        for (const instance of allInstances) {
          if (currentTime - instance.updatedAt >= EXPIRATION_AGE) {
            await instanceService.removeInstance(
              instance.group,
              instance.id,
              true
            );
            console.log(
              `Instance ${instance.id} in group ${
                instance.group
              } removed due to expiry at ${new Date(currentTime).toISOString()}`
            );
          }
        }
      }
    } catch (error) {
      console.error("Error during cleanup:", error);
    }
  }, CLEANUP_INTERVAL);
};
