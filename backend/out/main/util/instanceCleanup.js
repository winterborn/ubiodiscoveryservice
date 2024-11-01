export const startInstanceCleanup = (instanceService, cleanupConfig) => {
    const { EXPIRATION_AGE = 30000, CLEANUP_INTERVAL = 10000 } = cleanupConfig;
    setInterval(async () => {
        const currentTime = Date.now();
        try {
            const allInstances = await instanceService.getAllInstances(true);
            if (allInstances) {
                for (const instance of allInstances) {
                    if (currentTime - instance.updatedAt >= EXPIRATION_AGE) {
                        await instanceService.removeInstance(instance.group, instance.id, true);
                        console.log(`Instance ${instance.id} in group ${instance.group} removed due to expiry at ${new Date(currentTime).toISOString()}`);
                    }
                }
            }
        }
        catch (error) {
            console.error("Error during cleanup:", error);
        }
    }, CLEANUP_INTERVAL);
};
//# sourceMappingURL=instanceCleanup.js.map